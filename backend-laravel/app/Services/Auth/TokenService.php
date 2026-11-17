<?php

namespace App\Services\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;
use Throwable;

class TokenService
{
    private function secret(): string
    {
        $secret = (string) config('sysmicon.auth.jwt_secret');

        if (strlen($secret) < 32) {
            throw new RuntimeException('JWT_SECRET no configurado o demasiado corto (mínimo 32 caracteres).');
        }

        return $secret;
    }

    /** @param array<string,mixed> $claims */
    public function emitir(string $guard, int $sujetoId, string $sid, array $claims = []): string
    {
        $ahora = now()->timestamp;

        return JWT::encode(array_merge($claims, [
            'iss' => config('sysmicon.auth.jwt_issuer'),
            'sub' => (string) $sujetoId,
            'guard' => $guard,
            'sid' => $sid,
            'jti' => bin2hex(random_bytes(8)),
            'iat' => $ahora,
            'exp' => $ahora + (int) config('sysmicon.auth.access_ttl'),
        ]), $this->secret(), 'HS256');
    }

    /** @return array<string,mixed>|null null si es inválido o expiró */
    public function verificar(string $jwt): ?array
    {
        JWT::$timestamp = now()->timestamp; // reloj de la app (consistente con Carbon y los tests)

        try {
            $datos = (array) JWT::decode($jwt, new Key($this->secret(), 'HS256'));
        } catch (Throwable) {
            return null;
        }

        return ($datos['iss'] ?? null) === config('sysmicon.auth.jwt_issuer') ? $datos : null;
    }
}
