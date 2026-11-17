<?php

namespace App\Http\Middleware;

use App\Models\Usuario;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Los administradores solo operan con una sesión que haya pasado 2FA. */
class EnsureTwoFactor
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if (config('sysmicon.auth.exigir_2fa_admin') && $usuario instanceof Usuario && $usuario->esAdmin()
            && ! ($request->attributes->get('jwt_claims')['tfa'] ?? false)) {
            return response()->json([
                'success' => false,
                'code' => '2fa_required',
                'message' => 'Debes activar y verificar la autenticación en dos pasos (2FA).',
            ], 403);
        }

        return $next($request);
    }
}
