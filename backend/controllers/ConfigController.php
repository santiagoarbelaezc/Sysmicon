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

        $dbConfig = [];
        foreach ($rows as $row) {
            $dbConfig[$row['config_key']] = $row['config_value'];
        }

        $defaults = $this->getDefaultConfig();
        $config = array_merge($defaults, $dbConfig);

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
            // 1. Hero Portada
            'hero_title_prefix'     => 'Diseñamos y',
            'hero_title_highlight'  => 'Construimos',
            'hero_btn_cotizar'      => 'Cotiza con nosotros',
            'hero_btn_obras'        => 'Ver Obras & Proyectos',
            'hero_scroll_text'      => 'DESLIZA PARA EXPLORAR',

            // 2. Director Showcase (Juan Moreno)
            'director_name'         => 'JUAN MORENO',
            'director_role'         => 'INGENIERO CIVIL',
            'director_tagline'      => 'LIDERAZGO & RIGOR TÉCNICO',
            'director_title'        => 'Ingeniería de Excelencia sin Concesiones',
            'director_stat1_number' => '7+',
            'director_stat1_label'  => 'AÑOS DE EXPERIENCIA',
            'director_stat2_number' => '4+',
            'director_stat2_label'  => 'OBRAS EJECUTADAS',

            // 3. Casa M (Banner Video)
            'casam_title'           => 'CASA',
            'casam_highlight'       => 'M',
            'casam_subtitle'        => 'Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría.',
            'casam_btn'             => 'VER PROYECTO',

            // 4. Misión
            'mision_title'          => 'Nuestra Misión',
            'mision_desc'           => 'Desarrollar proyectos a través de los conocimientos multidisciplinares que buscan canalizar la información por medio de la interacción con el espacio, el ingenio de la ejecución y la interpretación de la forma. Esto nos permite partir de lo esencial y generar ideas que proyecten espacios únicos con propósito y calidad de vida.',

            // 5. Pasos de Contacto (Home)
            'steps_title'           => '¿Tienes un terreno o un sueño en mente?',
            'steps_subtitle'        => 'Nuestros arquitectos e ingenieros están listos para asesorarte. Agenda una consulta de viabilidad técnica y presupuestal sin costo.',
            'step1_title'           => 'Habla con un Experto',
            'step1_desc'            => 'Te conectamos con un profesional que escucha y entiende tu visión.',
            'step2_title'           => 'Obtén Claridad',
            'step2_desc'            => 'Definimos lo que realmente necesitas, la viabilidad legal y el presupuesto estimado.',
            'step3_title'           => 'Avanza con Seguridad',
            'step3_desc'            => 'Encontramos lo que encaja con tus objetivos y lo hacemos realidad.',

            // 6. Cotizador
            'cotiza_title'          => 'HABLEMOS DE TU PRÓXIMO PROYECTO',
            'cotiza_subtitle'       => 'Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible para hacer realidad tu visión arquitectónica.',

            // 7. Canales de Contacto
            'telefono_contacto'     => '+57 (310) 845-9210',
            'whatsapp_contacto'     => '573108459210',
            'email_soporte'         => 'redes.sysmicon@gmail.com',
            'direccion_oficina'     => 'Calle 10A # 36-44, Piso 5, Medellín, Colombia',
            'instagram_handle'      => '@sysmicon',

            // 8. Banner de Alerta Global
            'mostrar_banner_alerta' => '0',
            'texto_banner_alerta'   => '⚡ Nuevas residencias campestres añadidas a nuestro portafolio 2026. ¡Explora las obras!'
        ];
    }
}
