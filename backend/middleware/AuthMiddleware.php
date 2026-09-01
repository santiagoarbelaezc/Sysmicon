<?php
/**
 * Sysmicon Backend — Middleware de Autenticación JWT
 */

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class AuthMiddleware
{
    /**
     * Valida el JWT del header Authorization y retorna el payload.
     * Si el token es inválido o falta, termina con 401.
     */
    public static function handle(): object
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (empty($header) || !str_starts_with($header, 'Bearer ')) {
            jsonError('Token de autenticación no proporcionado.', 401);
        }

        $token = substr($header, 7);

        try {
            $payload = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
        } catch (ExpiredException) {
            jsonError('La sesión ha expirado. Inicia sesión nuevamente.', 401);
        } catch (\Exception) {
            jsonError('Token inválido.', 401);
        }

        return $payload;
    }
}
