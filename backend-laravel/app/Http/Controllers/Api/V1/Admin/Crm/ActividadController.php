<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Enums\TipoActividad;
use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class ActividadController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Actividad::with(['usuario:id,nombre,email', 'cliente:id,nombre', 'oportunidad:id,titulo', 'proyecto:id,nombre']);

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->input('tipo'));
        }

        if ($request->filled('cliente_id')) {
            $query->where('cliente_id', $request->input('cliente_id'));
        }

        if ($request->filled('oportunidad_id')) {
            $query->where('oportunidad_id', $request->input('oportunidad_id'));
        }

        if ($request->filled('proyecto_id')) {
            $query->where('proyecto_id', $request->input('proyecto_id'));
        }

        $actividades = $query->orderByDesc('fecha')->paginate($request->integer('per_page', 25));

        return $this->ok($actividades);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'tipo' => ['required', new Enum(TipoActividad::class)],
            'descripcion' => ['required', 'string', 'max:2000'],
            'fecha' => ['required', 'date'],
            'cliente_id' => ['nullable', 'exists:clientes,id'],
            'oportunidad_id' => ['nullable', 'exists:oportunidades,id'],
            'proyecto_id' => ['nullable', 'exists:proyectos,id'],
        ]);

        $datos['usuario_id'] = $request->user()->id;

        $actividad = Actividad::create($datos);

        return $this->ok($actividad->load('usuario'), 'Actividad registrada.', 201);
    }
}
