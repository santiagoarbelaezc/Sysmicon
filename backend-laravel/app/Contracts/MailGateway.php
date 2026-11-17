<?php

namespace App\Contracts;

interface MailGateway
{
    public function enviarConfirmacionCuenta(string $destinatario, string $nombre, string $urlConfirmacion): bool;

    public function enviarRecuperacionCuenta(string $destinatario, string $nombre, string $urlRecuperacion): bool;

    public function enviarAcusePqr(string $destinatario, string $nombre, string $radicado, string $asunto): bool;

    public function enviarRespuestaPqr(string $destinatario, string $nombre, string $radicado, string $respuesta): bool;

    public function enviarAlertaNuevoMensaje(string $destinatarioStaff, string $nombreCliente, string $servicio, string $detalles): bool;
}
