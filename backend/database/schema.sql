-- ============================================================
-- SYSMICON — Schema completo de base de datos
-- Base de datos: Sysmicon
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '-05:00';
SET foreign_key_checks = 0;

-- ============================================================
-- Tabla: users
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `nombre`     VARCHAR(120)     NOT NULL,
  `email`      VARCHAR(180)     NOT NULL,
  `telefono`   VARCHAR(30)      DEFAULT NULL,
  `password`   VARCHAR(255)     NOT NULL COMMENT 'bcrypt hash',
  `rol`        ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  `estado`     ENUM('activo','suspendido','pendiente') NOT NULL DEFAULT 'activo',
  `avatar_url` VARCHAR(500)     DEFAULT NULL,
  `created_at` TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  INDEX `idx_users_rol` (`rol`),
  INDEX `idx_users_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: proyectos
-- ============================================================
CREATE TABLE IF NOT EXISTS `proyectos` (
  `id`                    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `titulo`                VARCHAR(200)  NOT NULL,
  `subtitulo`             VARCHAR(300)  DEFAULT NULL,
  `categoria`             ENUM('Residencial','Remodelación','Arquitectura interior','Oficina') NOT NULL,
  `descripcion`           TEXT          DEFAULT NULL,
  `imagen_url`            VARCHAR(500)  DEFAULT NULL COMMENT 'URL Cloudinary imagen principal',
  `cloudinary_public_id`  VARCHAR(300)  DEFAULT NULL COMMENT 'ID Cloudinary para eliminar',
  `area_m2`               DECIMAL(10,2) DEFAULT NULL,
  `anio`                  SMALLINT      DEFAULT NULL,
  `ubicacion`             VARCHAR(200)  DEFAULT NULL,
  `destacado`             TINYINT(1)    NOT NULL DEFAULT 0,
  `activo`                TINYINT(1)    NOT NULL DEFAULT 1,
  `editorial_title`       VARCHAR(200)  DEFAULT NULL,
  `editorial_subtitle`    VARCHAR(300)  DEFAULT NULL,
  `editorial_slogan`      VARCHAR(300)  DEFAULT NULL,
  `editorial_badge`       VARCHAR(100)  DEFAULT NULL,
  `editorial_style`       ENUM('coral-title','white-bold','ribbon-tag','split-grid') DEFAULT NULL,
  `barcode`               VARCHAR(50)   DEFAULT NULL,
  `caracteristicas`       JSON          DEFAULT NULL COMMENT 'Array de strings',
  `created_by`            INT UNSIGNED  DEFAULT NULL,
  `created_at`            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_proyectos_categoria` (`categoria`),
  INDEX `idx_proyectos_activo`    (`activo`),
  INDEX `idx_proyectos_destacado` (`destacado`),
  CONSTRAINT `fk_proyectos_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: proyecto_imagenes
-- ============================================================
CREATE TABLE IF NOT EXISTS `proyecto_imagenes` (
  `id`                    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `proyecto_id`           INT UNSIGNED  NOT NULL,
  `url`                   VARCHAR(500)  NOT NULL,
  `cloudinary_public_id`  VARCHAR(300)  DEFAULT NULL,
  `orden`                 TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pi_proyecto` (`proyecto_id`),
  CONSTRAINT `fk_pi_proyecto` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: mensajes
-- ============================================================
CREATE TABLE IF NOT EXISTS `mensajes` (
  `id`                      INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `remitente`               VARCHAR(120)  NOT NULL,
  `email`                   VARCHAR(180)  NOT NULL,
  `telefono`                VARCHAR(30)   DEFAULT NULL,
  `asunto`                  VARCHAR(300)  DEFAULT NULL,
  `contenido`               TEXT          NOT NULL,
  `tipo`                    ENUM('cotizacion','contacto_general','agendar_cita') NOT NULL DEFAULT 'contacto_general',
  `presupuesto`             VARCHAR(100)  DEFAULT NULL,
  `tipo_servicio`           VARCHAR(120)  DEFAULT NULL,
  `ubicacion_proyecto`      VARCHAR(200)  DEFAULT NULL,
  `fecha_cita_solicitada`   DATE          DEFAULT NULL,
  `hora_preferida`          VARCHAR(20)   DEFAULT NULL,
  `leido`                   TINYINT(1)    NOT NULL DEFAULT 0,
  `archivado`               TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at`              TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mensajes_tipo`      (`tipo`),
  INDEX `idx_mensajes_leido`     (`leido`),
  INDEX `idx_mensajes_archivado` (`archivado`),
  INDEX `idx_mensajes_created`   (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: page_views
-- ============================================================
CREATE TABLE IF NOT EXISTS `page_views` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `ruta`        VARCHAR(300)  NOT NULL COMMENT 'Ruta Angular, e.g. /proyectos',
  `referrer`    VARCHAR(500)  DEFAULT NULL,
  `user_agent`  VARCHAR(500)  DEFAULT NULL,
  `ip_hash`     VARCHAR(64)   DEFAULT NULL COMMENT 'SHA-256 de IP (GDPR-friendly)',
  `pais`        VARCHAR(80)   DEFAULT NULL,
  `dispositivo` ENUM('desktop','mobile','tablet') DEFAULT 'desktop',
  `session_id`  VARCHAR(64)   DEFAULT NULL,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pv_ruta`       (`ruta`),
  INDEX `idx_pv_created_at` (`created_at`),
  INDEX `idx_pv_dispositivo`(`dispositivo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: refresh_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED  NOT NULL,
  `token`       VARCHAR(500)  NOT NULL,
  `expires_at`  DATETIME      NOT NULL,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rt_token` (`token`(255)),
  INDEX `idx_rt_user` (`user_id`),
  CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabla: site_config (CMS en Vivo)
-- ============================================================
CREATE TABLE IF NOT EXISTS `site_config` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `config_key`   VARCHAR(80) NOT NULL UNIQUE,
  `config_value` TEXT NOT NULL,
  `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_sc_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Datos iniciales: Usuario Administrador (email: adminsysmi@sysmicon.com / pass: Sysmicon-123)
-- ============================================================
INSERT INTO `users` (`id`, `nombre`, `email`, `telefono`, `password`, `rol`, `estado`) 
VALUES (1, 'Administrador Sysmicon', 'adminsysmi@sysmicon.com', '+573108459210', '$2y$12$izwd9hERiGNQfNgEwrXRRekIl3z3QEidToFbtPAPnDhExryaAOxZK', 'admin', 'activo')
ON DUPLICATE KEY UPDATE `email` = `email`;

-- ============================================================
-- Datos iniciales: Configuración por defecto del CMS
-- ============================================================
INSERT INTO `site_config` (`config_key`, `config_value`) VALUES
('hero_title_prefix', 'Diseñamos y'),
('hero_title_highlight', 'Construimos'),
('hero_btn_cotizar', 'Cotiza con nosotros'),
('hero_btn_obras', 'Ver Obras & Proyectos'),
('hero_scroll_text', 'DESLIZA PARA EXPLORAR'),
('director_name', 'JUAN MORENO'),
('director_role', 'INGENIERO CIVIL'),
('director_tagline', 'LIDERAZGO & RIGOR TÉCNICO'),
('director_title', 'Ingeniería de Excelencia sin Concesiones'),
('director_stat1_number', '7+'),
('director_stat1_label', 'AÑOS DE EXPERIENCIA'),
('director_stat2_number', '4+'),
('director_stat2_label', 'OBRAS EJECUTADAS'),
('casam_title', 'CASA'),
('casam_highlight', 'M'),
('casam_subtitle', 'Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría.'),
('casam_btn', 'VER PROYECTO'),
('mision_title', 'Nuestra Misión'),
('mision_desc', 'Desarrollar proyectos a través de los conocimientos multidisciplinares que buscan canalizar la información por medio de la interacción con el espacio, el ingenio de la ejecución y la interpretación de la forma.'),
('telefono_contacto', '+57 (310) 845-9210'),
('whatsapp_contacto', '573108459210'),
('email_soporte', 'redes.sysmicon@gmail.com'),
('direccion_oficina', 'Calle 10A # 36-44, Piso 5, Medellín, Colombia'),
('instagram_handle', '@sysmicon'),
('mostrar_banner_alerta', '0'),
('texto_banner_alerta', '⚡ Nuevas residencias campestres añadidas a nuestro portafolio 2026. ¡Explora las obras!')
ON DUPLICATE KEY UPDATE `config_key` = `config_key`;

SET foreign_key_checks = 1;
