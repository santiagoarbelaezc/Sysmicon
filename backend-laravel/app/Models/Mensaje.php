<?php

namespace App\Models;

use App\Enums\EstadoMensaje;
use App\Enums\TipoServicio;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/** Solicitudes del formulario público "Cotiza con nosotros". */
class Mensaje extends Model
{
    use SoftDeletes;

    protected $table = 'mensajes';

    protected $fillable = [
        'nombre_completo', 'correo', 'telefono', 'tipo_servicio', 'detalles', 'estado',
        'convertido_cliente_id', 'ip_hash', 'user_agent', 'consentimiento_datos', 'leido_at',
    ];

    protected function casts(): array
    {
        return [
            'tipo_servicio' => TipoServicio::class,
            'estado' => EstadoMensaje::class,
            'consentimiento_datos' => 'boolean',
            'leido_at' => 'datetime',
        ];
    }

    public function clienteConvertido(): BelongsTo { return $this->belongsTo(Cliente::class, 'convertido_cliente_id'); }
}
