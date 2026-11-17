<?php

namespace Database\Seeders;

use App\Enums\Rol;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /** Crea el admin inicial con credenciales tomadas del .env (nunca hardcodeadas). */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD no definidos en .env: se omite la creación del admin.');

            return;
        }

        Usuario::updateOrCreate(
            ['email' => $email],
            ['nombre' => env('ADMIN_NOMBRE', 'Administrador'), 'password' => $password, 'rol' => Rol::Admin, 'activo' => true]
        );
    }
}
