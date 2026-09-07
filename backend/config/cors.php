<?php
/**
 * Sysmicon Backend — CORS Headers
 * Configura los headers CORS dinámicamente basándose en el .env
 */

declare(strict_types=1);

function applyCorsHeaders(): void
{
    $envOrigins = $_ENV['ALLOWED_ORIGINS'] ?? $_SERVER['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?? '';
    if (empty($envOrigins)) {
        $envOrigins = 'http://localhost:4200,https://sysmicon.com,https://www.sysmicon.com';
    }
    $allowedOrigins = array_filter(array_map('trim', explode(',', (string)$envOrigins)));

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (!empty($origin) && (in_array($origin, $allowedOrigins, true) || in_array('*', $allowedOrigins, true))) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
    } elseif (in_array('*', $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: *');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    header('Access-Control-Max-Age: 3600');

    // Responder inmediatamente a pre-flight OPTIONS
    if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
