<?php

namespace App\Models;

use App\Enums\EtapaOportunidad;
use App\Enums\TipoProyecto;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Oportunidad extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'oportunidades';

    protected $fillable = [
        'cliente_id', 'titulo', 'tipo_proyecto', 'etapa', 'valor_estimado', 'probabilidad',
        'fecha_cierre_estimada', 'motivo_perdida', 'orden', 'responsable_id',
    ];

    protected function casts(): array
    {
        return [
            'tipo_proyecto' => TipoProyecto::class,
            'etapa' => EtapaOportunidad::class,
            'valor_estimado' => 'decimal:2',
            'fecha_cierre_estimada' => 'date',
        ];
    }

    public function cliente(): BelongsTo { return $this->belongsTo(Cliente::class); }
    public function responsable(): BelongsTo { return $this->belongsTo(Usuario::class, 'responsable_id'); }
    public function propuestas(): HasMany { return $this->hasMany(Propuesta::class); }
    public function proyecto(): HasOne { return $this->hasOne(Proyecto::class); }
    public function tareas(): HasMany { return $this->hasMany(Tarea::class); }
    public function actividades(): HasMany { return $this->hasMany(Actividad::class); }
}
