<?php
/**
 * Sysmicon Backend — Conexión PDO a MySQL
 * Singleton para reutilizar la misma conexión en toda la petición.
 */

declare(strict_types=1);

namespace Sysmicon\Config;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    private function __construct() {}

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $_ENV['DB_HOST'],
                $_ENV['DB_PORT']    ?? '3306',
                $_ENV['DB_NAME'],
                $_ENV['DB_CHARSET'] ?? 'utf8mb4'
            );

            try {
                self::$instance = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_TIMEOUT            => 5,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                ]);
            } catch (PDOException $e) {
                http_response_code(503);
                $isDev = strtolower((string)($_ENV['APP_ENV'] ?? '')) === 'development';
                echo json_encode([
                    'error'   => 'Servicio temporalmente no disponible.',
                    'details' => $isDev ? $e->getMessage() : null
                ]);
                exit;
            }
        }

        return self::$instance;
    }
}
