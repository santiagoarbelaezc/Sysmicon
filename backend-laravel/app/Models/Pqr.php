<?php

namespace App\Models;

use App\Enums\EstadoPqr;
use App\Enums\TipoPqr;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pqr extends Model
{
    protected $table = 'pqr';

    protected $fillable = [
        'radicado', 'tipo', 'nombre_completo', 'correo', 'telefono', 'asunto', 'descripcion', 'estado',
        'respuesta', 'respondido_por', 'respondido_at', 'fecha_limite_respuesta', 'cuenta_cliente_id', 'consentimiento_datos',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => TipoPqr::class,
            'estado' => EstadoPqr::class,
            'respondido_at' => 'datetime',
            'fecha_limite_respuesta' => 'date',
            'consentimiento_datos' => 'boolean',
        ];
    }

    public function respondidoPor(): BelongsTo { return $this->belongsTo(Usuario::class, 'respondido_por'); }
    public function cuentaCliente(): BelongsTo { return $this->belongsTo(CuentaCliente::class); }
}
