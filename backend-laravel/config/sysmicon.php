<?php

return [
    /*
    | Parámetros de seguridad de sesión (ver plan: sesión absoluta de 12 h).
    */
    'auth' => [
        'jwt_secret' => env('JWT_SECRET'),
        'jwt_issuer' => env('JWT_ISSUER', 'sysmicon-api'),
        'access_ttl' => (int) env('AUTH_ACCESS_TTL', 15 * 60),          // 15 min
        'session_ttl' => (int) env('AUTH_SESSION_TTL', 12 * 60 * 60),   // 12 h absolutas
        'idle_ttl' => (int) env('AUTH_IDLE_TTL', 30 * 60),              // 30 min sin refrescar
        'max_intentos' => (int) env('AUTH_MAX_INTENTOS', 5),
        // Bloqueo progresivo en minutos por nivel (15 min -> 1 h -> 24 h)
        'bloqueos_min' => [15, 60, 1440],
        'refresh_cookie' => env('AUTH_REFRESH_COOKIE', 'sysmicon_refresh'),
        'cookie_secure' => env('AUTH_COOKIE_SECURE', env('APP_ENV') !== 'local'),
        'cookie_path' => '/api/v1',
        'exigir_2fa_admin' => (bool) env('AUTH_REQUIRE_2FA_ADMIN', true),
        'totp_issuer' => env('AUTH_TOTP_ISSUER', 'Sysmicon'),
    ],
];
