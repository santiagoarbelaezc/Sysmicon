<?php
/**
 * Sysmicon Backend — ContactoController
 * Recibe formularios públicos del sitio (sin autenticación).
 *
 * POST /contacto   → formulario genérico de contacto
 * POST /cotizacion → solicitud de cotización
 * POST /cita       → solicitud para agendar cita
 */

declare(strict_types=1);

use Sysmicon\Config\Database;

class ContactoController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    // ----------------------------------------------------------------
    // POST /contacto — formulario de contacto general
    // ----------------------------------------------------------------
    public function contacto(): void
    {
        $body = getJsonBody();

        $v = Validator::make($body, [
            'nombre'   => 'required|max:120',
            'email'    => 'required|email',
            'mensaje'  => 'required|min:10|max:5000',
        ]);

        if ($v->fails()) {
            jsonError('Por favor revisa los campos del formulario.', 422, $v->errors());
        }

        $stmt = $this->db->prepare(
            'INSERT INTO mensajes (remitente, email, telefono, asunto, contenido, tipo, tipo_servicio, ubicacion_proyecto)
             VALUES (?,?,?,?,?,?,?,?)'
        );

        $stmt->execute([
            Validator::sanitizeString($body['nombre']    ?? ''),
            Validator::sanitizeString($body['email']     ?? ''),
            Validator::sanitizeString($body['telefono']  ?? ''),
            Validator::sanitizeString($body['asunto']    ?? 'Contacto general'),
            Validator::sanitizeString($body['mensaje']   ?? ''),
            'contacto_general',
            Validator::sanitizeString($body['tipoServicio'] ?? ''),
            Validator::sanitizeString($body['ubicacionProyecto'] ?? ''),
        ]);

        jsonSuccess(null, 'Mensaje recibido. Te contactaremos pronto.', 201);
    }

    // ----------------------------------------------------------------
    // POST /cotizacion — solicitud de cotización
    // ----------------------------------------------------------------
    public function cotizacion(): void
    {
        $body = getJsonBody();

        $v = Validator::make($body, [
            'nombre'  => 'required|max:120',
            'email'   => 'required|email',
            'mensaje' => 'required|min:5',
        ]);

        if ($v->fails()) {
            jsonError('Por favor revisa los campos.', 422, $v->errors());
        }

        $stmt = $this->db->prepare(
            'INSERT INTO mensajes (remitente, email, telefono, asunto, contenido, tipo,
                                   presupuesto, tipo_servicio, ubicacion_proyecto)
             VALUES (?,?,?,?,?,?,?,?,?)'
        );

        $stmt->execute([
            Validator::sanitizeString($body['nombre']    ?? ''),
            Validator::sanitizeString($body['email']     ?? ''),
            Validator::sanitizeString($body['telefono']  ?? ''),
            'Solicitud de Cotización',
            Validator::sanitizeString($body['mensaje']   ?? ''),
            'cotizacion',
            Validator::sanitizeString($body['presupuesto']       ?? ''),
            Validator::sanitizeString($body['tipoServicio']      ?? ''),
            Validator::sanitizeString($body['ubicacionProyecto'] ?? ''),
        ]);

        jsonSuccess(null, 'Solicitud de cotización recibida. Te contactaremos en menos de 24 horas.', 201);
    }

    // ----------------------------------------------------------------
    // POST /cita — solicitud para agendar cita
    // ----------------------------------------------------------------
    public function cita(): void
    {
        $body = getJsonBody();

        $v = Validator::make($body, [
            'nombre' => 'required|max:120',
            'email'  => 'required|email',
        ]);

        if ($v->fails()) {
            jsonError('Por favor revisa los campos.', 422, $v->errors());
        }

        $fechaCita = null;
        if (!empty($body['fechaCita'])) {
            $dt = \DateTime::createFromFormat('Y-m-d', $body['fechaCita']);
            $fechaCita = $dt ? $dt->format('Y-m-d') : null;
        }

        $stmt = $this->db->prepare(
            'INSERT INTO mensajes (remitente, email, telefono, asunto, contenido, tipo,
                                   fecha_cita_solicitada, hora_preferida)
             VALUES (?,?,?,?,?,?,?,?)'
        );

        $stmt->execute([
            Validator::sanitizeString($body['nombre']         ?? ''),
            Validator::sanitizeString($body['email']          ?? ''),
            Validator::sanitizeString($body['telefono']       ?? ''),
            'Solicitud de Cita',
            Validator::sanitizeString($body['mensaje']        ?? 'Solicitud de cita privada.'),
            'agendar_cita',
            $fechaCita,
            Validator::sanitizeString($body['horaPreferida']  ?? ''),
        ]);

        jsonSuccess(null, 'Cita solicitada exitosamente. Te confirmaremos la disponibilidad.', 201);
    }
}
