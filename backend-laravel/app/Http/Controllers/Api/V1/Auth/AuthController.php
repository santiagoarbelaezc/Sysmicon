<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\GuardSesion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Sesion;
use App\Models\Usuario;
use App\Services\Auth\AuditoriaService;
use App\Services\Auth\BloqueoService;
use App\Services\Auth\SesionService;
use App\Services\Auth\TokenService;
use App\Services\Auth\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    private const GUARD = 'staff';

    public function __construct(
        private readonly TokenService $tokens,
        private readonly SesionService $sesiones,
        private readonly BloqueoService $bloqueos,
        private readonly TwoFactorService $twoFactor,
        private readonly AuditoriaService $auditoria,
    ) {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $email = mb_strtolower($request->string('email')->toString());
        $password = $request->string('password')->toString();
        $usuario = Usuario::where('email', $email)->first();

        // Trabajo equivalente para no revelar por tiempo si el email existe o está bloqueado.
        if (! $usuario || $usuario->estaBloqueado()) {
            Hash::make(Str::random(16));
            $this->auditoria->registrar($request, $usuario ? 'login_bloqueado' : 'login_fallido', self::GUARD, $usuario?->id, $email);

            return $this->credencialesInvalidas();
        }

        if (! Hash::check($password, $usuario->password)) {
            return $this->fallo($request, $usuario);
        }

        if (! $usuario->activo) {
            $this->auditoria->registrar($request, 'login_inactivo', self::GUARD, $usuario->id, $email);

            return $this->credencialesInvalidas();
        }

        $tfa = $this->twoFactor->activo($usuario);
        if ($tfa) {
            $otp = $request->input('otp');
            $recuperacion = $request->input('codigo_recuperacion');

            if (! $otp && ! $recuperacion) {
                return response()->json(['success' => false, 'code' => 'otp_required', 'message' => 'Ingresa el código de verificación.'], 401);
            }

            $valido = $otp
                ? $this->twoFactor->verificar($usuario->two_factor_secret, (string) $otp)
                : $this->twoFactor->consumirRecuperacion($usuario, (string) $recuperacion);

            if (! $valido) {
                return $this->fallo($request, $usuario, 'otp_invalid');
            }
        }

        $this->bloqueos->limpiar($usuario);
        $usuario->forceFill(['ultimo_login_at' => now()])->save();

        [$sesion, $refresh] = $this->sesiones->crear($request, self::GUARD, $usuario->id);
        $this->auditoria->registrar($request, 'login_ok', self::GUARD, $usuario->id, $email);

        return $this->respuestaSesion($usuario, $sesion, $refresh);
    }

    public function refresh(Request $request): JsonResponse
    {
        $plano = (string) $request->cookie(config('sysmicon.auth.refresh_cookie'));
        $sesion = $plano !== '' ? $this->sesiones->buscarPorRefresh($plano) : null;

        if (! $sesion || $sesion->guard !== self::GUARD) {
            return $this->sesionInvalida();
        }

        if ($sesion->revocada_at !== null) {
            if ($sesion->reemplazada_por !== null) { // reutilización de un token ya rotado ? posible robo
                $this->sesiones->revocarFamilia($sesion->familia_id);
                $this->auditoria->registrar($request, 'reuso_refresh', self::GUARD, $sesion->sujeto_id);
            }

            return $this->sesionInvalida();
        }

        if ($sesion->expira_at->isPast() || $this->sesiones->inactiva($sesion)) {
            $this->sesiones->revocarFamilia($sesion->familia_id);

            return $this->sesionInvalida();
        }

        $usuario = Usuario::find($sesion->sujeto_id);
        if (! $usuario || ! $usuario->activo || $usuario->estaBloqueado()) {
            $this->sesiones->revocarFamilia($sesion->familia_id);

            return $this->sesionInvalida();
        }

        [$nueva, $refresh] = $this->sesiones->rotar($request, $sesion);

        return $this->respuestaSesion($usuario, $nueva, $refresh);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['user' => $this->usuarioPublico($request->user())]]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var Sesion $sesion */
        $sesion = $request->attributes->get('sesion');
        $this->sesiones->revocarFamilia($sesion->familia_id);
        $this->auditoria->registrar($request, 'logout', self::GUARD, $sesion->sujeto_id);

        return response()->json(['success' => true, 'message' => 'Sesión cerrada.'])->withCookie($this->cookieOlvidar());
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $usuario = $request->user();
        $this->sesiones->revocarTodas(self::GUARD, $usuario->id);
        $this->auditoria->registrar($request, 'logout_todas', self::GUARD, $usuario->id);

        return response()->json(['success' => true, 'message' => 'Todas las sesiones fueron cerradas.'])->withCookie($this->cookieOlvidar());
    }

    private function fallo(Request $request, Usuario $usuario, string $code = 'invalid_credentials'): JsonResponse
    {
        $bloqueado = $this->bloqueos->registrarFallo($usuario);
        $this->auditoria->registrar($request, $bloqueado ? 'bloqueo' : 'login_fallido', self::GUARD, $usuario->id, $usuario->email);

        return $this->credencialesInvalidas($code);
    }

    private function credencialesInvalidas(string $code = 'invalid_credentials'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'code' => $code,
            'message' => 'Credenciales inválidas o cuenta bloqueada temporalmente.',
        ], 401);
    }

    private function sesionInvalida(): JsonResponse
    {
        return response()->json(['success' => false, 'message' => 'Sesión expirada. Inicia sesión nuevamente.'], 401)
            ->withCookie($this->cookieOlvidar());
    }

    private function respuestaSesion(Usuario $usuario, Sesion $sesion, string $refresh): JsonResponse
    {
        $tfa = $this->twoFactor->activo($usuario);
        $access = $this->tokens->emitir(self::GUARD, $usuario->id, $sesion->id, ['rol' => $usuario->rol->value, 'tfa' => $tfa]);
        $restante = max(1, (int) ceil(now()->diffInSeconds($sesion->expira_at, false) / 60));

        $cookie = Cookie::make(
            config('sysmicon.auth.refresh_cookie'), $refresh, $restante,
            config('sysmicon.auth.cookie_path'), null,
            (bool) config('sysmicon.auth.cookie_secure'), true, false, 'strict'
        );

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->usuarioPublico($usuario),
                'access_token' => $access,
                'token_type' => 'Bearer',
                'expires_in' => (int) config('sysmicon.auth.access_ttl'),
                'session_expires_at' => $sesion->expira_at->toIso8601String(),
                'requires_2fa_setup' => config('sysmicon.auth.exigir_2fa_admin') && $usuario->esAdmin() && ! $tfa,
            ],
        ])->withCookie($cookie);
    }

    private function cookieOlvidar()
    {
        return Cookie::forget(config('sysmicon.auth.refresh_cookie'), config('sysmicon.auth.cookie_path'));
    }

    /** @return array<string,mixed> */
    private function usuarioPublico(Usuario $usuario): array
    {
        return [
            'id' => $usuario->id,
            'nombre' => $usuario->nombre,
            'email' => $usuario->email,
            'rol' => $usuario->rol->value,
            'two_factor_enabled' => $this->twoFactor->activo($usuario),
        ];
    }
}
