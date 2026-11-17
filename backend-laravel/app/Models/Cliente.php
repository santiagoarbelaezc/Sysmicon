<?php

namespace App\Models;

use App\Enums\OrigenCliente;
use App\Enums\TipoCliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = ['tipo', 'nombre', 'email', 'telefono', 'direccion', 'ciudad', 'origen', 'notas', 'responsable_id'];

    protected function casts(): array
    {
        return ['tipo' => TipoCliente::class, 'origen' => OrigenCliente::class];
    }

    public function responsable(): BelongsTo { return $this->belongsTo(Usuario::class, 'responsable_id'); }
    public function contactos(): HasMany { return $this->hasMany(Contacto::class); }
    public function oportunidades(): HasMany { return $this->hasMany(Oportunidad::class); }
    public function proyectos(): HasMany { return $this->hasMany(Proyecto::class); }
    public function tareas(): HasMany { return $this->hasMany(Tarea::class); }
    public function actividades(): HasMany { return $this->hasMany(Actividad::class); }
}
