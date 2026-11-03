<?php
/**
 * Sysmicon Backend — UsuariosController
 *
 * GET    /admin/usuarios            → index()
 * GET    /admin/usuarios/:id        → show()
 * PATCH  /admin/usuarios/:id/estado → toggleEstado()
 * DELETE /admin/usuarios/:id        → destroy()
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class UsuariosController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // GET /admin/usuarios
    // ----------------------------------------------------------------
    public function index(): void
    {
        $payload = AdminMiddleware::handle();

        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset  = ($page - 1) * $perPage;
        $rol     = $_GET['rol'] ?? '';
        $estado  = $_GET['estado'] ?? '';

        $where  = 'WHERE 1=1';
        $params = [];

        if (!empty($rol)) {
            $where   .= ' AND rol = ?';
            $params[] = $rol;
        }

        if (!empty($estado)) {
            $where   .= ' AND estado = ?';
            $params[] = $estado;
        }

        $totalStmt = $this->db->prepare("SELECT COUNT(*) FROM users {$where}");
        $totalStmt->execute($params);
        $total = (int)$totalStmt->fetchColumn();

        $params[] = $perPage;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT id, nombre, email, telefono, rol, estado, avatar_url, created_at, updated_at
             FROM users {$where}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        $usuarios = $stmt->fetchAll();

        jsonPaginated($usuarios, $total, $page, $perPage);
    }

    // ----------------------------------------------------------------
    // GET /admin/usuarios/:id
    // ----------------------------------------------------------------
    public function show(int $id): void
    {
        AdminMiddleware::handle();
        $user = $this->findOrFail($id);
        unset($user['password']);
        jsonSuccess($user);
    }

    // ----------------------------------------------------------------
    // PATCH /admin/usuarios/:id/estado
    // ----------------------------------------------------------------
    public function toggleEstado(int $id): void
    {
        $payload = AdminMiddleware::handle();
        $user = $this->findOrFail($id);

        // Regla: No puedes suspender o cambiar el estado de tu propia cuenta
        $authId = (int)($payload->sub ?? 0);
        $authEmail = strtolower(trim((string)($payload->email ?? '')));
        $targetEmail = strtolower(trim((string)($user['email'] ?? '')));

        if ($authId === $id || ($authEmail !== '' && $authEmail === $targetEmail)) {
            jsonError('Operación denegada: Un administrador no puede suspender o cambiar el estado de su propia cuenta.', 403);
        }

        // Regla: Proteger que no se suspenda al único administrador activo
        if ($user['rol'] === 'admin' && $user['estado'] === 'activo') {
            $adminCount = (int)$this->db->query("SELECT COUNT(*) FROM users WHERE rol = 'admin' AND estado = 'activo'")->fetchColumn();
            if ($adminCount <= 1) {
                jsonError('Operación denegada: No se puede suspender al único administrador activo del sistema.', 403);
            }
        }

        $nuevoEstado = $user['estado'] === 'activo' ? 'suspendido' : 'activo';

        $this->db->prepare('UPDATE users SET estado = ?, updated_at = NOW() WHERE id = ?')
                 ->execute([$nuevoEstado, $id]);

        jsonSuccess(['estado' => $nuevoEstado], "Usuario {$nuevoEstado} exitosamente.");
    }

    // ----------------------------------------------------------------
    // DELETE /admin/usuarios/:id
    // ----------------------------------------------------------------
    public function destroy(int $id): void
    {
        $payload = AdminMiddleware::handle();
        $user = $this->findOrFail($id);

        // Regla: No puedes eliminar o retirar tu propia cuenta
        $authId = (int)($payload->sub ?? 0);
        $authEmail = strtolower(trim((string)($payload->email ?? '')));
        $targetEmail = strtolower(trim((string)($user['email'] ?? '')));

        if ($authId === $id || ($authEmail !== '' && $authEmail === $targetEmail)) {
            jsonError('Operación denegada: Un administrador no puede eliminar o retirar su propia cuenta.', 403);
        }

        // Regla: Proteger que no se elimine al único administrador del sistema
        if ($user['rol'] === 'admin') {
            $adminCount = (int)$this->db->query("SELECT COUNT(*) FROM users WHERE rol = 'admin'")->fetchColumn();
            if ($adminCount <= 1) {
                jsonError('Operación denegada: No se puede eliminar al único administrador registrado en el portal.', 403);
            }
        }

        // Eliminar refresh tokens primero (cascade por seguridad)
        $this->db->prepare('DELETE FROM refresh_tokens WHERE user_id = ?')->execute([$id]);
        $this->db->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);

        jsonSuccess(null, 'Usuario retirado del portal exitosamente.');
    }

    // ----------------------------------------------------------------
    private function findOrFail(int $id): array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonError('Usuario no encontrado.', 404);
        }

        return $user;
    }
}
