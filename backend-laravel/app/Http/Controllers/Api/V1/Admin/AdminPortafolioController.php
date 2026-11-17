<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PortafolioProyectoRequest;
use App\Models\PortafolioImagen;
use App\Models\PortafolioProyecto;
use App\Services\CloudinaryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPortafolioController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CloudinaryService $cloudinary)
    {
    }

    public function index(): JsonResponse
    {
        $proyectos = PortafolioProyecto::with(['imagenes' => fn ($q) => $q->orderBy('orden')])
            ->orderBy('orden')
            ->orderByDesc('id')
            ->get();

        return $this->ok($proyectos);
    }

    public function store(PortafolioProyectoRequest $request): JsonResponse
    {
        $proyecto = PortafolioProyecto::create($request->validated());

        return $this->ok($proyecto, 'Proyecto de portafolio creado con éxito.', 201);
    }

    public function update(PortafolioProyectoRequest $request, int $id): JsonResponse
    {
        $proyecto = PortafolioProyecto::find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $proyecto->update($request->validated());

        return $this->ok($proyecto, 'Proyecto actualizado con éxito.');
    }

    public function toggleActivo(int $id): JsonResponse
    {
        $proyecto = PortafolioProyecto::find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $proyecto->update(['activo' => ! $proyecto->activo]);

        return $this->ok(['activo' => $proyecto->activo], 'Estado actualizado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $proyecto = PortafolioProyecto::with('imagenes')->find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        foreach ($proyecto->imagenes as $img) {
            if ($img->public_id) {
                $this->cloudinary->delete($img->public_id);
            }
        }

        $proyecto->delete();

        return $this->ok(null, 'Proyecto eliminado correctamente.');
    }

    public function addImagen(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'imagen' => ['required', 'file', 'image', 'max:10240'], // máx 10 MB
            'orden' => ['nullable', 'integer', 'min:0'],
        ]);

        $proyecto = PortafolioProyecto::find($id);
        if (! $proyecto) {
            return $this->fail('Proyecto no encontrado.', 404);
        }

        $subida = $this->cloudinary->upload($request->file('imagen'), 'sysmicon/portafolio');

        $imagen = PortafolioImagen::create([
            'portafolio_proyecto_id' => $proyecto->id,
            'url' => $subida['url'],
            'public_id' => $subida['public_id'],
            'orden' => $request->input('orden', $proyecto->imagenes()->count()),
        ]);

        return $this->ok($imagen, 'Imagen agregada con éxito.', 201);
    }

    public function deleteImagen(int $id, int $imagenId): JsonResponse
    {
        $imagen = PortafolioImagen::where('portafolio_proyecto_id', $id)->find($imagenId);
        if (! $imagen) {
            return $this->fail('Imagen no encontrada.', 404);
        }

        if ($imagen->public_id) {
            $this->cloudinary->delete($imagen->public_id);
        }

        $imagen->delete();

        return $this->ok(null, 'Imagen eliminada.');
    }
}
