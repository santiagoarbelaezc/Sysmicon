<?php

namespace App\Http\Middleware;

use App\Enums\GuardSesion;
use App\Models\CuentaCliente;
use App\Models\Sesion;
use App\Models\Usuario;
use App\Services\Auth\TokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Autentica con el access token (Bearer) y exige que el guard del token coincida con el de la ruta.
 * Un token `cliente` NUNCA es válido en rutas `jwt:staff` (y viceversa).
 */
class AuthenticateJwt
{
    public function __construct(private readonly TokenService $tokens)
    {
    }

    public function handle(Request $request, Closure $next, string $guard = 'staff'): Response
    {
        $jwt = $request->bearerToken();
        $claims = $jwt ? $this->tokens->verificar($jwt) : null;

        if ($claims === null) {
            return $this->error('No autenticado.', 401);
        }

        if (($claims['guard'] ?? null) !== $guard) {
            return $this->error('Acceso denegado.', 403);
        }

        $sesion = Sesion::find($claims['sid'] ?? null);
        if (! $sesion || ! $sesion->activa() || $sesion->guard !== $guard || (string) $sesion->sujeto_id !== (string) $claims['sub']) {
            return $this->error('Sesión no válida o expirada.', 401);
        }

        $sujeto = $guard === GuardSesion::Staff->value
            ? Usuario::find($claims['sub'])
            : CuentaCliente::find($claims['sub']);

        if (! $sujeto || ! $sujeto->activo || $sujeto->estaBloqueado()) {
            return $this->error('No autenticado.', 401);
        }

        $request->attributes->set('jwt_claims', $claims);
        $request->attributes->set('sesion', $sesion);
        $request->setUserResolver(fn () => $sujeto);

        return $next($request);
    }

    private function error(string $mensaje, int $status): Response
    {
        return response()->json(['success' => false, 'message' => $mensaje], $status);
    }
}
