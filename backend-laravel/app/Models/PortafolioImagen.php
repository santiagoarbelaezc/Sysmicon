<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortafolioImagen extends Model
{
    protected $table = 'portafolio_imagenes';

    protected $fillable = ['portafolio_proyecto_id', 'url', 'public_id', 'orden'];

    public function proyecto(): BelongsTo { return $this->belongsTo(PortafolioProyecto::class, 'portafolio_proyecto_id'); }
}
