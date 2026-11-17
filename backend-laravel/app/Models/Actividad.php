<?php

namespace App\Models;

use App\Enums\TipoActividad;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actividad extends Model
{
    protected $table = 'actividades';

    protected $fillable = ['tipo', 'descripcion', 'fecha', 'usuario_id', 'cliente_id', 'oportunidad_id', 'proyecto_id'];

    protected function casts(): array
    {
        return ['tipo' => TipoActividad::class, 'fecha' => 'datetime'];
    }

    public function usuario(): BelongsTo { return $this->belongsTo(Usuario::class); }
    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class); }
    public function oportunidad(): BelongsTo { return $this->belongsTo(Oportunidad::class); }
    public function proyecto(): BelongsTo { return $this->belongsTo(Proyecto::class); }
}
