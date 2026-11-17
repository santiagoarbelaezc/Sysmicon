<?php

namespace App\Http\Controllers\Api\V1\Cuenta;

use App\Http\Controllers\Controller;
use App\Models\CuentaCliente;
use App\Services\Auth\AuditoriaService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegistroClienteController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuditoriaService $auditoria)
    {
    }

    public function registro(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'min:3', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:cuentas_clientes,email'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', Password::default()],
            'acepta_novedades' => ['nullable', 'boolean'],
            'consentimiento_datos' => ['required', 'accepted'],
        ]);

        $cuenta = CuentaCliente::create([
            'nombre' => $datos['nombre'],
            'email' => mb_strtolower($datos['email']),
            'telefono' => $datos['telefono'] ?? null,
            'password' => Hash::make($datos['password']),
            'acepta_novedades' => (bool) ($datos['acepta_novedades'] ?? true),
            'consentimiento_datos_at' => now(),
            'activo' => true,
        ]);

        $this->auditoria->registrar($request, 'registro_cliente', 'cliente', $cuenta->id, $cuenta->email);

        return $this->ok([
            'id' => $cuenta->id,
            'nombre' => $cuenta->nombre,
            'email' => $cuenta->email,
        ], 'Cuenta registrada exitosamente. Ya puedes iniciar sesión para acceder a las novedades de tus proyectos.', 201);
    }
}
