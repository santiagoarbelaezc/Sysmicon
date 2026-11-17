<?php

namespace App\Http\Controllers\Api\V1\Admin\Crm;

use App\Enums\OrigenCliente;
use App\Enums\TipoCliente;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Contacto;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class ClienteController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Cliente::with(['contactos', 'responsable:id,nombre,email']);

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->input('tipo'));
        }

        if ($request->filled('origen')) {
            $query->where('origen', $request->input('origen'));
        }

        if ($request->filled('responsable_id')) {
            $query->where('responsable_id', $request->input('responsable_id'));
        }

        if ($request->filled('search')) {
            $term = '%'.$request->input('search').'%';
            $query->where(function ($q) use ($term) {
                $q->where('nombre', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('telefono', 'like', $term)
                  ->orWhere('ciudad', 'like', $term);
            });
        }

        $clientes = $query->orderByDesc('id')->paginate($request->integer('per_page', 20));

        return $this->ok($clientes);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'tipo' => ['required', new Enum(TipoCliente::class)],
            'nombre' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email:rfc', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'ciudad' => ['nullable', 'string', 'max:80'],
            'origen' => ['nullable', new Enum(OrigenCliente::class)],
            'notas' => ['nullable', 'string'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
            'contactos' => ['nullable', 'array'],
            'contactos.*.nombre' => ['required', 'string', 'max:120'],
            'contactos.*.cargo' => ['nullable', 'string', 'max:80'],
            'contactos.*.email' => ['nullable', 'email:rfc'],
            'contactos.*.telefono' => ['nullable', 'string', 'max:30'],
        ]);

        $cliente = Cliente::create($datos);

        if (! empty($datos['contactos'])) {
            foreach ($datos['contactos'] as $c) {
                $cliente->contactos()->create($c);
            }
        }

        return $this->ok($cliente->load('contactos'), 'Cliente registrado con éxito.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $cliente = Cliente::with([
            'contactos',
            'responsable:id,nombre,email',
            'oportunidades',
            'proyectos',
            'tareas' => fn ($q) => $q->where('completada', false)->orderBy('fecha_vencimiento'),
            'actividades' => fn ($q) => $q->orderByDesc('fecha')->limit(15),
        ])->find($id);

        if (! $cliente) {
            return $this->fail('Cliente no encontrado.', 404);
        }

        return $this->ok($cliente);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $cliente = Cliente::find($id);
        if (! $cliente) {
            return $this->fail('Cliente no encontrado.', 404);
        }

        $datos = $request->validate([
            'tipo' => ['sometimes', new Enum(TipoCliente::class)],
            'nombre' => ['sometimes', 'string', 'max:150'],
            'email' => ['nullable', 'email:rfc', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:30'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'ciudad' => ['nullable', 'string', 'max:80'],
            'origen' => ['nullable', new Enum(OrigenCliente::class)],
            'notas' => ['nullable', 'string'],
            'responsable_id' => ['nullable', 'exists:usuarios,id'],
        ]);

        $cliente->update($datos);

        return $this->ok($cliente, 'Cliente actualizado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $cliente = Cliente::find($id);
        if (! $cliente) {
            return $this->fail('Cliente no encontrado.', 404);
        }

        $cliente->delete();

        return $this->ok(null, 'Cliente archivado.');
    }
}
