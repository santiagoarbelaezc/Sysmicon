<?php
/**
 * Sysmicon Backend — ConfigController
 * Gestión de la configuración y textos dinámicos del portal (CMS).
 *
 * GET /config        → getConfig()   (público)
 * PUT /admin/config  → updateConfig() (admin)
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class ConfigController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // GET /config — público
    // ----------------------------------------------------------------
    public function getConfig(): void
    {
        $stmt = $this->db->query('SELECT config_key, config_value FROM site_config');
        $rows = $stmt->fetchAll();

        $config = [];
        foreach ($rows as $row) {
            $config[$row['config_key']] = $row['config_value'];
        }

        // Si la tabla está vacía, retornar valores por defecto
        if (empty($config)) {
            $config = $this->getDefaultConfig();
        }

        jsonSuccess($config);
    }

    // ----------------------------------------------------------------
    // PUT /admin/config — admin
    // ----------------------------------------------------------------
    public function updateConfig(): void
    {
        AdminMiddleware::handle();
        $body = getJsonBody();

        if (empty($body) || !is_array($body)) {
            jsonError('Datos de configuración no válidos.', 400);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO site_config (config_key, config_value)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE config_value = VALUES(config_value), updated_at = NOW()'
        );

        $this->db->beginTransaction();
        try {
            foreach ($body as $key => $value) {
                // Solo permitir claves alfanuméricas con guiones bajos
                if (preg_match('/^[a-z0-9_]{2,80}$/i', (string)$key)) {
                    $stmt->execute([(string)$key, (string)$value]);
                }
            }
            $this->db->commit();
        } catch (\Exception $e) {
            $this->db->rollBack();
            jsonError('Error al guardar la configuración: ' . $e->getMessage(), 500);
        }

        jsonSuccess(null, 'Configuración del sitio actualizada exitosamente.');
    }

    // ----------------------------------------------------------------
    // Configuración por defecto
    // ----------------------------------------------------------------
    private function getDefaultConfig(): array
    {
        return [
            // Hero Home
            'hero_tagline'          => 'DISEÑO Y CONSTRUCCIÓN EN ORIENTE ANTIOQUEÑO',
            'hero_title'            => 'Arquitectura Residencial de Alta Gama',
            'hero_subtitle'         => 'Versatilidad y excelencia en cada detalle residencial',
            'hero_badge'            => 'SYS_STUDIO 2026',
            'hero_btn_text'         => 'Explorar Dossier de Obras',
            // About / Director
            'about_quote'           => 'Cada trazo arquitectónico debe respetar la topografía y magnificar la luz natural.',
            'about_description'     => 'Más de una década materializando residencias campestres en Llanogrande, El Retiro y Rionegro con los más altos estándares de ingeniería.',
            'director_name'         => 'David Jaramillo',
            'director_role'         => 'Director de Arquitectura & Construcción',
            // Servicios
            'services_title'        => 'Excelencia Constructiva Integral',
            'services_subtitle'     => 'Desde el primer esquema conceptual hasta la entrega de llaves.',
            // Cotizador
            'cotiza_title'          => 'Diseña y Cotiza tu Próxima Residencia',
            'cotiza_subtitle'       => 'Simulación arquitectónica y estimación presupuestal inmediata.',
            'cotiza_intro_text'     => 'Cuéntanos sobre tu lote o visión arquitectónica y nuestro equipo directivo estructurará una propuesta a medida.',
            'cotiza_btn_text'       => 'Solicitar Presupuesto Formal',
            // Canales de Contacto
            'telefono_contacto'     => '+57 (300) 987-6543',
            'email_soporte'         => 'arquitectura@sysmicon.com',
            'instagram_handle'      => '@sysmicon',
            'direccion_oficina'     => 'Llanogrande, Rionegro - Antioquia',
            // Banner de Alerta
            'mostrar_banner_alerta' => '1',
            'texto_banner_alerta'   => '⚡ Nuevas residencias campestres añadidas a nuestra galería 2026. ¡Descúbrelas en la sección de proyectos!'
        ];
    }
}
