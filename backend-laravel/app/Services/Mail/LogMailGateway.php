<?php

namespace App\Services\Mail;

use App\Contracts\MailGateway;
use Illuminate\Support\Facades\Log;

/**
 * Driver provisional para desarrollo: registra los correos en storage/logs
 * hasta que el usuario entregue la API/credenciales de Hostinger.
 */
class LogMailGateway implements MailGateway
{
    public function enviarConfirmacionCuenta(string $destinatario, string $nombre, string $urlConfirmacion): bool
    {
        Log::channel('single')->info("[CORREO HOSTINGER - SIMULADO] Confirmar Cuenta para {$nombre} ({$destinatario}): {$urlConfirmacion}");

        return true;
    }

    public function enviarRecuperacionCuenta(string $destinatario, string $nombre, string $urlRecuperacion): bool
    {
        Log::channel('single')->info("[CORREO HOSTINGER - SIMULADO] Recuperar Cuenta para {$nombre} ({$destinatario}): {$urlRecuperacion}");

        return true;
    }

    public function enviarAcusePqr(string $destinatario, string $nombre, string $radicado, string $asunto): bool
    {
        Log::channel('single')->info("[CORREO HOSTINGER - SIMULADO] Acuse PQR {$radicado} para {$nombre} ({$destinatario}) - Asunto: {$asunto}");

        return true;
    }

    public function enviarRespuestaPqr(string $destinatario, string $nombre, string $radicado, string $respuesta): bool
    {
        Log::channel('single')->info("[CORREO HOSTINGER - SIMULADO] Respuesta PQR {$radicado} para {$nombre} ({$destinatario}): {$respuesta}");

        return true;
    }

    public function enviarAlertaNuevoMensaje(string $destinatarioStaff, string $nombreCliente, string $servicio, string $detalles): bool
    {
        Log::channel('single')->info("[CORREO HOSTINGER - SIMULADO] Nuevo Lead ({$servicio}) de {$nombreCliente}. Enviar a staff: {$destinatarioStaff}");

        return true;
    }
}
