<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Model
{
    protected $table = 'tareas';

    protected $fillable = [
        'titulo', 'descripcion', 'fecha_vencimiento', 'completada', 'completada_at',
        'asignado_a', 'cliente_id', 'oportunidad_id', 'proyecto_id',
    ];

    protected function casts(): array
    {
        return ['fecha_vencimiento' => 'date', 'completada' => 'boolean', 'completada_at' => 'datetime'];
    }

    public function asignado(): BelongsTo { return $this->belongsTo(Usuario::class, 'asignado_a'); }
    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class); }
    public function oportunidad(): BelongsTo { return $this->belongsTo(Oportunidad::class); }
    public function proyecto(): BelongsTo { return $this->belongsTo(Proyecto::class); }
}
