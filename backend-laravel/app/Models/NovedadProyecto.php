<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NovedadProyecto extends Model
{
    protected $table = 'novedades_proyecto';

    protected $fillable = ['proyecto_id', 'titulo', 'contenido', 'publicada', 'publicada_at', 'autor_id'];

    protected function casts(): array
    {
        return ['publicada' => 'boolean', 'publicada_at' => 'datetime'];
    }

    public function proyecto(): BelongsTo { return $this->belongsTo(Proyecto::class); }
    public function autor(): BelongsTo { return $this->belongsTo(Usuario::class, 'autor_id'); }
}
