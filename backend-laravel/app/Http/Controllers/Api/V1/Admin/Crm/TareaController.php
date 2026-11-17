<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Tarea::with(['asignado:id,nombre,email', 'cliente:id,nombre', 'oportunidad:id,titulo', 'proyecto:id,nombre']);

        if ($request->has('completada')) {
            $query->where('completada', $request->boolean('completada'));
        }

        if ($request->filled('asignado_a')) {
            $query->where('asignado_a', $request->input('asignado_a'));
        }

        if ($request->filled('proyecto_id')) {
            $query->where('proyecto_id', $request->input('proyecto_id'));
        }

        $tareas = $query->orderBy('fecha_vencimiento')->get();

        return $this->ok($tareas);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'titulo' => ['required', 'string', 'max:180'],
            'descripcion' => ['nullable', 'string'],
            'fecha_vencimiento' => ['nullable', 'date'],
            'asignado_a' => ['nullable', 'exists:usuarios,id'],
            'cliente_id' => ['nullable', 'exists:clientes,id'],
            'oportunidad_id' => ['nullable', 'exists:oportunidades,id'],
            'proyecto_id' => ['nullable', 'exists:proyectos,id'],
        ]);

        $tarea = Tarea::create($datos);

        return $this->ok($tarea->load('asignado'), 'Tarea asignada exitosamente.', 201);
    }

    public function toggleCompletada(int $id): JsonResponse
    {
        $tarea = Tarea::find($id);
        if (! $tarea) {
            return $this->fail('Tarea no encontrada.', 404);
        }

        $completada = ! $tarea->completada;
        $tarea->update([
            'completada' => $completada,
            'completada_at' => $completada ? now() : null,
        ]);

        return $this->ok($tarea, 'Estado de la tarea actualizado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $tarea = Tarea::find($id);
        if (! $tarea) {
            return $this->fail('Tarea no encontrada.', 404);
        }

        $tarea->delete();

        return $this->ok(null, 'Tarea eliminada.');
    }
}
