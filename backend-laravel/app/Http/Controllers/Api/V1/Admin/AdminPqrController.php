<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\EstadoPqr;
use App\Http\Controllers\Controller;
use App\Models\Pqr;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPqrController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Pqr::query();

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->input('tipo'));
        }

        if ($request->filled('search')) {
            $term = '%'.$request->input('search').'%';
            $query->where(function ($q) use ($term) {
                $q->where('radicado', 'like', $term)
                  ->orWhere('nombre_completo', 'like', $term)
                  ->orWhere('correo', 'like', $term)
                  ->orWhere('asunto', 'like', $term);
            });
        }

        $pqr = $query->with('respondidoPor:id,nombre,email')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 20));

        return $this->ok($pqr);
    }

    public function show(int $id): JsonResponse
    {
        $pqr = Pqr::with(['respondidoPor:id,nombre,email', 'cuentaCliente:id,nombre,email'])->find($id);
        if (! $pqr) {
            return $this->fail('Solicitud PQR no encontrada.', 404);
        }

        return $this->ok($pqr);
    }

    public function responder(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'respuesta' => ['required', 'string', 'min:10', 'max:5000'],
        ]);

        $pqr = Pqr::find($id);
        if (! $pqr) {
            return $this->fail('Solicitud PQR no encontrada.', 404);
        }

        $pqr->update([
            'respuesta' => $request->input('respuesta'),
            'respondido_por' => $request->user()->id,
            'respondido_at' => now(),
            'estado' => EstadoPqr::Respondido,
        ]);

        return $this->ok($pqr, 'Respuesta registrada exitosamente.');
    }

    public function updateEstado(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'estado' => ['required', 'string'],
        ]);

        $pqr = Pqr::find($id);
        if (! $pqr) {
            return $this->fail('Solicitud PQR no encontrada.', 404);
        }

        $pqr->update(['estado' => $request->input('estado')]);

        return $this->ok($pqr, 'Estado de la PQR actualizado.');
    }
}
