<?php

namespace Tests\Feature;

use App\Enums\EstadoMensaje;
use App\Enums\EstadoPqr;
use App\Enums\Rol;
use App\Enums\TipoPqr;
use App\Enums\TipoServicio;
use App\Models\Mensaje;
use App\Models\PortafolioProyecto;
use App\Models\Pqr;
use App\Models\Sesion;
use App\Models\SiteConfig;
use App\Models\Usuario;
use App\Services\Auth\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Tests\TestCase;

class SitioWebTest extends TestCase
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

    public function test_catalogo_portafolio_publico_solo_muestra_activos(): void
    {
        PortafolioProyecto::create(['titulo' => 'Proyecto A', 'activo' => true, 'orden' => 1]);
        PortafolioProyecto::create(['titulo' => 'Proyecto B', 'activo' => false, 'orden' => 2]);

        $this->getJson('/api/v1/portafolio')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Proyecto A');

        // Test alias legacy /proyectos
        $this->getJson('/api/v1/proyectos')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_envio_formulario_cotiza_con_nosotros_valida_campos_requeridos(): void
    {
        // Validación de campos
        $this->postJson('/api/v1/mensajes', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nombre_completo', 'correo', 'tipo_servicio', 'detalles']);

        // Envío exitoso
        $resp = $this->postJson('/api/v1/mensajes', [
            'nombre_completo' => 'Carlos Rodriguez',
            'correo' => 'carlos@ejemplo.com',
            'telefono' => '+57 300 123 4567',
            'tipo_servicio' => TipoServicio::DisenoConstruccionIntegral->value,
            'detalles' => 'Construcción de vivienda campestre en lote de 500 m2 con acabados bioclimáticos.',
            'consentimiento_datos' => true,
        ])->assertStatus(201);

        $this->assertDatabaseHas('mensajes', [
            'nombre_completo' => 'Carlos Rodriguez',
            'correo' => 'carlos@ejemplo.com',
            'estado' => EstadoMensaje::Nuevo->value,
        ]);
    }

    public function test_radicacion_y_consulta_publica_de_pqr(): void
    {
        $resp = $this->postJson('/api/v1/pqr', [
            'tipo' => TipoPqr::Peticion->value,
            'nombre_completo' => 'Ana Gómez',
            'correo' => 'ana@ejemplo.com',
            'telefono' => '3109876543',
            'asunto' => 'Consulta sobre cronograma de obra',
            'descripcion' => 'Deseo conocer la fecha estimada de entrega de la fase de acabados.',
            'consentimiento_datos' => true,
        ])->assertStatus(201);

        $radicado = $resp->json('data.radicado');
        $this->assertStringStartsWith('PQR-', $radicado);

        // Consulta pública con radicado y correo correcto
        $this->postJson('/api/v1/pqr/consultar', [
            'radicado' => $radicado,
            'correo' => 'ana@ejemplo.com',
        ])->assertOk()
          ->assertJsonPath('data.radicado', $radicado)
          ->assertJsonPath('data.estado', EstadoPqr::Radicado->value);

        // Consulta con correo equivocado falla
        $this->postJson('/api/v1/pqr/consultar', [
            'radicado' => $radicado,
            'correo' => 'otro@ejemplo.com',
        ])->assertStatus(404);
    }

    public function test_conversion_de_mensaje_en_lead_crm(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        $mensaje = Mensaje::create([
            'nombre_completo' => 'Mauricio Londoño',
            'correo' => 'mauricio@ejemplo.com',
            'telefono' => '3123456789',
            'tipo_servicio' => TipoServicio::DisenoArquitectonico,
            'detalles' => 'Planos para remodelación de oficinas corporativas.',
            'estado' => EstadoMensaje::Nuevo,
        ]);

        $this->withToken($token)
            ->postJson("/api/v1/admin/mensajes/{$mensaje->id}/convertir-en-lead")
            ->assertOk()
            ->assertJsonPath('data.cliente.email', 'mauricio@ejemplo.com');

        $this->assertDatabaseHas('clientes', ['email' => 'mauricio@ejemplo.com']);
        $this->assertDatabaseHas('oportunidades', ['cliente_id' => $mensaje->fresh()->convertido_cliente_id]);
        $this->assertSame(EstadoMensaje::Convertido, $mensaje->fresh()->estado);
    }

    public function test_regla_autoproteccion_administrador(): void
    {
        $admin = Usuario::factory()->admin()->create();
        $otroAdmin = Usuario::factory()->admin()->create();
        $token = $this->tokenAdmin($admin);

        // No puede desactivarse a sí mismo
        $this->withToken($token)
            ->patchJson("/api/v1/admin/usuarios/{$admin->id}/estado")
            ->assertStatus(403);

        // No puede eliminarse a sí mismo
        $this->withToken($token)
            ->deleteJson("/api/v1/admin/usuarios/{$admin->id}")
            ->assertStatus(403);

        // Pero sí puede cambiar el estado de otro usuario
        $this->withToken($token)
            ->patchJson("/api/v1/admin/usuarios/{$otroAdmin->id}/estado")
            ->assertOk();
    }
}
