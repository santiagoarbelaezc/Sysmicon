<?php

namespace App\Http\Middleware;

use App\Models\Usuario;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $usuario = $request->user();

        if (! $usuario instanceof Usuario || ! in_array($usuario->rol->value, $roles, true)) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
        }

        return $next($request);
    }
}
