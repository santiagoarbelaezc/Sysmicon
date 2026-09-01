<?php
/**
 * ============================================================
 * Sysmicon Backend — Router Principal
 * Todas las peticiones pasan por aquí gracias al .htaccess
 * ============================================================
 */

declare(strict_types=1);

// ---- Autoloader y variables de entorno ----
require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// ---- Headers JSON y CORS ----
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/cors.php';
applyCorsHeaders();

// ---- Configuración de Cloudinary (global) ----
require_once __DIR__ . '/config/cloudinary.php';

// ---- Autoload manual de clases (sin PSR-4 completo para simplicidad) ----
spl_autoload_register(function (string $class): void {
    // Quitar namespace si lo hubiera
    $class = str_replace('Sysmicon\\Config\\', '', $class);
    $class = str_replace('Sysmicon\\', '', $class);

    $dirs = [
        __DIR__ . '/config/',
        __DIR__ . '/controllers/',
        __DIR__ . '/middleware/',
        __DIR__ . '/models/',
        __DIR__ . '/helpers/',
    ];

    foreach ($dirs as $dir) {
        $file = $dir . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/helpers/Validator.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/middleware/AdminMiddleware.php';

// ---- Parseo de la ruta ----
$requestUri    = $_SERVER['REQUEST_URI'] ?? '/';
$scriptName    = $_SERVER['SCRIPT_NAME'] ?? '';

// Quitar el base path si el backend no está en la raíz del dominio
$basePath = rtrim(dirname($scriptName), '/');
$path     = substr($requestUri, strlen($basePath));

// Quitar query string
if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

$path   = '/' . trim($path, '/');
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ---- Tabla de rutas ----
// Formato: [método, patrón regex, controlador, método, parámetros]
$routes = [

    // ── Autenticación ──────────────────────────────────────────────
    ['POST',   '#^/auth/login$#',            'AuthController',      'login',              []],
    ['POST',   '#^/auth/logout$#',           'AuthController',      'logout',             []],
    ['POST',   '#^/auth/refresh$#',          'AuthController',      'refresh',            []],
    ['GET',    '#^/auth/me$#',               'AuthController',      'me',                 []],

    // ── Proyectos — Públicos ───────────────────────────────────────
    ['GET',    '#^/proyectos$#',             'ProyectosController', 'index',              []],
    ['GET',    '#^/proyectos/(\d+)$#',       'ProyectosController', 'show',               [1]],

    // ── Proyectos — Admin ──────────────────────────────────────────
    ['GET',    '#^/admin/proyectos$#',                                'ProyectosController', 'indexAdmin',    []],
    ['POST',   '#^/admin/proyectos$#',                                'ProyectosController', 'store',         []],
    ['PUT',    '#^/admin/proyectos/(\d+)$#',                          'ProyectosController', 'update',        [1]],
    ['DELETE', '#^/admin/proyectos/(\d+)$#',                          'ProyectosController', 'destroy',       [1]],
    ['PATCH',  '#^/admin/proyectos/(\d+)/toggle$#',                   'ProyectosController', 'toggleActivo',  [1]],
    ['POST',   '#^/admin/proyectos/(\d+)/imagenes$#',                 'ProyectosController', 'addImagen',     [1]],
    ['DELETE', '#^/admin/proyectos/(\d+)/imagenes/(\d+)$#',           'ProyectosController', 'deleteImagen',  [1, 2]],

    // ── Formularios públicos ───────────────────────────────────────
    ['POST',   '#^/contacto$#',              'ContactoController',  'contacto',           []],
    ['POST',   '#^/cotizacion$#',            'ContactoController',  'cotizacion',         []],
    ['POST',   '#^/cita$#',                  'ContactoController',  'cita',               []],

    // ── Mensajes — Admin ───────────────────────────────────────────
    ['GET',    '#^/admin/mensajes$#',                     'MensajesController', 'index',       []],
    ['GET',    '#^/admin/mensajes/(\d+)$#',               'MensajesController', 'show',        [1]],
    ['PATCH',  '#^/admin/mensajes/(\d+)/leer$#',          'MensajesController', 'marcarLeido', [1]],
    ['PATCH',  '#^/admin/mensajes/(\d+)/archivar$#',      'MensajesController', 'archivar',    [1]],
    ['DELETE', '#^/admin/mensajes/(\d+)$#',               'MensajesController', 'destroy',     [1]],

    // ── Analytics ─────────────────────────────────────────────────
    ['POST',   '#^/analytics/view$#',                     'AnalyticsController', 'registrarVisita',    []],
    ['GET',    '#^/admin/analytics/resumen$#',            'AnalyticsController', 'resumen',            []],
    ['GET',    '#^/admin/analytics/visitas$#',            'AnalyticsController', 'visitasPorDia',      []],
    ['GET',    '#^/admin/analytics/paginas$#',            'AnalyticsController', 'paginasMasVisitadas',[]],
    ['GET',    '#^/admin/analytics/dispositivos$#',       'AnalyticsController', 'dispositivos',       []],

    // ── Dashboard ─────────────────────────────────────────────────
    ['GET',    '#^/admin/dashboard$#',       'DashboardController', 'index',              []],

    // ── Usuarios — Admin ───────────────────────────────────────────
    ['GET',    '#^/admin/usuarios$#',                     'UsuariosController', 'index',       []],
    ['GET',    '#^/admin/usuarios/(\d+)$#',               'UsuariosController', 'show',        [1]],
    ['PATCH',  '#^/admin/usuarios/(\d+)/estado$#',        'UsuariosController', 'toggleEstado',[1]],
    ['DELETE', '#^/admin/usuarios/(\d+)$#',               'UsuariosController', 'destroy',     [1]],

    // ── Personalizar Sitio / CMS ──────────────────────────────────
    ['GET',    '#^/config$#',                'ConfigController',    'getConfig',          []],
    ['PUT',    '#^/admin/config$#',          'ConfigController',    'updateConfig',       []],

    // ── Health check ──────────────────────────────────────────────
    ['GET',    '#^/health$#',               null, null, []],
];

// ---- Dispatch ----
foreach ($routes as [$routeMethod, $pattern, $controller, $action, $paramIndexes]) {
    if ($routeMethod !== $method && !($method === 'HEAD' && $routeMethod === 'GET')) {
        continue;
    }

    if (!preg_match($pattern, $path, $matches)) {
        continue;
    }

    // Health check especial
    if ($controller === null) {
        jsonSuccess(['status' => 'ok', 'service' => 'Sysmicon API', 'timestamp' => date('c')]);
    }

    // Extraer parámetros capturados
    $args = array_map(fn(int $i) => (int)$matches[$i], $paramIndexes);

    // Instanciar controlador y llamar al método
    require_once __DIR__ . "/controllers/{$controller}.php";
    $instance = new $controller();
    $instance->$action(...$args);
    exit;
}

// ---- 404 ----
jsonError("Ruta '{$method} {$path}' no encontrada.", 404);
