<?php

namespace App\Services\Auth;

use App\Models\Usuario;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorService
{
    public function __construct(private readonly Google2FA $google2fa = new Google2FA())
    {
    }

    public function generarSecreto(): string
    {
        return $this->google2fa->generateSecretKey(32);
    }

    public function uriOtpAuth(Usuario $usuario, string $secreto): string
    {
        return $this->google2fa->getQRCodeUrl((string) config('sysmicon.auth.totp_issuer'), $usuario->email, $secreto);
    }

    public function verificar(string $secreto, string $codigo): bool
    {
        return (bool) $this->google2fa->verifyKey($secreto, preg_replace('/\s+/', '', $codigo), 1);
    }

    /** @return array{0: list<string>, 1: list<string>} [planos, hashes] */
    public function generarCodigosRecuperacion(int $cantidad = 8): array
    {
        $planos = [];
        for ($i = 0; $i < $cantidad; $i++) {
            $planos[] = Str::lower(Str::random(5).'-'.Str::random(5));
        }

        return [$planos, array_map(fn ($c) => hash('sha256', $c), $planos)];
    }

    /** Consume un código de recuperación si es válido (uso único). */
    public function consumirRecuperacion(Usuario $usuario, string $codigo): bool
    {
        $hashes = $usuario->two_factor_recovery_codes ?? [];
        $hash = hash('sha256', Str::lower(trim($codigo)));
        $idx = array_search($hash, $hashes, true);

        if ($idx === false) {
            return false;
        }

        unset($hashes[$idx]);
        $usuario->forceFill(['two_factor_recovery_codes' => array_values($hashes)])->save();

        return true;
    }

    public function activo(Usuario $usuario): bool
    {
        return $usuario->two_factor_confirmed_at !== null && $usuario->two_factor_secret !== null;
    }
}
