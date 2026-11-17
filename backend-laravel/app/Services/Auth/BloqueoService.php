<?php

namespace App\Services\Auth;

use Illuminate\Database\Eloquent\Model;

/** Bloqueo progresivo por intentos fallidos (aplica a Usuario y CuentaCliente). */
class BloqueoService
{
    /** @return bool true si este fallo provocó un bloqueo */
    public function registrarFallo(Model $sujeto): bool
    {
        $intentos = $sujeto->intentos_fallidos + 1;

        if ($intentos < (int) config('sysmicon.auth.max_intentos')) {
            $sujeto->forceFill(['intentos_fallidos' => $intentos])->save();

            return false;
        }

        $niveles = config('sysmicon.auth.bloqueos_min');
        $nivel = min($sujeto->nivel_bloqueo, count($niveles) - 1);

        $sujeto->forceFill([
            'intentos_fallidos' => 0,
            'nivel_bloqueo' => min($sujeto->nivel_bloqueo + 1, count($niveles)),
            'bloqueado_hasta' => now()->addMinutes($niveles[$nivel]),
        ])->save();

        return true;
    }

    public function limpiar(Model $sujeto): void
    {
        $sujeto->forceFill(['intentos_fallidos' => 0, 'nivel_bloqueo' => 0, 'bloqueado_hasta' => null])->save();
    }
}
