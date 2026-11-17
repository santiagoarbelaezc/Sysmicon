<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Cuenta del portal de clientes. Modelo y tabla SEPARADOS de `Usuario`:
 * no tiene rol y jamás puede acceder al panel admin.
 */
class CuentaCliente extends Authenticatable
{
    protected $table = 'cuentas_clientes';

    protected $fillable = ['nombre', 'email', 'telefono', 'password', 'acepta_novedades', 'consentimiento_datos_at'];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'email_verificado_at' => 'datetime',
            'consentimiento_datos_at' => 'datetime',
            'acepta_novedades' => 'boolean',
            'activo' => 'boolean',
            'bloqueado_hasta' => 'datetime',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function estaBloqueado(): bool
    {
        return $this->bloqueado_hasta !== null && $this->bloqueado_hasta->isFuture();
    }
}
