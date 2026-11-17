<?php

namespace Tests\Feature;

use App\Enums\Rol;
use App\Models\AuditoriaAcceso;
use App\Models\Sesion;
use App\Models\Usuario;
use App\Services\Auth\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private const PASS = 'Clave-Segura-2026!';

    private function cookieName(): string
    {
        return config('sysmicon.auth.refresh_cookie');
    }

    private function login(Usuario $u, array $extra = [], string $pass = self::PASS)
    {
        return $this->postJson('/api/v1/auth/login', array_merge(['email' => $u->email, 'password' => $pass], $extra));
    }

    private function refreshCookieDe($response): string
    {
        $cookie = collect($response->headers->getCookies())->first(fn ($c) => $c->getName() === $this->cookieName());
        $this->assertNotNull($cookie, 'No se emitió la cookie de refresh');

        return $cookie->getValue();
    }

    private function refrescar(string $plano)
    {
        return $this->withCredentials()->withUnencryptedCookie($this->cookieName(), $plano)->postJson('/api/v1/auth/refresh');
    }

    public function test_login_exitoso_emite_access_token_y_cookie_httponly_estricta(): void
    {
        $u = Usuario::factory()->create();
        $r = $this->login($u)->assertOk()->assertJsonPath('data.user.email', $u->email);

        $this->assertNotEmpty($r->json('data.access_token'));
        $this->assertSame(900, $r->json('data.expires_in'));
        $this->assertArrayNotHasKey('refresh_token', $r->json('data'));

        $cookie = collect($r->headers->getCookies())->first(fn ($c) => $c->getName() === $this->cookieName());
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertSame('strict', $cookie->getSameSite());
        $this->assertEqualsWithDelta(now()->addHours(12)->timestamp, $r->json('data') ? strtotime($r->json('data.session_expires_at')) : 0, 5);
        $this->assertDatabaseHas('auditoria_accesos', ['evento' => 'login_ok', 'sujeto_id' => $u->id]);
    }

    public function test_el_refresh_token_no_se_guarda_en_texto_plano(): void
    {
        $u = Usuario::factory()->create();
        $plano = $this->refreshCookieDe($this->login($u));

        $this->assertDatabaseMissing('sesiones', ['refresh_hash' => $plano]);
        $this->assertDatabaseHas('sesiones', ['refresh_hash' => hash('sha256', $plano)]);
    }

    public function test_credenciales_invalidas_devuelven_mensaje_generico_igual_para_usuario_inexistente(): void
    {
        $u = Usuario::factory()->create();
        $a = $this->login($u, [], 'incorrecta')->assertStatus(401);
        $b = $this->postJson('/api/v1/auth/login', ['email' => 'nadie@ejemplo.com', 'password' => 'x'])->assertStatus(401);

        $this->assertSame($a->json('message'), $b->json('message'));
    }

    public function test_bloqueo_progresivo_tras_5_fallos_incluso_con_la_clave_correcta(): void
    {
        $u = Usuario::factory()->create();
        for ($i = 0; $i < 5; $i++) {
            $this->login($u, [], 'incorrecta')->assertStatus(401);
        }

        $this->login($u)->assertStatus(401); // ya bloqueado: la clave correcta no entra
        $this->assertTrue($u->fresh()->estaBloqueado());
        $this->assertDatabaseHas('auditoria_accesos', ['evento' => 'bloqueo']);

        $this->travel(16)->minutes();
        $this->login($u)->assertOk();
    }

    public function test_usuario_inactivo_no_puede_ingresar(): void
    {
        $u = Usuario::factory()->create(['activo' => false]);
        $this->login($u)->assertStatus(401);
    }

    public function test_refresh_rota_el_token_y_la_reutilizacion_revoca_toda_la_familia(): void
    {
        $u = Usuario::factory()->create();
        $r1 = $this->refreshCookieDe($this->login($u));

        $resp2 = $this->refrescar($r1)->assertOk();
        $r2 = $this->refreshCookieDe($resp2);
        $this->assertNotSame($r1, $r2);

        $this->refrescar($r1)->assertStatus(401);   // reutilización del token viejo
        $this->refrescar($r2)->assertStatus(401);   // la familia entera quedó revocada
        $this->assertDatabaseHas('auditoria_accesos', ['evento' => 'reuso_refresh']);
    }

    public function test_la_sesion_expira_de_forma_absoluta_a_las_12_horas_aunque_se_refresque(): void
    {
        config(['sysmicon.auth.idle_ttl' => 3600 * 24]); // aislar la prueba de la inactividad
        $u = Usuario::factory()->create();
        $plano = $this->refreshCookieDe($this->login($u));

        foreach ([4, 4] as $horas) { // 4 h + 4 h = 8 h: sigue vigente
            $this->travel($horas)->hours();
            $resp = $this->refrescar($plano)->assertOk();
            $plano = $this->refreshCookieDe($resp);
        }

        $this->travel(4 * 60 + 1)->minutes(); // total 12 h 1 min desde el login
        $this->refrescar($plano)->assertStatus(401);
    }

    public function test_la_inactividad_cierra_la_sesion(): void
    {
        $u = Usuario::factory()->create();
        $plano = $this->refreshCookieDe($this->login($u));

        $this->travel(31)->minutes();
        $this->refrescar($plano)->assertStatus(401);
    }

    public function test_logout_revoca_el_access_token_inmediatamente(): void
    {
        $u = Usuario::factory()->create();
        $r = $this->login($u);
        $token = $r->json('data.access_token');

        $this->withToken($token)->getJson('/api/v1/auth/me')->assertOk();
        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();
        $this->withToken($token)->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_access_token_manipulado_o_expirado_es_rechazado(): void
    {
        $u = Usuario::factory()->create();
        $token = $this->login($u)->json('data.access_token');

        $this->withToken($token.'x')->getJson('/api/v1/auth/me')->assertStatus(401);

        $this->travel(16)->minutes();
        $this->withToken($token)->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_un_token_de_cliente_no_accede_a_rutas_de_staff(): void
    {
        $u = Usuario::factory()->create();
        $sesion = Sesion::create([
            'guard' => 'cliente', 'sujeto_id' => $u->id, 'refresh_hash' => hash('sha256', 'x'),
            'familia_id' => (string) \Illuminate\Support\Str::uuid(), 'expira_at' => now()->addHours(12), 'ultimo_uso_at' => now(),
        ]);
        $token = app(TokenService::class)->emitir('cliente', $u->id, $sesion->id);

        $this->withToken($token)->getJson('/api/v1/auth/me')->assertStatus(403);
    }

    public function test_middleware_de_rol_bloquea_roles_no_permitidos(): void
    {
        Route::middleware(['jwt:staff', 'rol:admin'])->get('/api/v1/_test/solo-admin', fn () => ['ok' => true]);

        $comercial = Usuario::factory()->create();
        $token = $this->login($comercial)->json('data.access_token');

        $this->withToken($token)->getJson('/api/v1/_test/solo-admin')->assertStatus(403);
    }

    public function test_admin_sin_2fa_es_bloqueado_en_rutas_protegidas_y_se_le_indica_configurarlo(): void
    {
        Route::middleware(['jwt:staff', '2fa'])->get('/api/v1/_test/panel', fn () => ['ok' => true]);

        $admin = Usuario::factory()->admin()->create();
        $r = $this->login($admin)->assertOk()->assertJsonPath('data.requires_2fa_setup', true);

        $this->withToken($r->json('data.access_token'))->getJson('/api/v1/_test/panel')
            ->assertStatus(403)->assertJsonPath('code', '2fa_required');
    }

    public function test_flujo_completo_2fa_admin(): void
    {
        Route::middleware(['jwt:staff', '2fa'])->get('/api/v1/_test/panel', fn () => ['ok' => true]);

        $admin = Usuario::factory()->admin()->create();
        $token = $this->login($admin)->json('data.access_token');

        $this->withToken($token)->postJson('/api/v1/auth/2fa/setup', ['password' => 'mala'])->assertStatus(422);
        $secreto = $this->withToken($token)->postJson('/api/v1/auth/2fa/setup', ['password' => self::PASS])->assertOk()->json('data.secret');

        $g = new Google2FA();
        $confirm = $this->withToken($token)->postJson('/api/v1/auth/2fa/confirm', ['otp' => $g->getCurrentOtp($secreto)])->assertOk();
        $this->assertCount(8, $confirm->json('data.recovery_codes'));

        $this->withToken($confirm->json('data.access_token'))->getJson('/api/v1/_test/panel')->assertOk();

        // Nuevo login: ahora exige OTP.
        $this->login($admin)->assertStatus(401)->assertJsonPath('code', 'otp_required');
        $this->login($admin, ['otp' => '000000'])->assertStatus(401)->assertJsonPath('code', 'otp_invalid');
        $ok = $this->login($admin, ['otp' => $g->getCurrentOtp($secreto)])->assertOk();

        $this->withToken($ok->json('data.access_token'))->getJson('/api/v1/_test/panel')->assertOk();

        // Código de recuperación: funciona una sola vez.
        $codigo = $confirm->json('data.recovery_codes.0');
        $this->login($admin, ['codigo_recuperacion' => $codigo])->assertOk();
        $this->login($admin, ['codigo_recuperacion' => $codigo])->assertStatus(401);
    }

    public function test_respuestas_incluyen_cabeceras_de_seguridad(): void
    {
        $this->getJson('/api/v1/health')->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY');
    }
}
