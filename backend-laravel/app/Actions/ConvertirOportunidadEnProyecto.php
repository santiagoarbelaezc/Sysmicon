<?php

namespace App\Actions;

use App\Enums\EstadoProyecto;
use App\Enums\EtapaOportunidad;
use App\Enums\FaseProyecto;
use App\Enums\TipoActividad;
use App\Models\Actividad;
use App\Models\Oportunidad;
use App\Models\Proyecto;
use Illuminate\Support\Facades\DB;

class ConvertirOportunidadEnProyecto
{
    public function execute(Oportunidad $oportunidad, ?int $usuarioId = null): Proyecto
    {
        return DB::transaction(function () use ($oportunidad, $usuarioId) {
            // Verificar si ya existe proyecto asociado
            $existente = Proyecto::where('oportunidad_id', $oportunidad->id)->first();
            if ($existente) {
                return $existente;
            }

            // Crear proyecto vinculado
            $proyecto = Proyecto::create([
                'cliente_id' => $oportunidad->cliente_id,
                'oportunidad_id' => $oportunidad->id,
                'nombre' => $oportunidad->titulo,
                'fase' => FaseProyecto::Diseno,
                'estado' => EstadoProyecto::Activo,
                'fecha_inicio' => now()->toDateString(),
                'presupuesto' => $oportunidad->valor_estimado,
                'responsable_id' => $oportunidad->responsable_id ?? $usuarioId,
            ]);

            // Registrar actividad
            Actividad::create([
                'tipo' => TipoActividad::Nota,
                'descripcion' => "Oportunidad ganada. Se generó automáticamente el proyecto de obra: {$proyecto->nombre}.",
                'fecha' => now(),
                'usuario_id' => $usuarioId ?? $oportunidad->responsable_id,
                'cliente_id' => $oportunidad->cliente_id,
                'oportunidad_id' => $oportunidad->id,
                'proyecto_id' => $proyecto->id,
            ]);

            return $proyecto;
        });
    }
}
