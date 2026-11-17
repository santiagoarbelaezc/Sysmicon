<?php

namespace App\Models;

use App\Enums\EstadoProyecto;
use App\Enums\FaseProyecto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/** Proyecto de obra del CRM (no confundir con PortafolioProyecto, que es contenido público del sitio). */
class Proyecto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'proyectos';

    protected $fillable = [
        'cliente_id', 'oportunidad_id', 'nombre', 'direccion_obra', 'fase', 'estado',
        'fecha_inicio', 'fecha_fin_estimada', 'presupuesto', 'responsable_id',
    ];

    protected function casts(): array
    {
        return [
            'fase' => FaseProyecto::class,
            'estado' => EstadoProyecto::class,
            'fecha_inicio' => 'date',
            'fecha_fin_estimada' => 'date',
            'presupuesto' => 'decimal:2',
        ];
    }

    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class); }
    public function oportunidad(): BelongsTo { return $this->belongsTo(Oportunidad::class); }
    public function responsable(): BelongsTo { return $this->belongsTo(Usuario::class, 'responsable_id'); }
    public function hitos(): HasMany { return $this->hasMany(Hito::class); }
    public function tareas(): HasMany { return $this->hasMany(Tarea::class); }
    public function actividades(): HasMany { return $this->hasMany(Actividad::class); }
    public function novedades(): HasMany { return $this->hasMany(NovedadProyecto::class); }
}
