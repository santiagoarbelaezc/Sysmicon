<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Enums\EstadoPropuesta;
use App\Http\Controllers\Controller;
use App\Models\Oportunidad;
use App\Models\Propuesta;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class PropuestaController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Propuesta::with('oportunidad.cliente:id,nombre');

        if ($request->filled('oportunidad_id')) {
            $query->where('oportunidad_id', $request->input('oportunidad_id'));
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $propuestas = $query->orderByDesc('id')->paginate($request->integer('per_page', 20));

        return $this->ok($propuestas);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'oportunidad_id' => ['required', 'exists:oportunidades,id'],
            'fecha_envio' => ['nullable', 'date'],
            'valor' => ['required', 'numeric', 'min:0'],
            'estado' => ['nullable', new Enum(EstadoPropuesta::class)],
            'archivo_url' => ['nullable', 'string', 'max:255'],
        ]);

        $ano = date('Y');
        $consecutivo = str_pad((string) (Propuesta::whereYear('created_at', $ano)->count() + 1), 4, '0', STR_PAD_LEFT);
        $datos['numero'] = "PRO-{$ano}-{$consecutivo}";

        $propuesta = Propuesta::create($datos);

        return $this->ok($propuesta, 'Propuesta comercial registrada.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $propuesta = Propuesta::with('oportunidad.cliente')->find($id);
        if (! $propuesta) {
            return $this->fail('Propuesta no encontrada.', 404);
        }

        return $this->ok($propuesta);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $propuesta = Propuesta::find($id);
        if (! $propuesta) {
            return $this->fail('Propuesta no encontrada.', 404);
        }

        $datos = $request->validate([
            'fecha_envio' => ['nullable', 'date'],
            'valor' => ['sometimes', 'numeric', 'min:0'],
            'estado' => ['sometimes', new Enum(EstadoPropuesta::class)],
            'archivo_url' => ['nullable', 'string', 'max:255'],
        ]);

        $propuesta->update($datos);

        return $this->ok($propuesta, 'Propuesta actualizada.');
    }
}
