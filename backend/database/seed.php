<?php
/**
 * Sysmicon — Seed Script
 * Crea el usuario admin inicial en la base de datos.
 *
 * Uso: php database/seed.php
 */

declare(strict_types=1);

// Cargar autoloader y .env
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$dsn  = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
    $_ENV['DB_HOST'],
    $_ENV['DB_PORT'] ?? '3306',
    $_ENV['DB_NAME'],
    $_ENV['DB_CHARSET'] ?? 'utf8mb4'
);

try {
    $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    echo "❌ Error de conexión: " . $e->getMessage() . PHP_EOL;
    exit(1);
}

// ----- Usuario Admin -----
$adminEmail    = 'adminsysmi@sysmicon.com';
$adminPassword = 'Sysmicon-123';
$adminNombre   = 'Administrador Sysmicon';

// Verificar si ya existe
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$adminEmail]);

if ($stmt->fetch()) {
    echo "ℹ️  El usuario admin ya existe: {$adminEmail}" . PHP_EOL;
} else {
    $hash = password_hash($adminPassword, PASSWORD_BCRYPT, ['cost' => 12]);

    $insert = $pdo->prepare(
        'INSERT INTO users (nombre, email, password, rol, estado)
         VALUES (?, ?, ?, ?, ?)'
    );
    $insert->execute([$adminNombre, $adminEmail, $hash, 'admin', 'activo']);

    echo "✅ Usuario admin creado exitosamente." . PHP_EOL;
    echo "   Email    : {$adminEmail}" . PHP_EOL;
    echo "   Contraseña: {$adminPassword}" . PHP_EOL;
    echo "   Rol      : admin" . PHP_EOL;
}

echo PHP_EOL . "🚀 Seed completado." . PHP_EOL;
