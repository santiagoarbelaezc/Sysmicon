<?php

namespace Tests\Feature;

use App\Enums\EstadoProyecto;
use App\Enums\EtapaOportunidad;
use App\Enums\FaseProyecto;
use App\Enums\TipoActividad;
use App\Enums\TipoCliente;
use App\Enums\TipoProyecto;
use App\Models\Cliente;
use App\Models\Oportunidad;
use App\Models\Proyecto;
use App\Models\Sesion;
use App\Models\Usuario;
use App\Services\Auth\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CrmTest extends TestCase
{
    use RefreshDatabase;

    private function tokenAdmin(Usuario $admin): string
    {
        $sesion = Sesion::create([
            'id' => (string) Str::uuid(),
            'guard' => 'staff',
            'sujeto_id' => $admin->id,
            'refresh_hash' => hash('sha256', Str::random(32)),
            'familia_id' => (string) Str::uuid(),
            'expira_at' => now()->addHours(12),
            'ultimo_uso_at' => now(),
        ]);

        return app(TokenService::class)->emitir('staff', $admin->id, $sesion->id, [
            'rol' => $admin->rol->value,
            'tfa' => true,
        ]);
    }

    public function test_gestion_clientes_con_contactos(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $resp = $this->withToken($token)->postJson('/api/v1/admin/clientes', [
            'tipo' => TipoCliente::Empresa->value,
            'nombre' => 'Constructora Los Andes SAS',
            'email' => 'contacto@losandes.co',
            'telefono' => '3001234567',
            'ciudad' => 'Armenia',
            'contactos' => [
                [
                    'nombre' => 'Ing. Felipe Restrepo',
                    'cargo' => 'Director de Compras',
                    'email' => 'felipe@losandes.co',
                    'telefono' => '3112223344',
                ],
            ],
        ])->assertStatus(201);

        $this->assertDatabaseHas('clientes', ['nombre' => 'Constructora Los Andes SAS']);
        $this->assertDatabaseHas('contactos', ['nombre' => 'Ing. Felipe Restrepo']);
    }

    public function test_cambio_etapa_a_ganado_crea_automaticamente_proyecto_de_obra(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $cliente = Cliente::create([
            'tipo' => TipoCliente::Persona,
            'nombre' => 'Sofía Vergara',
            'email' => 'sofia@ejemplo.com',
        ]);

        $oportunidad = Oportunidad::create([
            'cliente_id' => $cliente->id,
            'titulo' => 'Mansión Campestre La Reserva',
            'tipo_proyecto' => TipoProyecto::Vivienda,
            'etapa' => EtapaOportunidad::Negociacion,
            'valor_estimado' => 450000000,
            'probabilidad' => 80,
            'responsable_id' => $admin->id,
        ]);

        // Cambiar a ganado
        $resp = $this->withToken($token)
            ->patchJson("/api/v1/admin/oportunidades/{$oportunidad->id}/etapa", [
                'etapa' => EtapaOportunidad::Ganado->value,
            ])->assertOk();

        $this->assertNotNull($resp->json('data.proyecto_creado'));
        $this->assertDatabaseHas('proyectos', [
            'oportunidad_id' => $oportunidad->id,
            'nombre' => 'Mansión Campestre La Reserva',
            'presupuesto' => 450000000,
            'estado' => EstadoProyecto::Activo->value,
        ]);

        // Verifica que se generó una actividad automática en la bitácora
        $this->assertDatabaseHas('actividades', [
            'oportunidad_id' => $oportunidad->id,
            'tipo' => TipoActividad::Nota->value,
        ]);
    }

    public function test_etapa_perdido_exige_motivo_de_perdida(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $cliente = Cliente::create(['tipo' => TipoCliente::Persona, 'nombre' => 'Pedro']);
        $oportunidad = Oportunidad::create([
            'cliente_id' => $cliente->id,
            'titulo' => 'Proyecto Comercial',
            'tipo_proyecto' => TipoProyecto::Comercial,
            'etapa' => EtapaOportunidad::Propuesta,
        ]);

        // Sin motivo falla
        $this->withToken($token)
            ->patchJson("/api/v1/admin/oportunidades/{$oportunidad->id}/etapa", [
                'etapa' => EtapaOportunidad::Perdido->value,
            ])->assertStatus(422);

        // Con motivo tiene éxito
        $this->withToken($token)
            ->patchJson("/api/v1/admin/oportunidades/{$oportunidad->id}/etapa", [
                'etapa' => EtapaOportunidad::Perdido->value,
                'motivo_perdida' => 'Presupuesto fuera del alcance del cliente.',
            ])->assertOk();

        $this->assertSame(0, $oportunidad->fresh()->probabilidad);
        $this->assertSame('Presupuesto fuera del alcance del cliente.', $oportunidad->fresh()->motivo_perdida);
    }

    public function test_propuestas_generan_consecutivo_automatico(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $cliente = Cliente::create(['tipo' => TipoCliente::Persona, 'nombre' => 'Laura']);
        $oportunidad = Oportunidad::create([
            'cliente_id' => $cliente->id,
            'titulo' => 'Casa de Campo',
            'tipo_proyecto' => TipoProyecto::Vivienda,
        ]);

        $resp = $this->withToken($token)->postJson('/api/v1/admin/propuestas', [
            'oportunidad_id' => $oportunidad->id,
            'valor' => 120000000,
        ])->assertStatus(201);

        $numero = $resp->json('data.numero');
        $ano = date('Y');
        $this->assertStringStartsWith("PRO-{$ano}-", $numero);
    }

    public function test_dashboard_kpis_y_calendario(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $this->withToken($token)->getJson('/api/v1/admin/dashboard/kpis')
            ->assertOk()
            ->assertJsonStructure(['data' => ['clientes_totales', 'pipeline_valor_estimado', 'proyectos_activos']]);

        $this->withToken($token)->getJson('/api/v1/admin/dashboard/pipeline')
            ->assertOk()
            ->assertJsonStructure(['data' => ['contacto', 'visita', 'propuesta', 'negociacion', 'ganado', 'perdido']]);

        $this->withToken($token)->getJson('/api/v1/admin/calendario')
            ->assertOk();
    }
}
