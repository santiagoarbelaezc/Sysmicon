<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Sesion extends Model
{
    use HasUuids;

    protected $table = 'sesiones';

    protected $fillable = [
        'guard', 'sujeto_id', 'refresh_hash', 'familia_id', 'ip', 'user_agent',
        'ultimo_uso_at', 'expira_at', 'revocada_at', 'reemplazada_por',
    ];

    protected function casts(): array
    {
        return ['expira_at' => 'datetime', 'ultimo_uso_at' => 'datetime', 'revocada_at' => 'datetime'];
    }

    public function activa(): bool
    {
        return $this->revocada_at === null && $this->expira_at->isFuture();
    }
}
