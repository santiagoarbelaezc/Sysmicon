<?php
/**
 * Sysmicon Backend — MensajesController
 * Gestión de mensajes para el panel admin.
 *
 * GET    /admin/mensajes          → index()
 * GET    /admin/mensajes/:id      → show()
 * PATCH  /admin/mensajes/:id/leer    → marcarLeido()
 * PATCH  /admin/mensajes/:id/archivar → archivar()
 * DELETE /admin/mensajes/:id      → destroy()
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class MensajesController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // GET /admin/mensajes
    // ----------------------------------------------------------------
    public function index(): void
    {
        AdminMiddleware::handle();

        $page     = max(1, (int)($_GET['page'] ?? 1));
        $perPage  = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset   = ($page - 1) * $perPage;
        $tipo     = $_GET['tipo'] ?? '';
        $leido    = $_GET['leido'] ?? '';
        $archivado = (int)($_GET['archivado'] ?? 0);

        $where  = 'WHERE archivado = ?';
        $params = [$archivado];

        if (!empty($tipo)) {
            $where   .= ' AND tipo = ?';
            $params[] = $tipo;
        }

        if ($leido !== '') {
            $where   .= ' AND leido = ?';
            $params[] = (int)$leido;
        }

        $totalStmt = $this->db->prepare("SELECT COUNT(*) FROM mensajes {$where}");
        $totalStmt->execute($params);
        $total = (int)$totalStmt->fetchColumn();

        $params[] = $perPage;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT id, remitente, email, telefono, asunto, contenido, tipo,
                    presupuesto, tipo_servicio, ubicacion_proyecto,
                    fecha_cita_solicitada, hora_preferida,
                    leido, archivado, created_at
             FROM mensajes {$where}
             ORDER BY leido ASC, created_at DESC
             LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        $mensajes = $stmt->fetchAll();

        jsonPaginated($mensajes, $total, $page, $perPage);
    }

    // ----------------------------------------------------------------
    // GET /admin/mensajes/:id
    // ----------------------------------------------------------------
    public function show(int $id): void
    {
        AdminMiddleware::handle();
        $mensaje = $this->findOrFail($id);

        // Auto-marcar como leído al abrir
        if (!$mensaje['leido']) {
            $this->db->prepare('UPDATE mensajes SET leido = 1 WHERE id = ?')->execute([$id]);
            $mensaje['leido'] = 1;
        }

        jsonSuccess($mensaje);
    }

    // ----------------------------------------------------------------
    // PATCH /admin/mensajes/:id/leer
    // ----------------------------------------------------------------
    public function marcarLeido(int $id): void
    {
        AdminMiddleware::handle();
        $this->findOrFail($id);

        $this->db->prepare('UPDATE mensajes SET leido = 1 WHERE id = ?')->execute([$id]);
        jsonSuccess(null, 'Mensaje marcado como leído.');
    }

    // ----------------------------------------------------------------
    // PATCH /admin/mensajes/:id/archivar
    // ----------------------------------------------------------------
    public function archivar(int $id): void
    {
        AdminMiddleware::handle();
        $this->findOrFail($id);

        $this->db->prepare('UPDATE mensajes SET archivado = NOT archivado WHERE id = ?')->execute([$id]);
        jsonSuccess(null, 'Estado de archivado actualizado.');
    }

    // ----------------------------------------------------------------
    // DELETE /admin/mensajes/:id
    // ----------------------------------------------------------------
    public function destroy(int $id): void
    {
        AdminMiddleware::handle();
        $this->findOrFail($id);

        $this->db->prepare('DELETE FROM mensajes WHERE id = ?')->execute([$id]);
        jsonSuccess(null, 'Mensaje eliminado.');
    }

    // ----------------------------------------------------------------
    private function findOrFail(int $id): array
    {
        $stmt = $this->db->prepare('SELECT * FROM mensajes WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $msg = $stmt->fetch();

        if (!$msg) {
            jsonError('Mensaje no encontrado.', 404);
        }

        return $msg;
    }
}
