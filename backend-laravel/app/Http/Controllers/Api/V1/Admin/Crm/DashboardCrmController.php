<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Enums\EstadoProyecto;
use App\Enums\EtapaOportunidad;
use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Models\Cliente;
use App\Models\Oportunidad;
use App\Models\Proyecto;
use App\Models\Tarea;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardCrmController extends Controller
{
    use ApiResponse;

    public function kpis(): JsonResponse
    {
        $totalClientes = Cliente::count();
        $leadsNuevos = Cliente::where('created_at', '>=', now()->subDays(30))->count();

        $oportunidadesActivas = Oportunidad::whereNotIn('etapa', [EtapaOportunidad::Ganado, EtapaOportunidad::Perdido])->get();
        $valorPipeline = (float) $oportunidadesActivas->sum('valor_estimado');
        $conteoPipeline = $oportunidadesActivas->count();

        $ganadas = Oportunidad::where('etapa', EtapaOportunidad::Ganado)->count();
        $totalesCerradas = Oportunidad::whereIn('etapa', [EtapaOportunidad::Ganado, EtapaOportunidad::Perdido])->count();
        $tasaConversion = $totalesCerradas > 0 ? (float) round(($ganadas / $totalesCerradas) * 100, 1) : 0;

        $proyectosActivos = Proyecto::where('estado', EstadoProyecto::Activo)->count();

        return $this->ok([
            'clientes_totales' => $totalClientes,
            'leads_ultimos_30_dias' => $leadsNuevos,
            'pipeline_valor_estimado' => $valorPipeline,
            'pipeline_oportunidades_activas' => $conteoPipeline,
            'tasa_conversion_ganadas' => $tasaConversion,
            'proyectos_activos' => $proyectosActivos,
        ]);
    }

    public function pipelineKanban(): JsonResponse
    {
        $oportunidades = Oportunidad::with(['cliente:id,nombre,telefono', 'responsable:id,nombre'])
            ->orderBy('orden')
            ->get();

        $kanban = [];
        foreach (EtapaOportunidad::cases() as $etapa) {
            $items = $oportunidades->where('etapa', $etapa)->values();
            $kanban[$etapa->value] = [
                'etapa' => $etapa->value,
                'total_items' => $items->count(),
                'valor_acumulado' => (float) $items->sum('valor_estimado'),
                'oportunidades' => $items,
            ];
        }

        return $this->ok($kanban);
    }

    public function tareasPendientes(): JsonResponse
    {
        $tareas = Tarea::with(['asignado:id,nombre', 'cliente:id,nombre', 'proyecto:id,nombre'])
            ->where('completada', false)
            ->orderBy('fecha_vencimiento')
            ->limit(15)
            ->get();

        return $this->ok($tareas);
    }

    public function proyectosEnCurso(): JsonResponse
    {
        $proyectos = Proyecto::with(['cliente:id,nombre', 'responsable:id,nombre', 'hitos'])
            ->where('estado', EstadoProyecto::Activo)
            ->orderByDesc('id')
            ->limit(10)
            ->get()
            ->map(function ($p) {
                $totalHitos = $p->hitos->count();
                $completados = $p->hitos->where('completado', true)->count();
                $p->progreso_porcentaje = $totalHitos > 0 ? (int) round(($completados / $totalHitos) * 100) : 0;

                return $p;
            });

        return $this->ok($proyectos);
    }

    public function actividadReciente(): JsonResponse
    {
        $actividades = Actividad::with(['usuario:id,nombre', 'cliente:id,nombre', 'proyecto:id,nombre'])
            ->orderByDesc('fecha')
            ->limit(20)
            ->get();

        return $this->ok($actividades);
    }

    public function calendario(): JsonResponse
    {
        // 1. Tareas con fecha de vencimiento
        $tareas = Tarea::whereNotNull('fecha_vencimiento')
            ->where('completada', false)
            ->get()
            ->map(fn ($t) => [
                'id' => 'tarea_'.$t->id,
                'tipo' => 'tarea',
                'titulo' => 'Tarea: '.$t->titulo,
                'fecha' => $t->fecha_vencimiento->toDateString(),
            ]);

        // 2. Actividades de tipo reunión o visita
        $reuniones = Actividad::whereIn('tipo', ['reunion', 'visita'])
            ->where('fecha', '>=', now()->subDays(15))
            ->get()
            ->map(fn ($a) => [
                'id' => 'actividad_'.$a->id,
                'tipo' => $a->tipo->value,
                'titulo' => ucfirst($a->tipo->value).': '.$a->descripcion,
                'fecha' => $a->fecha->toDateTimeString(),
            ]);

        $eventos = $tareas->concat($reuniones)->sortBy('fecha')->values();

        return $this->ok($eventos);
    }
}
