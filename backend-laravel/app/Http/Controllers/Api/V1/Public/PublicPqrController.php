<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Enums\EstadoPqr;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\PqrPublicRequest;
use App\Models\Pqr;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPqrController extends Controller
{
    use ApiResponse;

    public function store(PqrPublicRequest $request): JsonResponse
    {
        // Generar radicado único secuencial del año actual: PQR-YYYY-XXXXX
        $ano = date('Y');
        $ultimo = Pqr::where('radicado', 'like', "PQR-{$ano}-%")->count();
        $consecutivo = str_pad((string) ($ultimo + 1), 5, '0', STR_PAD_LEFT);
        $radicado = "PQR-{$ano}-{$consecutivo}";

        // 15 días hábiles aproximadamente 21 días calendario
        $fechaLimite = now()->addDays(21)->toDateString();

        $pqr = Pqr::create([
            'radicado' => $radicado,
            'tipo' => $request->input('tipo'),
            'nombre_completo' => $request->input('nombre_completo'),
            'correo' => mb_strtolower($request->input('correo')),
            'telefono' => $request->input('telefono'),
            'asunto' => $request->input('asunto'),
            'descripcion' => $request->input('descripcion'),
            'estado' => EstadoPqr::Radicado,
            'fecha_limite_respuesta' => $fechaLimite,
            'consentimiento_datos' => (bool) $request->input('consentimiento_datos', false),
        ]);

        return $this->ok([
            'radicado' => $pqr->radicado,
            'fecha_radicacion' => $pqr->created_at->toIso8601String(),
            'fecha_limite_respuesta' => $pqr->fecha_limite_respuesta->format('Y-m-d'),
        ], 'Su solicitud PQR ha sido radicada con éxito. Guarde el número de radicado para consultar su estado.', 201);
    }

    public function consultar(Request $request): JsonResponse
    {
        $request->validate([
            'radicado' => ['required', 'string', 'max:30'],
            'correo' => ['required', 'string', 'email:rfc', 'max:255'],
        ]);

        $radicado = trim($request->input('radicado'));
        $correo = mb_strtolower(trim($request->input('correo')));

        $pqr = Pqr::where('radicado', $radicado)
            ->where('correo', $correo)
            ->first();

        if (! $pqr) {
            return $this->fail('No se encontró ningún radicado con los datos proporcionados.', 404);
        }

        return $this->ok([
            'radicado' => $pqr->radicado,
            'tipo' => $pqr->tipo->value,
            'asunto' => $pqr->asunto,
            'estado' => $pqr->estado->value,
            'fecha_radicacion' => $pqr->created_at->toIso8601String(),
            'fecha_limite_respuesta' => $pqr->fecha_limite_respuesta?->format('Y-m-d'),
            'respuesta' => $pqr->respuesta,
            'respondido_at' => $pqr->respondido_at?->toIso8601String(),
        ]);
    }
}
