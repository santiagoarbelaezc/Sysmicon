<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortafolioProyecto extends Model
{
    protected $table = 'portafolio_proyectos';

    protected $fillable = ['titulo', 'descripcion', 'categoria', 'ubicacion', 'activo', 'orden'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function imagenes(): HasMany { return $this->hasMany(PortafolioImagen::class)->orderBy('orden'); }
}
