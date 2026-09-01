<?php
/**
 * Sysmicon Backend — DashboardController
 * GET /admin/dashboard — KPIs consolidados para el inicio del panel
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class DashboardController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function index(): void
    {
        AdminMiddleware::handle();

        // --- Mensajes ---
        $msgTotal   = (int)$this->db->query('SELECT COUNT(*) FROM mensajes WHERE archivado = 0')->fetchColumn();
        $msgNoLeido = (int)$this->db->query('SELECT COUNT(*) FROM mensajes WHERE leido = 0 AND archivado = 0')->fetchColumn();

        $msgPorTipo = $this->db->query(
            "SELECT tipo, COUNT(*) AS total FROM mensajes WHERE archivado = 0 GROUP BY tipo"
        )->fetchAll();

        // --- Proyectos ---
        $proyectosActivos   = (int)$this->db->query('SELECT COUNT(*) FROM proyectos WHERE activo = 1')->fetchColumn();
        $proyectosTotal     = (int)$this->db->query('SELECT COUNT(*) FROM proyectos')->fetchColumn();
        $proyectosDestacados= (int)$this->db->query('SELECT COUNT(*) FROM proyectos WHERE destacado = 1 AND activo = 1')->fetchColumn();

        // --- Usuarios ---
        $usuariosTotal  = (int)$this->db->query("SELECT COUNT(*) FROM users WHERE rol = 'usuario'")->fetchColumn();
        $usuariosActivos= (int)$this->db->query("SELECT COUNT(*) FROM users WHERE rol = 'usuario' AND estado = 'activo'")->fetchColumn();

        // --- Visitas (últimos 7 días) ---
        $visitasStmt = $this->db->prepare(
            'SELECT COUNT(*) FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        $visitasStmt->execute();
        $visitas7dias = (int)$visitasStmt->fetchColumn();

        // Visitas hoy
        $visitasHoy = (int)$this->db->query(
            "SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURDATE()"
        )->fetchColumn();

        // Visitas últimas 24h vs 24h anteriores (para calcular crecimiento)
        $v24h     = (int)$this->db->query("SELECT COUNT(*) FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();
        $v24hPrev = (int)$this->db->query("SELECT COUNT(*) FROM page_views WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 48 HOUR) AND DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();
        $crecimiento = $v24hPrev > 0
            ? round(($v24h - $v24hPrev) / $v24hPrev * 100, 1)
            : null;

        // --- Últimos 5 mensajes ---
        $ultimosMensajes = $this->db->query(
            'SELECT id, remitente, email, asunto, tipo, leido, created_at
             FROM mensajes WHERE archivado = 0 ORDER BY created_at DESC LIMIT 5'
        )->fetchAll();

        // --- Páginas top esta semana ---
        $topPaginas = $this->db->query(
            "SELECT ruta, COUNT(*) AS visitas
             FROM page_views
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY ruta ORDER BY visitas DESC LIMIT 5"
        )->fetchAll();

        jsonSuccess([
            'kpis' => [
                'mensajes_total'       => $msgTotal,
                'mensajes_no_leidos'   => $msgNoLeido,
                'proyectos_activos'    => $proyectosActivos,
                'proyectos_total'      => $proyectosTotal,
                'proyectos_destacados' => $proyectosDestacados,
                'usuarios_total'       => $usuariosTotal,
                'usuarios_activos'     => $usuariosActivos,
                'visitas_7_dias'       => $visitas7dias,
                'visitas_hoy'          => $visitasHoy,
                'crecimiento_24h_pct'  => $crecimiento,
            ],
            'mensajes_por_tipo'  => $msgPorTipo,
            'ultimos_mensajes'   => $ultimosMensajes,
            'top_paginas'        => $topPaginas,
        ]);
    }
}
