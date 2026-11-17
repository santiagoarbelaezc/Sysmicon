<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Http\Controllers\Controller;
use App\Models\Hito;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HitoController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'proyecto_id' => ['required', 'exists:proyectos,id'],
            'nombre' => ['required', 'string', 'max:150'],
            'fecha_limite' => ['nullable', 'date'],
        ]);

        $hito = Hito::create($datos);

        return $this->ok($hito, 'Hito creado con éxito.', 201);
    }

    public function toggleCompletado(int $id): JsonResponse
    {
        $hito = Hito::find($id);
        if (! $hito) {
            return $this->fail('Hito no encontrado.', 404);
        }

        $completado = ! $hito->completado;
        $hito->update([
            'completado' => $completado,
            'completado_at' => $completado ? now() : null,
        ]);

        return $this->ok($hito, 'Estado de hito actualizado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $hito = Hito::find($id);
        if (! $hito) {
            return $this->fail('Hito no encontrado.', 404);
        }

        $hito->delete();

        return $this->ok(null, 'Hito eliminado.');
    }
}
