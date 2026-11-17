<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hito extends Model
{
    protected $table = 'hitos';

    protected $fillable = ['proyecto_id', 'nombre', 'fecha_limite', 'completado', 'completado_at'];

    protected function casts(): array
    {
        return ['fecha_limite' => 'date', 'completado' => 'boolean', 'completado_at' => 'datetime'];
    }

    public function proyecto(): BelongsTo { return $this->belongsTo(Proyecto::class); }
}
