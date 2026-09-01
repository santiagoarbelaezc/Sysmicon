<?php
/**
 * Sysmicon Backend — CORS Headers
 * Configura los headers CORS dinámicamente basándose en el .env
 */

declare(strict_types=1);

function applyCorsHeaders(): void
{
    $allowedOrigins = explode(',', $_ENV['ALLOWED_ORIGINS'] ?? '');
    $allowedOrigins = array_map('trim', $allowedOrigins);

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true) || in_array('*', $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    header('Access-Control-Max-Age: 3600');

    // Responder inmediatamente a pre-flight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
