<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\Rol;
use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\Password;

class AdminUsuarioController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $usuarios = Usuario::select('id', 'nombre', 'email', 'rol', 'activo', 'ultimo_login_at', 'created_at')
            ->orderBy('nombre')
            ->get();

        return $this->ok($usuarios);
    }

    public function show(int $id): JsonResponse
    {
        $usuario = Usuario::select('id', 'nombre', 'email', 'rol', 'activo', 'ultimo_login_at', 'created_at')->find($id);
        if (! $usuario) {
            return $this->fail('Usuario no encontrado.', 404);
        }

        return $this->ok($usuario);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'unique:usuarios,email'],
            'password' => ['required', 'string', Password::default()],
            'rol' => ['required', new Enum(Rol::class)],
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->input('nombre'),
            'email' => mb_strtolower($request->input('email')),
            'password' => Hash::make($request->input('password')),
            'rol' => $request->input('rol'),
            'activo' => true,
        ]);

        return $this->ok($usuario, 'Usuario creado exitosamente.', 201);
    }

    public function toggleEstado(Request $request, int $id): JsonResponse
    {
        $usuarioActual = $request->user();

        // REGLA DE AUTOPROTECCIÓN: No puede desactivarse a sí mismo
        if ($usuarioActual->id === $id) {
            return $this->fail('Por seguridad, no puedes desactivar tu propia cuenta activa de administrador.', 403);
        }

        $usuario = Usuario::find($id);
        if (! $usuario) {
            return $this->fail('Usuario no encontrado.', 404);
        }

        $usuario->update(['activo' => ! $usuario->activo]);

        return $this->ok(['activo' => $usuario->activo], 'Estado de usuario actualizado.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $usuarioActual = $request->user();

        // REGLA DE AUTOPROTECCIÓN: No puede eliminarse a sí mismo
        if ($usuarioActual->id === $id) {
            return $this->fail('Por seguridad, no puedes eliminar tu propia cuenta activa de administrador.', 403);
        }

        $usuario = Usuario::find($id);
        if (! $usuario) {
            return $this->fail('Usuario no encontrado.', 404);
        }

        $usuario->delete();

        return $this->ok(null, 'Usuario eliminado correctamente.');
    }
}
