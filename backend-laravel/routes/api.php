<?php

use App\Http\Controllers\Api\V1\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\V1\Admin\AdminConfigController;
use App\Http\Controllers\Api\V1\Admin\AdminMensajeController;
use App\Http\Controllers\Api\V1\Admin\AdminPortafolioController;
use App\Http\Controllers\Api\V1\Admin\AdminPqrController;
use App\Http\Controllers\Api\V1\Admin\AdminUsuarioController;
use App\Http\Controllers\Api\V1\Admin\Crm\ActividadController;
use App\Http\Controllers\Api\V1\Admin\Crm\ClienteController;
use App\Http\Controllers\Api\V1\Admin\Crm\DashboardCrmController;
use App\Http\Controllers\Api\V1\Admin\Crm\HitoController;
use App\Http\Controllers\Api\V1\Admin\Crm\OportunidadController;
use App\Http\Controllers\Api\V1\Admin\Crm\PropuestaController;
use App\Http\Controllers\Api\V1\Admin\Crm\ProyectoController;
use App\Http\Controllers\Api\V1\Admin\Crm\TareaController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
use App\Http\Controllers\Api\V1\Cuenta\AuthClienteController;
use App\Http\Controllers\Api\V1\Cuenta\RegistroClienteController;
use App\Http\Controllers\Api\V1\Public\PublicAnalyticsController;
use App\Http\Controllers\Api\V1\Public\PublicConfigController;
use App\Http\Controllers\Api\V1\Public\PublicMensajeController;
use App\Http\Controllers\Api\V1\Public\PublicPortafolioController;
use App\Http\Controllers\Api\V1\Public\PublicPqrController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['success' => true, 'status' => 'ok']));

/*
|--------------------------------------------------------------------------
| Autenticación Staff (Equipo Interno)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:refresh');

    Route::middleware('jwt:staff')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);

        Route::post('/2fa/setup', [TwoFactorController::class, 'setup']);
        Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm']);
    });
});

/*
|--------------------------------------------------------------------------
| Portal y Registro de Clientes (Aislado de Staff)
|--------------------------------------------------------------------------
*/
Route::prefix('cuenta')->group(function () {
    Route::post('/registro', [RegistroClienteController::class, 'registro'])->middleware('throttle:10,1');
    Route::post('/login', [AuthClienteController::class, 'login'])->middleware('throttle:login');

    Route::middleware('jwt:cliente')->group(function () {
        Route::get('/me', [AuthClienteController::class, 'me']);
        Route::get('/novedades', [AuthClienteController::class, 'novedades']);
        Route::post('/logout', [AuthClienteController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Sitio Web)
|--------------------------------------------------------------------------
*/
// Portafolio (con alias legacy /proyectos)
Route::get('/portafolio', [PublicPortafolioController::class, 'index']);
Route::get('/portafolio/{id}', [PublicPortafolioController::class, 'show']);
Route::get('/proyectos', [PublicPortafolioController::class, 'index']);
Route::get('/proyectos/{id}', [PublicPortafolioController::class, 'show']);

// Mensajes y cotizaciones (formulario "Cotiza con nosotros")
Route::post('/mensajes', [PublicMensajeController::class, 'store'])->middleware('throttle:20,1');
Route::post('/contacto', [PublicMensajeController::class, 'store'])->middleware('throttle:20,1');
Route::post('/cotizacion', [PublicMensajeController::class, 'store'])->middleware('throttle:20,1');
Route::post('/cita', [PublicMensajeController::class, 'store'])->middleware('throttle:20,1');

// Radicación y consulta pública de PQR
Route::post('/pqr', [PublicPqrController::class, 'store'])->middleware('throttle:15,1');
Route::post('/pqr/consultar', [PublicPqrController::class, 'consultar'])->middleware('throttle:30,1');

// Analíticas y Configuración
Route::post('/analytics/view', [PublicAnalyticsController::class, 'registrarVisita'])->middleware('throttle:120,1');
Route::get('/config', [PublicConfigController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Rutas Administrativas y CRM (Staff / Panel Admin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['jwt:staff', '2fa'])->group(function () {
    // --- 1. Dashboard CRM & KPIs (Fase 5) ---
    Route::get('/dashboard/kpis', [DashboardCrmController::class, 'kpis']);
    Route::get('/dashboard/pipeline', [DashboardCrmController::class, 'pipelineKanban']);
    Route::get('/dashboard/tareas', [DashboardCrmController::class, 'tareasPendientes']);
    Route::get('/dashboard/proyectos', [DashboardCrmController::class, 'proyectosEnCurso']);
    Route::get('/dashboard/actividad', [DashboardCrmController::class, 'actividadReciente']);
    Route::get('/calendario', [DashboardCrmController::class, 'calendario']);

    // --- 2. Clientes CRM ---
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::post('/clientes', [ClienteController::class, 'store']);
    Route::get('/clientes/{id}', [ClienteController::class, 'show']);
    Route::put('/clientes/{id}', [ClienteController::class, 'update']);
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

    // --- 3. Pipeline & Oportunidades ---
    Route::get('/oportunidades', [OportunidadController::class, 'index']);
    Route::post('/oportunidades', [OportunidadController::class, 'store']);
    Route::get('/oportunidades/{id}', [OportunidadController::class, 'show']);
    Route::put('/oportunidades/{id}', [OportunidadController::class, 'update']);
    Route::delete('/oportunidades/{id}', [OportunidadController::class, 'destroy']);
    Route::patch('/oportunidades/{id}/etapa', [OportunidadController::class, 'cambiarEtapa']);

    // --- 4. Propuestas Comerciales ---
    Route::get('/propuestas', [PropuestaController::class, 'index']);
    Route::post('/propuestas', [PropuestaController::class, 'store']);
    Route::get('/propuestas/{id}', [PropuestaController::class, 'show']);
    Route::put('/propuestas/{id}', [PropuestaController::class, 'update']);

    // --- 5. Proyectos de Obra CRM ---
    Route::get('/crm/proyectos', [ProyectoController::class, 'index']);
    Route::post('/crm/proyectos', [ProyectoController::class, 'store']);
    Route::get('/crm/proyectos/{id}', [ProyectoController::class, 'show']);
    Route::put('/crm/proyectos/{id}', [ProyectoController::class, 'update']);
    Route::delete('/crm/proyectos/{id}', [ProyectoController::class, 'destroy']);

    // --- 6. Hitos de Proyectos ---
    Route::post('/hitos', [HitoController::class, 'store']);
    Route::patch('/hitos/{id}/completar', [HitoController::class, 'toggleCompletado']);
    Route::delete('/hitos/{id}', [HitoController::class, 'destroy']);

    // --- 7. Tareas de Seguimiento ---
    Route::get('/tareas', [TareaController::class, 'index']);
    Route::post('/tareas', [TareaController::class, 'store']);
    Route::patch('/tareas/{id}/completar', [TareaController::class, 'toggleCompletada']);
    Route::delete('/tareas/{id}', [TareaController::class, 'destroy']);

    // --- 8. Actividades & Bitácora ---
    Route::get('/actividades', [ActividadController::class, 'index']);
    Route::post('/actividades', [ActividadController::class, 'store']);

    // --- 9. Portafolio Web ---
    Route::get('/portafolio', [AdminPortafolioController::class, 'index']);
    Route::post('/portafolio', [AdminPortafolioController::class, 'store']);
    Route::put('/portafolio/{id}', [AdminPortafolioController::class, 'update']);
    Route::delete('/portafolio/{id}', [AdminPortafolioController::class, 'destroy']);
    Route::patch('/portafolio/{id}/toggle', [AdminPortafolioController::class, 'toggleActivo']);
    Route::post('/portafolio/{id}/imagenes', [AdminPortafolioController::class, 'addImagen']);
    Route::delete('/portafolio/{id}/imagenes/{imagenId}', [AdminPortafolioController::class, 'deleteImagen']);

    // Alias legacy para portafolio
    Route::get('/proyectos', [AdminPortafolioController::class, 'index']);
    Route::post('/proyectos', [AdminPortafolioController::class, 'store']);
    Route::put('/proyectos/{id}', [AdminPortafolioController::class, 'update']);
    Route::delete('/proyectos/{id}', [AdminPortafolioController::class, 'destroy']);
    Route::patch('/proyectos/{id}/toggle', [AdminPortafolioController::class, 'toggleActivo']);
    Route::post('/proyectos/{id}/imagenes', [AdminPortafolioController::class, 'addImagen']);
    Route::delete('/proyectos/{id}/imagenes/{imagenId}', [AdminPortafolioController::class, 'deleteImagen']);

    // --- 10. Gestión de Mensajes / Leads ---
    Route::get('/mensajes', [AdminMensajeController::class, 'index']);
    Route::get('/mensajes/{id}', [AdminMensajeController::class, 'show']);
    Route::patch('/mensajes/{id}/leer', [AdminMensajeController::class, 'marcarLeido']);
    Route::patch('/mensajes/{id}/archivar', [AdminMensajeController::class, 'archivar']);
    Route::delete('/mensajes/{id}', [AdminMensajeController::class, 'destroy']);
    Route::post('/mensajes/{id}/convertir-en-lead', [AdminMensajeController::class, 'convertirEnLead']);

    // --- 11. Gestión de PQRs ---
    Route::get('/pqr', [AdminPqrController::class, 'index']);
    Route::get('/pqr/{id}', [AdminPqrController::class, 'show']);
    Route::post('/pqr/{id}/responder', [AdminPqrController::class, 'responder']);
    Route::patch('/pqr/{id}/estado', [AdminPqrController::class, 'updateEstado']);

    // --- 12. Analíticas Web ---
    Route::get('/analytics/resumen', [AdminAnalyticsController::class, 'resumen']);
    Route::get('/analytics/visitas', [AdminAnalyticsController::class, 'visitasPorDia']);
    Route::get('/analytics/paginas', [AdminAnalyticsController::class, 'paginasMasVisitadas']);
    Route::get('/analytics/dispositivos', [AdminAnalyticsController::class, 'dispositivos']);

    // --- 13. Configuración del sitio ---
    Route::put('/config', [AdminConfigController::class, 'updateConfig']);

    // --- 14. Gestión de Usuarios (Exclusivo Administradores con Regla de Autoprotección) ---
    Route::middleware('rol:admin')->group(function () {
        Route::get('/usuarios', [AdminUsuarioController::class, 'index']);
        Route::get('/usuarios/{id}', [AdminUsuarioController::class, 'show']);
        Route::post('/usuarios', [AdminUsuarioController::class, 'store']);
        Route::patch('/usuarios/{id}/estado', [AdminUsuarioController::class, 'toggleEstado']);
        Route::delete('/usuarios/{id}', [AdminUsuarioController::class, 'destroy']);
    });
});
