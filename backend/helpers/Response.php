<?php
/**
 * Sysmicon Backend — Helper de Respuestas JSON
 */

declare(strict_types=1);

function jsonSuccess(mixed $data = null, string $message = 'OK', int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonError(string $message, int $code = 400, mixed $errors = null): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    $payload = [
        'success' => false,
        'message' => $message,
    ];
    if ($errors !== null) {
        $payload['errors'] = $errors;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonPaginated(array $items, int $total, int $page, int $perPage): never
{
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success'    => true,
        'data'       => $items,
        'pagination' => [
            'total'    => $total,
            'page'     => $page,
            'per_page' => $perPage,
            'pages'    => (int) ceil($total / max($perPage, 1)),
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
