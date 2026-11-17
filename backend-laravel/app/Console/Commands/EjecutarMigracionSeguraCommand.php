<?php

namespace App\Console\Commands;

use App\Enums\Rol;
use App\Models\SiteConfig;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EjecutarMigracionSeguraCommand extends Command
{
    protected $signature = 'sysmicon:migrar-seguro';
    protected $description = 'Ejecuta migraciones preservando y migrando datos legacy de Hostinger';

    public function handle(): int
    {
        $this->info('1. Verificando tablas existentes en Hostinger MySQL...');

        $tablasLegacy = ['users', 'proyectos', 'proyecto_imagenes', 'mensajes', 'page_views', 'refresh_tokens', 'site_config'];
        foreach ($tablasLegacy as $t) {
            if (Schema::hasTable($t) && ! Schema::hasTable('_legacy_'.$t)) {
                DB::statement("RENAME TABLE `{$t}` TO `_legacy_{$t}`");
                $this->info("   -> Tabla '{$t}' respaldada como '_legacy_{$t}'.");
            }
        }

        $this->info('2. Ejecutando migraciones de Laravel...');
        $exitCode = Artisan::call('migrate', ['--force' => true], $this->output);
        if ($exitCode !== 0) {
            $this->error('Error al ejecutar las migraciones.');

            return Command::FAILURE;
        }

        $this->info('3. Migrando datos existentes a las nuevas tablas...');

        // 3.1 Migrar Usuarios directamente vía DB::table para preservar el hash bcrypt existente
        if (Schema::hasTable('_legacy_users')) {
            $users = DB::table('_legacy_users')->get();
            foreach ($users as $u) {
                DB::table('usuarios')->updateOrInsert(
                    ['email' => $u->email],
                    [
                        'nombre' => $u->nombre,
                        'password' => $u->password,
                        'rol' => ($u->rol ?? 'admin') === 'admin' ? Rol::Admin->value : Rol::Comercial->value,
                        'activo' => ($u->estado ?? 'activo') === 'activo',
                        'created_at' => $u->created_at ?? now(),
                        'updated_at' => $u->updated_at ?? now(),
                    ]
                );
            }
            $this->info("   -> ".count($users)." usuario(s) migrado(s) a 'usuarios'.");
        }

        // 3.2 Migrar Site Config
        if (Schema::hasTable('_legacy_site_config')) {
            $configs = DB::table('_legacy_site_config')->get();
            foreach ($configs as $c) {
                $clave = $c->config_key ?? $c->clave ?? null;
                $valor = $c->config_value ?? $c->valor ?? null;
                if ($clave) {
                    SiteConfig::updateOrCreate(
                        ['clave' => $clave],
                        ['valor' => $valor]
                    );
                }
            }
            $this->info("   -> ".count($configs)." configuración(es) migrada(s) a 'site_config'.");
        }

        // 3.3 Migrar Page Views
        if (Schema::hasTable('_legacy_page_views')) {
            $views = DB::table('_legacy_page_views')->get();
            foreach ($views as $v) {
                DB::table('page_views')->insertOrIgnore([
                    'pagina' => $v->page ?? $v->pagina ?? '/',
                    'dispositivo' => $v->device ?? $v->dispositivo ?? 'desktop',
                    'referrer' => $v->referrer ?? null,
                    'ip_hash' => $v->ip_hash ?? null,
                    'created_at' => $v->created_at ?? now(),
                ]);
            }
            $this->info("   -> ".count($views)." vista(s) migrada(s) a 'page_views'.");
        }

        $this->info('¡MIGRACIÓN Y SINCRONIZACIÓN COMPLETADA CON ÉXITO!');

        return Command::SUCCESS;
    }
}
