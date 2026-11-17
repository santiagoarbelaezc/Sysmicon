<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contacto extends Model
{
    protected $table = 'contactos';

    protected $fillable = ['cliente_id', 'nombre', 'cargo', 'email', 'telefono'];

    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class); }
}
