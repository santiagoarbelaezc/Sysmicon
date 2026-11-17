<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Actions\ConvertirOportunidadEnProyecto;
use App\Enums\EtapaOportunidad;
use App\Enums\TipoProyecto;
use App\Http\Controllers\Controller;
use App\Models\Oportunidad;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class OportunidadController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ConvertirOportunidadEnProyecto $convertidor)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = Oportunidad::with(['cliente:id,nombre,email,telefono', 'responsable:id,nombre,email']);

        if ($request->filled('etapa')) {
            $query->where('etapa', $request->input('etapa'));
        }

        if ($request->filled('responsable_id')) {
            $query->where('responsable_id', $request->input('responsable_id'));
        }

        if ($request->filled('tipo_proyecto')) {
            $query->where('tipo_proyecto', $request->input('tipo_proyecto'));
        }

        $oportunidades = $query->orderBy('etapa')->orderBy('orden')->get();

        return $this->ok($oportunidades);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'cliente_id' => ['required', 'exists:clientes,id'],
            'titulo' => ['required', 'string', 'max:180'],
            'tipo_proyecto' => ['required', new Enum(TipoProyecto::class)],
            'etapa' => ['nullable', new Enum(EtapaOportunidad::class)],
            'valor_estimado' => ['nullable', 'numeric', 'min:0'],
            'probabilidad' => ['nullable', 'integer', 'between:0,100'],
            'fecha_cierre_estimada' => ['nullable', 'date'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
        ]);

        $etapa = $datos['etapa'] ?? EtapaOportunidad::Contacto;
        $datos['orden'] = Oportunidad::where('etapa', $etapa)->count();

        $oportunidad = Oportunidad::create($datos);

        return $this->ok($oportunidad->load(['cliente', 'responsable']), 'Oportunidad creada.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $oportunidad = Oportunidad::with([
            'cliente',
            'responsable',
            'propuestas',
            'proyecto',
            'tareas' => fn ($q) => $q->orderBy('fecha_vencimiento'),
            'actividades' => fn ($q) => $q->orderByDesc('fecha'),
        ])->find($id);

        if (! $oportunidad) {
            return $this->fail('Oportunidad no encontrada.', 404);
        }

        return $this->ok($oportunidad);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $oportunidad = Oportunidad::find($id);
        if (! $oportunidad) {
            return $this->fail('Oportunidad no encontrada.', 404);
        }

        $datos = $request->validate([
            'titulo' => ['sometimes', 'string', 'max:180'],
            'tipo_proyecto' => ['sometimes', new Enum(TipoProyecto::class)],
            'valor_estimado' => ['sometimes', 'numeric', 'min:0'],
            'probabilidad' => ['sometimes', 'integer', 'between:0,100'],
            'fecha_cierre_estimada' => ['nullable', 'date'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
            'motivo_perdida' => ['nullable', 'string'],
        ]);

        $oportunidad->update($datos);

        return $this->ok($oportunidad, 'Oportunidad actualizada.');
    }

    public function cambiarEtapa(Request $request, int $id): JsonResponse
    {
        $oportunidad = Oportunidad::find($id);
        if (! $oportunidad) {
            return $this->fail('Oportunidad no encontrada.', 404);
        }

        $request->validate([
            'etapa' => ['required', new Enum(EtapaOportunidad::class)],
            'orden' => ['nullable', 'integer', 'min:0'],
            'motivo_perdida' => ['nullable', 'string'],
        ]);

        $nuevaEtapa = EtapaOportunidad::from($request->input('etapa'));

        // REGLA: Si la etapa es 'perdido', el motivo es obligatorio
        if ($nuevaEtapa === EtapaOportunidad::Perdido && ! $request->filled('motivo_perdida')) {
            return $this->fail('Para marcar la oportunidad como perdida debe ingresar el motivo de pérdida.', 422);
        }

        $campos = [
            'etapa' => $nuevaEtapa,
            'orden' => $request->input('orden', 0),
        ];

        if ($nuevaEtapa === EtapaOportunidad::Ganado) {
            $campos['probabilidad'] = 100;
        } elseif ($nuevaEtapa === EtapaOportunidad::Perdido) {
            $campos['probabilidad'] = 0;
            $campos['motivo_perdida'] = $request->input('motivo_perdida');
        }

        $oportunidad->update($campos);

        // REGLA CLAVE: Cuando una oportunidad pasa a "ganado", se crea automáticamente el proyecto
        $proyecto = null;
        if ($nuevaEtapa === EtapaOportunidad::Ganado) {
            $proyecto = $this->convertidor->execute($oportunidad, $request->user()->id);
        }

        return $this->ok([
            'oportunidad' => $oportunidad,
            'proyecto_creado' => $proyecto,
        ], 'Etapa de oportunidad actualizada exitosamente.');
    }

    public function destroy(int $id): JsonResponse
    {
        $oportunidad = Oportunidad::find($id);
        if (! $oportunidad) {
            return $this->fail('Oportunidad no encontrada.', 404);
        }

        $oportunidad->delete();

        return $this->ok(null, 'Oportunidad archivada.');
    }
}
