<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Enums\EstadoMensaje;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\MensajePublicRequest;
use App\Models\Mensaje;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicMensajeController extends Controller
{
    use ApiResponse;

    public function store(MensajePublicRequest $request): JsonResponse
    {
        $mensaje = Mensaje::create([
            'nombre_completo' => $request->input('nombre_completo'),
            'correo' => mb_strtolower($request->input('correo')),
            'telefono' => $request->input('telefono'),
            'tipo_servicio' => $request->input('tipo_servicio'),
            'detalles' => $request->input('detalles'),
            'estado' => EstadoMensaje::Nuevo,
            'ip_hash' => hash('sha256', (string) $request->ip()),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
            'consentimiento_datos' => (bool) $request->input('consentimiento_datos', false),
        ]);

        return $this->ok([
            'id' => $mensaje->id,
            'mensaje' => 'Solicitud enviada exitosamente. Nuestro equipo se pondrá en contacto pronto.',
        ], 'Mensaje recibido correctamente.', 201);
    }
}
