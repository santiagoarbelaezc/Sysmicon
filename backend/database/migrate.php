<?php
/**
 * Sysmicon — Script de Migración Automática
 * Ejecuta schema.sql para crear tablas e inicializar datos si la base de datos está vacía.
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

if (file_exists(dirname(__DIR__) . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
    $dotenv->load();
}

require_once dirname(__DIR__) . '/config/database.php';

try {
    echo "Conectando a la base de datos...\n";
    $db = Sysmicon\Config\Database::getInstance();

    // Comprobar si la tabla 'users' ya existe
    $stmt = $db->query("SHOW TABLES LIKE 'users'");
    $tables = $stmt->fetchAll();

    if (empty($tables)) {
        echo "Inicializando tablas y datos por defecto desde schema.sql...\n";
        $sqlPath = __DIR__ . '/schema.sql';
        if (!file_exists($sqlPath)) {
            throw new RuntimeException("No se encontró el archivo schema.sql en: $sqlPath");
        }

        $sql = file_get_contents($sqlPath);
        $db->exec($sql);
        echo "¡Tablas creadas y datos iniciales insertados con éxito!\n";
    } else {
        echo "Las tablas ya existen en la base de datos. Verificando configuración del CMS...\n";
        // Asegurar que site_config tenga los valores básicos
        $sqlPath = __DIR__ . '/schema.sql';
        if (file_exists($sqlPath)) {
            $sql = file_get_contents($sqlPath);
            $db->exec($sql);
            echo "Verificación de esquema completada.\n";
        }
    }
} catch (PDOException $e) {
    echo "[ERROR PDO]: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "[ERROR]: " . $e->getMessage() . "\n";
    exit(1);
}

