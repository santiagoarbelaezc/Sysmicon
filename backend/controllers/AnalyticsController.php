<?php
/**
 * Sysmicon Backend — AnalyticsController
 *
 * POST /analytics/view          → registrar visita (público)
 * GET  /admin/analytics/resumen → KPIs agregados
 * GET  /admin/analytics/visitas → visitas por día
 * GET  /admin/analytics/paginas → páginas más visitadas
 * GET  /admin/analytics/dispositivos → breakdown dispositivos
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class AnalyticsController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // POST /analytics/view — registrar visita desde el frontend Angular
    // ----------------------------------------------------------------
    public function registrarVisita(): void
    {
        $body = getJsonBody();

        $ruta = Validator::sanitizeString($body['ruta'] ?? '/');
        if (empty($ruta)) {
            jsonError('Ruta requerida.', 400);
        }

        $ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        $ipHash   = !empty($ip) ? hash('sha256', $ip) : null;
        $ua       = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $referrer = Validator::sanitizeString($body['referrer'] ?? '');
        $session  = Validator::sanitizeString($body['session_id'] ?? '');

        // Detectar dispositivo
        $dispositivo = 'desktop';
        if (preg_match('/Mobile|Android|iPhone|iPad/i', $ua)) {
            $dispositivo = preg_match('/iPad/i', $ua) ? 'tablet' : 'mobile';
        }

        $stmt = $this->db->prepare(
            'INSERT INTO page_views (ruta, referrer, user_agent, ip_hash, dispositivo, session_id)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $ruta,
            $referrer ?: null,
            substr($ua, 0, 500),
            $ipHash,
            $dispositivo,
            $session ?: null,
        ]);

        jsonSuccess(null, 'Visita registrada.', 201);
    }

    // ----------------------------------------------------------------
    // GET /admin/analytics/resumen — KPIs del dashboard
    // ----------------------------------------------------------------
    public function resumen(): void
    {
        AdminMiddleware::handle();

        $periodo = (int)($_GET['dias'] ?? 30);

        // Visitas totales en el período
        $visitasStmt = $this->db->prepare(
            'SELECT COUNT(*) FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)'
        );
        $visitasStmt->execute([$periodo]);
        $visitasTotales = (int)$visitasStmt->fetchColumn();

        // Visitas ayer
        $ayerStmt = $this->db->query(
            "SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)"
        );
        $visitasAyer = (int)$ayerStmt->fetchColumn();

        // Visitas hoy
        $hoyStmt = $this->db->query("SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURDATE()");
        $visitasHoy = (int)$hoyStmt->fetchColumn();

        // Mensajes no leídos
        $msgStmt = $this->db->query("SELECT COUNT(*) FROM mensajes WHERE leido = 0 AND archivado = 0");
        $mensajesNoLeidos = (int)$msgStmt->fetchColumn();

        // Total mensajes este mes
        $mensajesMesStmt = $this->db->query(
            "SELECT COUNT(*) FROM mensajes WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())"
        );
        $mensajesMes = (int)$mensajesMesStmt->fetchColumn();

        // Proyectos activos
        $proyectosStmt = $this->db->query("SELECT COUNT(*) FROM proyectos WHERE activo = 1");
        $proyectosActivos = (int)$proyectosStmt->fetchColumn();

        // Usuarios registrados
        $usersStmt = $this->db->query("SELECT COUNT(*) FROM users WHERE estado = 'activo'");
        $usuariosActivos = (int)$usersStmt->fetchColumn();

        // Sesiones únicas en el período (por session_id)
        $sesionesStmt = $this->db->prepare(
            'SELECT COUNT(DISTINCT session_id) FROM page_views WHERE session_id IS NOT NULL AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)'
        );
        $sesionesStmt->execute([$periodo]);
        $sesionesUnicas = (int)$sesionesStmt->fetchColumn();

        jsonSuccess([
            'visitas_totales'    => $visitasTotales,
            'visitas_hoy'        => $visitasHoy,
            'visitas_ayer'       => $visitasAyer,
            'sesiones_unicas'    => $sesionesUnicas,
            'mensajes_no_leidos' => $mensajesNoLeidos,
            'mensajes_este_mes'  => $mensajesMes,
            'proyectos_activos'  => $proyectosActivos,
            'usuarios_activos'   => $usuariosActivos,
            'periodo_dias'       => $periodo,
        ]);
    }

    // ----------------------------------------------------------------
    // GET /admin/analytics/visitas — visitas por día
    // ----------------------------------------------------------------
    public function visitasPorDia(): void
    {
        AdminMiddleware::handle();

        $dias = min(90, max(7, (int)($_GET['dias'] ?? 30)));

        $stmt = $this->db->prepare(
            "SELECT
               DATE(created_at)        AS dia,
               COUNT(*)                AS visitas,
               COUNT(DISTINCT ip_hash) AS visitantes_unicos
             FROM page_views
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY DATE(created_at)
             ORDER BY dia ASC"
        );
        $stmt->execute([$dias]);

        jsonSuccess($stmt->fetchAll());
    }

    // ----------------------------------------------------------------
    // GET /admin/analytics/paginas — páginas más visitadas
    // ----------------------------------------------------------------
    public function paginasMasVisitadas(): void
    {
        AdminMiddleware::handle();

        $dias  = min(90, max(7, (int)($_GET['dias'] ?? 30)));
        $limit = min(20, max(5, (int)($_GET['limit'] ?? 10)));

        $stmt = $this->db->prepare(
            "SELECT ruta, COUNT(*) AS visitas
             FROM page_views
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY ruta
             ORDER BY visitas DESC
             LIMIT ?"
        );
        $stmt->execute([$dias, $limit]);

        jsonSuccess($stmt->fetchAll());
    }

    // ----------------------------------------------------------------
    // GET /admin/analytics/dispositivos — breakdown desktop/mobile/tablet
    // ----------------------------------------------------------------
    public function dispositivos(): void
    {
        AdminMiddleware::handle();

        $dias = min(90, max(7, (int)($_GET['dias'] ?? 30)));

        $stmt = $this->db->prepare(
            "SELECT dispositivo, COUNT(*) AS visitas
             FROM page_views
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY dispositivo
             ORDER BY visitas DESC"
        );
        $stmt->execute([$dias]);

        $rows  = $stmt->fetchAll();
        $total = array_sum(array_column($rows, 'visitas'));

        $result = array_map(function ($row) use ($total) {
            return [
                'dispositivo' => $row['dispositivo'],
                'visitas'     => (int)$row['visitas'],
                'porcentaje'  => $total > 0 ? round((int)$row['visitas'] / $total * 100, 1) : 0,
            ];
        }, $rows);

        jsonSuccess($result);
    }
}
