<?php
/**
 * Sysmicon Backend — Middleware de Rol Admin
 */

declare(strict_types=1);

class AdminMiddleware
{
    /**
     * Valida que el JWT exista Y que el usuario tenga rol 'admin'.
     */
    public static function handle(): object
    {
        $payload = AuthMiddleware::handle();

        if (($payload->rol ?? '') !== 'admin') {
            jsonError('Acceso denegado. Se requiere rol de administrador.', 403);
        }

        return $payload;
    }
}
