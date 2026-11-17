<?php

namespace Database\Factories;

use App\Enums\Rol;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Usuario> */
class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'Clave-Segura-2026!',
            'rol' => Rol::Comercial,
            'activo' => true,
        ];
    }

    public function admin(): static
    {
        return $this->state(['rol' => Rol::Admin]);
    }

    public function con2fa(string $secreto): static
    {
        return $this->state(['two_factor_secret' => $secreto, 'two_factor_confirmed_at' => now()]);
    }
}
