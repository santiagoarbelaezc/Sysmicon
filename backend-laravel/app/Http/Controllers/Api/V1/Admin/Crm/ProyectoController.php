<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Enums\EstadoProyecto;
use App\Enums\FaseProyecto;
use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class ProyectoController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Proyecto::with(['cliente:id,nombre,email', 'responsable:id,nombre,email', 'hitos']);

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        if ($request->filled('fase')) {
            $query->where('fase', $request->input('fase'));
        }

        if ($request->filled('responsable_id')) {
            $query->where('responsable_id', $request->input('responsable_id'));
        }

        $proyectos = $query->orderByDesc('id')->get()->map(function ($p) {
            $totalHitos = $p->hitos->count();
            $completados = $p->hitos->where('completado', true)->count();
            $p->progreso_porcentaje = $totalHitos > 0 ? (int) round(($completados / $totalHitos) * 100) : 0;

            return $p;
        });

        return $this->ok($proyectos);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'cliente_id' => ['required', 'exists:clientes,id'],
            'oportunidad_id' => ['nullable', 'exists:oportunidades,id', 'unique:proyectos,oportunidad_id'],
            'nombre' => ['required', 'string', 'max:180'],
            'direccion_obra' => ['nullable', 'string', 'max:255'],
            'fase' => ['nullable', new Enum(FaseProyecto::class)],
            'estado' => ['nullable', new Enum(EstadoProyecto::class)],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin_estimada' => ['nullable', 'date'],
            'presupuesto' => ['nullable', 'numeric', 'min:0'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
        ]);

        $proyecto = Proyecto::create($datos);

        return $this->ok($proyecto, 'Proyecto de obra registrado.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $proyecto = Proyecto::with([
            'cliente',
            'responsable',
            'oportunidad',
            'hitos' => fn ($q) => $q->orderBy('fecha_limite'),
            'tareas' => fn ($q) => $q->orderBy('fecha_vencimiento'),
            'actividades' => fn ($q) => $q->orderByDesc('fecha'),
            'novedades' => fn ($q) => $q->orderByDesc('created_at'),
        ])->find($id);

        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $totalHitos = $proyecto->hitos->count();
        $completados = $proyecto->hitos->where('completado', true)->count();
        $proyecto->progreso_porcentaje = $totalHitos > 0 ? (int) round(($completados / $totalHitos) * 100) : 0;

        return $this->ok($proyecto);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $datos = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:180'],
            'direccion_obra' => ['nullable', 'string', 'max:255'],
            'fase' => ['sometimes', new Enum(FaseProyecto::class)],
            'estado' => ['sometimes', new Enum(EstadoProyecto::class)],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin_estimada' => ['nullable', 'date'],
            'presupuesto' => ['nullable', 'numeric', 'min:0'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
        ]);

        $proyecto->update($datos);

        return $this->ok($proyecto, 'Proyecto actualizado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $proyecto->delete();

        return $this->ok(null, 'Proyecto archivado.');
    }
}
