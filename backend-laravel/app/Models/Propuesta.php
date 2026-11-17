<?php

namespace App\Models;

use App\Enums\EstadoPropuesta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Propuesta extends Model
{
    protected $table = 'propuestas';

    protected $fillable = ['oportunidad_id', 'numero', 'fecha_envio', 'valor', 'estado', 'archivo_url'];

    protected function casts(): array
    {
        return ['estado' => EstadoPropuesta::class, 'fecha_envio' => 'date', 'valor' => 'decimal:2'];
    }

    public function oportunidad(): BelongsTo { return $this->belongsTo(Oportunidad::class); }
}
