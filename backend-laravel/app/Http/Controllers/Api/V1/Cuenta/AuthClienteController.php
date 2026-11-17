<?php

namespace App\Http\Controllers\Api\V1\Cuenta;

use App\Http\Controllers\Controller;
use App\Models\CuentaCliente;
use App\Models\NovedadProyecto;
use App\Services\Auth\AuditoriaService;
use App\Services\Auth\BloqueoService;
use App\Services\Auth\SesionService;
use App\Services\Auth\TokenService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class AuthClienteController extends Controller
{
    use ApiResponse;

    private const GUARD = 'cliente';

    public function __construct(
        private readonly TokenService $tokens,
        private readonly SesionService $sesiones,
        private readonly BloqueoService $bloqueos,
        private readonly AuditoriaService $auditoria,
    ) {
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email:rfc'],
            'password' => ['required', 'string'],
        ]);

        $email = mb_strtolower($request->input('email'));
        $cuenta = CuentaCliente::where('email', $email)->first();

        if (! $cuenta || $cuenta->estaBloqueado() || ! Hash::check($request->input('password'), $cuenta->password)) {
            if ($cuenta) {
                $this->bloqueos->registrarFallo($cuenta);
            }
            $this->auditoria->registrar($request, 'login_fallido', self::GUARD, $cuenta?->id, $email);

            return $this->fail('Credenciales inválidas o cuenta temporalmente bloqueada.', 401);
        }

        if (! $cuenta->activo) {
            return $this->fail('Tu cuenta se encuentra inactiva.', 401);
        }

        $this->bloqueos->limpiar($cuenta);
        [$sesion, $refresh] = $this->sesiones->crear($request, self::GUARD, $cuenta->id);
        $this->auditoria->registrar($request, 'login_ok', self::GUARD, $cuenta->id, $email);

        $access = $this->tokens->emitir(self::GUARD, $cuenta->id, $sesion->id);

        $cookie = Cookie::make(
            config('sysmicon.auth.refresh_cookie'),
            $refresh,
            (int) ceil(now()->diffInSeconds($sesion->expira_at) / 60),
            config('sysmicon.auth.cookie_path'),
            null,
            (bool) config('sysmicon.auth.cookie_secure'),
            true,
            false,
            'strict'
        );

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $cuenta->id,
                    'nombre' => $cuenta->nombre,
                    'email' => $cuenta->email,
                    'guard' => 'cliente',
                ],
                'access_token' => $access,
                'token_type' => 'Bearer',
                'expires_in' => (int) config('sysmicon.auth.access_ttl'),
                'session_expires_at' => $sesion->expira_at->toIso8601String(),
            ],
        ])->withCookie($cookie);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var CuentaCliente $cuenta */
        $cuenta = $request->user();

        return $this->ok([
            'id' => $cuenta->id,
            'nombre' => $cuenta->nombre,
            'email' => $cuenta->email,
            'telefono' => $cuenta->telefono,
            'acepta_novedades' => $cuenta->acepta_novedades,
            'cliente_vinculado' => $cuenta->cliente?->only(['id', 'nombre', 'ciudad']),
        ]);
    }

    public function novedades(Request $request): JsonResponse
    {
        /** @var CuentaCliente $cuenta */
        $cuenta = $request->user();

        $query = NovedadProyecto::where('publicada', true);

        if ($cuenta->cliente_id) {
            $query->whereHas('proyecto', fn ($q) => $q->where('cliente_id', $cuenta->cliente_id));
        }

        $novedades = $query->with('proyecto:id,nombre')
            ->orderByDesc('publicada_at')
            ->get();

        return $this->ok($novedades);
    }

    public function logout(Request $request): JsonResponse
    {
        $sesion = $request->attributes->get('sesion');
        if ($sesion) {
            $this->sesiones->revocarFamilia($sesion->familia_id);
        }

        return $this->ok(null, 'Sesión de cliente cerrada.')->withCookie(
            Cookie::forget(config('sysmicon.auth.refresh_cookie'), config('sysmicon.auth.cookie_path'))
        );
    }
}
