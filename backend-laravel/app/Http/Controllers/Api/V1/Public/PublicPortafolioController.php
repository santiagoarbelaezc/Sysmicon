<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\PortafolioProyecto;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicPortafolioController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $proyectos = PortafolioProyecto::where('activo', true)
            ->with(['imagenes' => fn ($q) => $q->orderBy('orden')])
            ->orderBy('orden')
            ->orderByDesc('id')
            ->get();

        return $this->ok($proyectos);
    }

    public function show(int $id): JsonResponse
    {
        $proyecto = PortafolioProyecto::where('activo', true)
            ->with(['imagenes' => fn ($q) => $q->orderBy('orden')])
            ->find($id);

        if (! $proyecto) {
            return $this->fail('Proyecto de portafolio no encontrado.', 404);
        }

        return $this->ok($proyecto);
    }
}
