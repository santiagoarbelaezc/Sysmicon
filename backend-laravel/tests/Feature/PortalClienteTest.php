<?php

namespace Tests\Feature;

use App\Models\CuentaCliente;
use App\Models\NovedadProyecto;
use App\Models\Proyecto;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalClienteTest extends TestCase
{
    use RefreshDatabase;

    public function test_registro_exitoso_de_cliente(): void
    {
        $resp = $this->postJson('/api/v1/cuenta/registro', [
            'nombre' => 'Mateo Henao',
            'email' => 'mateo@ejemplo.com',
            'telefono' => '3005557788',
            'password' => 'Sysmicon-Pass-2026!',
            'acepta_novedades' => true,
            'consentimiento_datos' => true,
        ])->assertStatus(201);

        $this->assertDatabaseHas('cuentas_clientes', ['email' => 'mateo@ejemplo.com']);
    }

    public function test_cliente_autenticado_no_puede_ingresar_al_panel_admin_en_ningun_caso(): void
    {
        $cuenta = CuentaCliente::create([
            'nombre' => 'Camilo Torres',
            'email' => 'camilo@ejemplo.com',
            'password' => 'Sysmicon-Pass-2026!',
            'activo' => true,
        ]);

        $login = $this->postJson('/api/v1/cuenta/login', [
            'email' => 'camilo@ejemplo.com',
            'password' => 'Sysmicon-Pass-2026!',
        ])->assertOk();

        $tokenCliente = $login->json('data.access_token');
        $this->assertNotEmpty($tokenCliente);

        // Puede acceder a su propio portal de cliente
        $this->withToken($tokenCliente)->getJson('/api/v1/cuenta/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'camilo@ejemplo.com');

        // SEGURIDAD ESTRICTA: Acceso a cualquier ruta /admin/* DEBE ser bloqueado con 403 Forbidden
        $this->withToken($tokenCliente)->getJson('/api/v1/admin/clientes')
            ->assertStatus(403);

        $this->withToken($tokenCliente)->getJson('/api/v1/admin/dashboard/kpis')
            ->assertStatus(403);

        $this->withToken($tokenCliente)->getJson('/api/v1/admin/usuarios')
            ->assertStatus(403);
    }
}
