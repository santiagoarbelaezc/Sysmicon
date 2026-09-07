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
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (empty($header) && function_exists('getallheaders')) {
            $headers = getallheaders();
            $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (empty($header) && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

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
