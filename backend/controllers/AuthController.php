<?php
/**
 * Sysmicon Backend — AuthController
 * POST /auth/login
 * POST /auth/logout
 * POST /auth/refresh
 * GET  /auth/me
 */

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Sysmicon\Config\Database;

class AuthController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // POST /auth/login
    // ----------------------------------------------------------------
    public function login(): void
    {
        $body = getJsonBody();

        $v = Validator::make($body, [
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($v->fails()) {
            jsonError('Datos de acceso inválidos.', 422, $v->errors());
        }

        $email    = Validator::sanitizeString($body['email'] ?? '');
        $password = $body['password'] ?? '';

        // Buscar usuario
        $stmt = $this->db->prepare(
            'SELECT id, nombre, email, rol, estado, avatar_url, password
             FROM users WHERE email = ? LIMIT 1'
        );
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            jsonError('Credenciales incorrectas.', 401);
        }

        if ($user['estado'] !== 'activo') {
            jsonError('Tu cuenta está suspendida. Contacta al administrador.', 403);
        }

        // Generar tokens
        $accessToken  = $this->generateAccessToken($user);
        $refreshToken = $this->generateRefreshToken($user['id']);

        unset($user['password']);

        jsonSuccess([
            'user'          => $user,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in'    => (int)($_ENV['JWT_ACCESS_TTL'] ?? 900),
        ], 'Sesión iniciada exitosamente.');
    }

    // ----------------------------------------------------------------
    // POST /auth/refresh
    // ----------------------------------------------------------------
    public function refresh(): void
    {
        $body         = getJsonBody();
        $refreshToken = $body['refresh_token'] ?? '';

        if (empty($refreshToken)) {
            jsonError('Refresh token no proporcionado.', 400);
        }

        // Buscar en BD
        $stmt = $this->db->prepare(
            'SELECT rt.user_id, rt.expires_at, u.nombre, u.email, u.rol, u.estado, u.avatar_url
             FROM refresh_tokens rt
             JOIN users u ON u.id = rt.user_id
             WHERE rt.token = ? LIMIT 1'
        );
        $stmt->execute([$refreshToken]);
        $row = $stmt->fetch();

        if (!$row) {
            jsonError('Refresh token inválido.', 401);
        }

        if (new \DateTime() > new \DateTime($row['expires_at'])) {
            // Eliminar token expirado
            $del = $this->db->prepare('DELETE FROM refresh_tokens WHERE token = ?');
            $del->execute([$refreshToken]);
            jsonError('Sesión expirada. Inicia sesión nuevamente.', 401);
        }

        if ($row['estado'] !== 'activo') {
            jsonError('Cuenta suspendida.', 403);
        }

        $user = [
            'id'         => $row['user_id'],
            'nombre'     => $row['nombre'],
            'email'      => $row['email'],
            'rol'        => $row['rol'],
            'avatar_url' => $row['avatar_url'],
        ];

        $newAccessToken = $this->generateAccessToken($user);

        jsonSuccess([
            'access_token' => $newAccessToken,
            'expires_in'   => (int)($_ENV['JWT_ACCESS_TTL'] ?? 900),
        ], 'Token renovado.');
    }

    // ----------------------------------------------------------------
    // POST /auth/logout
    // ----------------------------------------------------------------
    public function logout(): void
    {
        $body         = getJsonBody();
        $refreshToken = $body['refresh_token'] ?? '';

        if (!empty($refreshToken)) {
            $stmt = $this->db->prepare('DELETE FROM refresh_tokens WHERE token = ?');
            $stmt->execute([$refreshToken]);
        }

        jsonSuccess(null, 'Sesión cerrada exitosamente.');
    }

    // ----------------------------------------------------------------
    // GET /auth/me
    // ----------------------------------------------------------------
    public function me(): void
    {
        $payload = AuthMiddleware::handle();

        $stmt = $this->db->prepare(
            'SELECT id, nombre, email, telefono, rol, estado, avatar_url, created_at
             FROM users WHERE id = ? LIMIT 1'
        );
        $stmt->execute([$payload->sub]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonError('Usuario no encontrado.', 404);
        }

        jsonSuccess($user);
    }

    // ----------------------------------------------------------------
    // Helpers privados
    // ----------------------------------------------------------------
    private function generateAccessToken(array $user): string
    {
        $now = time();
        $ttl = (int)($_ENV['JWT_ACCESS_TTL'] ?? 900);

        $payload = [
            'iss'   => $_ENV['JWT_ISSUER'] ?? 'sysmicon',
            'sub'   => $user['id'],
            'email' => $user['email'],
            'rol'   => $user['rol'],
            'nombre'=> $user['nombre'],
            'iat'   => $now,
            'exp'   => $now + $ttl,
        ];

        return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    }

    private function generateRefreshToken(int $userId): string
    {
        $token     = bin2hex(random_bytes(48));
        $ttl       = (int)($_ENV['JWT_REFRESH_TTL'] ?? 604800);
        $expiresAt = date('Y-m-d H:i:s', time() + $ttl);

        $stmt = $this->db->prepare(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
        );
        $stmt->execute([$userId, $token, $expiresAt]);

        return $token;
    }
}
