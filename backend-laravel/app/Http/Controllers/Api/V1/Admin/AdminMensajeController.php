<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\EstadoMensaje;
use App\Enums\EtapaOportunidad;
use App\Enums\OrigenCliente;
use App\Enums\TipoCliente;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Mensaje;
use App\Models\Oportunidad;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminMensajeController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Mensaje::query();

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        if ($request->filled('tipo_servicio')) {
            $query->where('tipo_servicio', $request->input('tipo_servicio'));
        }

        if ($request->filled('search')) {
            $term = '%'.$request->input('search').'%';
            $query->where(function ($q) use ($term) {
                $q->where('nombre_completo', 'like', $term)
                  ->orWhere('correo', 'like', $term)
                  ->orWhere('telefono', 'like', $term);
            });
        }

        $mensajes = $query->orderByDesc('id')->paginate($request->integer('per_page', 20));

        return $this->ok($mensajes);
    }

    public function show(int $id): JsonResponse
    {
        $mensaje = Mensaje::with('clienteConvertido')->find($id);
        if (! $mensaje) {
            return $this->fail('Mensaje no encontrado.', 404);
        }

        if ($mensaje->estado === EstadoMensaje::Nuevo) {
            $mensaje->update([
                'estado' => EstadoMensaje::Leido,
                'leido_at' => now(),
            ]);
        }

        return $this->ok($mensaje);
    }

    public function marcarLeido(int $id): JsonResponse
    {
        $mensaje = Mensaje::find($id);
        if (! $mensaje) {
            return $this->fail('Mensaje no encontrado.', 404);
        }

        $mensaje->update(['estado' => EstadoMensaje::Leido, 'leido_at' => now()]);

        return $this->ok($mensaje, 'Mensaje marcado como leído.');
    }

    public function archivar(int $id): JsonResponse
    {
        $mensaje = Mensaje::find($id);
        if (! $mensaje) {
            return $this->fail('Mensaje no encontrado.', 404);
        }

        $mensaje->update(['estado' => EstadoMensaje::Archivado]);

        return $this->ok($mensaje, 'Mensaje archivado.');
    }

    public function destroy(int $id): JsonResponse
    {
        $mensaje = Mensaje::find($id);
        if (! $mensaje) {
            return $this->fail('Mensaje no encontrado.', 404);
        }

        $mensaje->delete();

        return $this->ok(null, 'Mensaje eliminado.');
    }

    public function convertirEnLead(Request $request, int $id): JsonResponse
    {
        $mensaje = Mensaje::find($id);
        if (! $mensaje) {
            return $this->fail('Mensaje no encontrado.', 404);
        }

        if ($mensaje->convertido_cliente_id) {
            return $this->fail('Este mensaje ya fue convertido en cliente previamente.', 409);
        }

        $resultado = DB::transaction(function () use ($mensaje, $request) {
            // 1. Buscar o crear Cliente
            $cliente = Cliente::firstOrCreate(
                ['email' => $mensaje->correo],
                [
                    'tipo' => TipoCliente::Persona,
                    'nombre' => $mensaje->nombre_completo,
                    'telefono' => $mensaje->telefono,
                    'origen' => OrigenCliente::Web,
                    'notas' => 'Lead generado desde el formulario web (Cotiza con nosotros).',
                    'responsable_id' => $request->user()->id,
                ]
            );

            // 2. Crear Oportunidad en etapa Contacto
            $oportunidad = Oportunidad::create([
                'cliente_id' => $cliente->id,
                'titulo' => 'Proyecto: '.$mensaje->tipo_servicio->value.' - '.$cliente->nombre,
                'tipo_proyecto' => 'vivienda',
                'etapa' => EtapaOportunidad::Contacto,
                'valor_estimado' => 0,
                'probabilidad' => 10,
                'responsable_id' => $request->user()->id,
                'orden' => Oportunidad::where('etapa', EtapaOportunidad::Contacto)->count(),
            ]);

            // 3. Vincular y actualizar mensaje
            $mensaje->update([
                'estado' => EstadoMensaje::Convertido,
                'convertido_cliente_id' => $cliente->id,
            ]);

            return [
                'cliente' => $cliente,
                'oportunidad' => $oportunidad,
            ];
        });

        return $this->ok($resultado, 'Mensaje convertido exitosamente en Cliente y Oportunidad del CRM.');
    }
}
