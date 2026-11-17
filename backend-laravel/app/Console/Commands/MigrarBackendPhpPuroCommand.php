<?php

namespace App\Console\Commands;

use App\Enums\Rol;
use App\Models\Mensaje;
use App\Models\PortafolioImagen;
use App\Models\PortafolioProyecto;
use App\Models\SiteConfig;
use App\Models\Usuario;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class MigrarBackendPhpPuroCommand extends Command
{
    protected $signature = 'sysmicon:migrar-php-puro {--host= : Host de la BD antigua} {--database= : Nombre de la BD antigua} {--username= : Usuario BD antigua} {--password= : Password BD antigua}';
    protected $description = 'Migra datos existentes desde la base de datos de PHP puro hacia el nuevo esquema Laravel CRM';

    public function handle(): int
    {
        $this->info('Iniciando proceso de migración de datos desde backend PHP puro...');

        $host = $this->option('host') ?: env('DB_HOST', '127.0.0.1');
        $dbName = $this->option('database') ?: env('LEGACY_DB_DATABASE');
        $user = $this->option('username') ?: env('DB_USERNAME', 'root');
        $pass = $this->option('password') ?: env('DB_PASSWORD', '');

        if (! $dbName) {
            $this->warn('Para migrar de forma automatizada configure LEGACY_DB_DATABASE en .env o pase las opciones --database');

            return Command::SUCCESS;
        }

        try {
            $legacyPdo = new \PDO("mysql:host={$host};dbname={$dbName};charset=utf8mb4", $user, $pass, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            ]);

            // 1. Migrar Usuarios
            $users = $legacyPdo->query("SELECT * FROM users")->fetchAll();
            foreach ($users as $u) {
                Usuario::updateOrCreate(
                    ['email' => $u['email']],
                    [
                        'nombre' => $u['nombre'] ?? 'Usuario Staff',
                        'password' => $u['password_hash'] ?? $u['password'],
                        'rol' => ($u['rol'] ?? 'admin') === 'admin' ? Rol::Admin : Rol::Comercial,
                        'activo' => (bool) ($u['activo'] ?? true),
                    ]
                );
            }
            $this->info('Usuarios migrados: '.count($users));

            // 2. Migrar Proyectos de Portafolio
            $proyectos = $legacyPdo->query("SELECT * FROM proyectos")->fetchAll();
            foreach ($proyectos as $p) {
                $port = PortafolioProyecto::updateOrCreate(
                    ['id' => $p['id']],
                    [
                        'titulo' => $p['titulo'] ?? $p['nombre'],
                        'descripcion' => $p['descripcion'] ?? null,
                        'categoria' => $p['categoria'] ?? null,
                        'ubicacion' => $p['ubicacion'] ?? null,
                        'activo' => (bool) ($p['activo'] ?? true),
                        'orden' => (int) ($p['orden'] ?? 0),
                    ]
                );
            }
            $this->info('Portafolio migrado: '.count($proyectos));

            // 3. Migrar Imágenes de Portafolio
            $imagenes = $legacyPdo->query("SELECT * FROM proyecto_imagenes")->fetchAll();
            foreach ($imagenes as $img) {
                PortafolioImagen::updateOrCreate(
                    ['id' => $img['id']],
                    [
                        'portafolio_proyecto_id' => $img['proyecto_id'],
                        'url' => $img['url'],
                        'public_id' => $img['public_id'] ?? null,
                        'orden' => (int) ($img['orden'] ?? 0),
                    ]
                );
            }
            $this->info('Imágenes de portafolio migradas: '.count($imagenes));

            // 4. Migrar Configuración
            $configs = $legacyPdo->query("SELECT * FROM site_config")->fetchAll();
            foreach ($configs as $c) {
                SiteConfig::updateOrCreate(
                    ['clave' => $c['clave']],
                    ['valor' => json_decode($c['valor'], true) ?: $c['valor']]
                );
            }
            $this->info('Configuraciones migradas: '.count($configs));

            $this->info('¡Migración completada con éxito!');

            return Command::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Error durante la migración: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
