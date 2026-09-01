<?php
/**
 * Sysmicon Backend — ProyectosController
 *
 * Rutas públicas:
 *   GET  /proyectos           → index()
 *   GET  /proyectos/:id       → show()
 *
 * Rutas admin:
 *   GET    /admin/proyectos              → indexAdmin()
 *   POST   /admin/proyectos             → store()
 *   PUT    /admin/proyectos/:id         → update()
 *   DELETE /admin/proyectos/:id         → destroy()
 *   PATCH  /admin/proyectos/:id/toggle  → toggleActivo()
 *   POST   /admin/proyectos/:id/imagenes → addImagen()
 *   DELETE /admin/proyectos/:id/imagenes/:imgId → deleteImagen()
 */

declare(strict_types=1);

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Api\Admin\AdminApi;
use Sysmicon\Config\Database;

class ProyectosController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
        initCloudinary();
    }

    // ----------------------------------------------------------------
    // GET /proyectos  — lista pública (solo activos)
    // ----------------------------------------------------------------
    public function index(): void
    {
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(50, max(1, (int)($_GET['per_page'] ?? 12)));
        $offset  = ($page - 1) * $perPage;
        $cat     = $_GET['categoria'] ?? '';

        $where  = 'WHERE activo = 1';
        $params = [];

        if (!empty($cat)) {
            $where   .= ' AND categoria = ?';
            $params[] = $cat;
        }

        $total = $this->db->prepare("SELECT COUNT(*) FROM proyectos {$where}");
        $total->execute($params);
        $totalCount = (int)$total->fetchColumn();

        $params[] = $perPage;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT id, titulo, subtitulo, categoria, descripcion, imagen_url,
                    area_m2, anio, ubicacion, destacado,
                    editorial_title, editorial_subtitle, editorial_slogan,
                    editorial_badge, editorial_style, barcode, caracteristicas
             FROM proyectos {$where}
             ORDER BY destacado DESC, created_at DESC
             LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        $proyectos = $stmt->fetchAll();

        foreach ($proyectos as &$p) {
            $p['caracteristicas']  = json_decode($p['caracteristicas'] ?? '[]', true);
            $p['imagenes_adicionales'] = $this->getImagenesAdicionales((int)$p['id']);
        }

        jsonPaginated($proyectos, $totalCount, $page, $perPage);
    }

    // ----------------------------------------------------------------
    // GET /proyectos/:id — detalle público
    // ----------------------------------------------------------------
    public function show(int $id): void
    {
        $stmt = $this->db->prepare(
            'SELECT id, titulo, subtitulo, categoria, descripcion, imagen_url,
                    area_m2, anio, ubicacion, destacado,
                    editorial_title, editorial_subtitle, editorial_slogan,
                    editorial_badge, editorial_style, barcode, caracteristicas, created_at
             FROM proyectos WHERE id = ? AND activo = 1 LIMIT 1'
        );
        $stmt->execute([$id]);
        $proyecto = $stmt->fetch();

        if (!$proyecto) {
            jsonError('Proyecto no encontrado.', 404);
        }

        $proyecto['caracteristicas']      = json_decode($proyecto['caracteristicas'] ?? '[]', true);
        $proyecto['imagenes_adicionales'] = $this->getImagenesAdicionales($id);

        jsonSuccess($proyecto);
    }

    // ----------------------------------------------------------------
    // GET /admin/proyectos — lista admin (todos, incluidos inactivos)
    // ----------------------------------------------------------------
    public function indexAdmin(): void
    {
        AdminMiddleware::handle();

        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset  = ($page - 1) * $perPage;

        $totalStmt = $this->db->query('SELECT COUNT(*) FROM proyectos');
        $total     = (int)$totalStmt->fetchColumn();

        $stmt = $this->db->prepare(
            'SELECT id, titulo, subtitulo, categoria, imagen_url, area_m2, anio,
                    ubicacion, destacado, activo, caracteristicas, created_at, updated_at
             FROM proyectos ORDER BY created_at DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        $proyectos = $stmt->fetchAll();

        foreach ($proyectos as &$p) {
            $p['caracteristicas'] = json_decode($p['caracteristicas'] ?? '[]', true);
        }

        jsonPaginated($proyectos, $total, $page, $perPage);
    }

    // ----------------------------------------------------------------
    // POST /admin/proyectos — crear proyecto (multipart/form-data)
    // ----------------------------------------------------------------
    public function store(): void
    {
        $payload = AdminMiddleware::handle();

        // Validar campos obligatorios (vienen en $_POST porque es multipart)
        $v = Validator::make($_POST, [
            'titulo'    => 'required|max:200',
            'categoria' => 'required|in:Residencial,Remodelación,Arquitectura interior,Oficina',
        ]);

        if ($v->fails()) {
            jsonError('Datos del proyecto inválidos.', 422, $v->errors());
        }

        $imagenUrl         = null;
        $cloudinaryPublicId = null;

        // Subir imagen principal si fue enviada
        if (!empty($_FILES['imagen']['tmp_name'])) {
            [$imagenUrl, $cloudinaryPublicId] = $this->uploadToCloudinary(
                $_FILES['imagen']['tmp_name'],
                'proyectos'
            );
        }

        $caracteristicas = json_decode($_POST['caracteristicas'] ?? '[]', true);
        if (!is_array($caracteristicas)) {
            $caracteristicas = [];
        }

        $stmt = $this->db->prepare(
            'INSERT INTO proyectos
             (titulo, subtitulo, categoria, descripcion, imagen_url, cloudinary_public_id,
              area_m2, anio, ubicacion, destacado, activo,
              editorial_title, editorial_subtitle, editorial_slogan,
              editorial_badge, editorial_style, barcode, caracteristicas, created_by)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );

        $stmt->execute([
            Validator::sanitizeString($_POST['titulo'] ?? ''),
            Validator::sanitizeString($_POST['subtitulo'] ?? ''),
            $_POST['categoria'],
            Validator::sanitizeString($_POST['descripcion'] ?? ''),
            $imagenUrl,
            $cloudinaryPublicId,
            is_numeric($_POST['area_m2'] ?? '') ? (float)$_POST['area_m2'] : null,
            is_numeric($_POST['anio'] ?? '')    ? (int)$_POST['anio']     : null,
            Validator::sanitizeString($_POST['ubicacion'] ?? ''),
            isset($_POST['destacado']) && $_POST['destacado'] === '1' ? 1 : 0,
            1, // activo por defecto
            Validator::sanitizeString($_POST['editorial_title']    ?? ''),
            Validator::sanitizeString($_POST['editorial_subtitle']  ?? ''),
            Validator::sanitizeString($_POST['editorial_slogan']    ?? ''),
            Validator::sanitizeString($_POST['editorial_badge']     ?? ''),
            in_array($_POST['editorial_style'] ?? '', ['coral-title','white-bold','ribbon-tag','split-grid'])
                ? $_POST['editorial_style'] : null,
            Validator::sanitizeString($_POST['barcode'] ?? ''),
            json_encode($caracteristicas, JSON_UNESCAPED_UNICODE),
            $payload->sub,
        ]);

        $id = (int)$this->db->lastInsertId();

        // Imágenes adicionales
        if (!empty($_FILES['imagenes_adicionales'])) {
            $this->handleMultipleImages($id, $_FILES['imagenes_adicionales']);
        }

        jsonSuccess(['id' => $id], 'Proyecto creado exitosamente.', 201);
    }

    // ----------------------------------------------------------------
    // PUT /admin/proyectos/:id — editar datos (JSON body, SIN imagen)
    // ----------------------------------------------------------------
    public function update(int $id): void
    {
        AdminMiddleware::handle();
        $body = getJsonBody();

        // Verificar que existe
        $this->findOrFail($id);

        $campos  = [];
        $valores = [];

        $permitidos = [
            'titulo','subtitulo','categoria','descripcion','area_m2','anio','ubicacion',
            'destacado','activo','editorial_title','editorial_subtitle','editorial_slogan',
            'editorial_badge','editorial_style','barcode',
        ];

        foreach ($permitidos as $campo) {
            if (array_key_exists($campo, $body)) {
                $campos[]  = "{$campo} = ?";
                $valores[] = is_string($body[$campo])
                    ? Validator::sanitizeString($body[$campo])
                    : $body[$campo];
            }
        }

        if (array_key_exists('caracteristicas', $body)) {
            $campos[]  = 'caracteristicas = ?';
            $valores[] = json_encode($body['caracteristicas'], JSON_UNESCAPED_UNICODE);
        }

        if (empty($campos)) {
            jsonError('No hay campos para actualizar.', 400);
        }

        $valores[] = $id;
        $sql       = 'UPDATE proyectos SET ' . implode(', ', $campos) . ', updated_at = NOW() WHERE id = ?';
        $this->db->prepare($sql)->execute($valores);

        jsonSuccess(null, 'Proyecto actualizado.');
    }

    // ----------------------------------------------------------------
    // DELETE /admin/proyectos/:id
    // ----------------------------------------------------------------
    public function destroy(int $id): void
    {
        AdminMiddleware::handle();
        $proyecto = $this->findOrFail($id);

        // Eliminar imagenes adicionales de Cloudinary
        $imgs = $this->db->prepare('SELECT cloudinary_public_id FROM proyecto_imagenes WHERE proyecto_id = ?');
        $imgs->execute([$id]);
        foreach ($imgs->fetchAll() as $img) {
            if ($img['cloudinary_public_id']) {
                $this->deleteFromCloudinary($img['cloudinary_public_id']);
            }
        }

        // Eliminar imagen principal de Cloudinary
        if ($proyecto['cloudinary_public_id']) {
            $this->deleteFromCloudinary($proyecto['cloudinary_public_id']);
        }

        $this->db->prepare('DELETE FROM proyectos WHERE id = ?')->execute([$id]);

        jsonSuccess(null, 'Proyecto eliminado.');
    }

    // ----------------------------------------------------------------
    // PATCH /admin/proyectos/:id/toggle
    // ----------------------------------------------------------------
    public function toggleActivo(int $id): void
    {
        AdminMiddleware::handle();
        $this->findOrFail($id);

        $this->db->prepare('UPDATE proyectos SET activo = NOT activo, updated_at = NOW() WHERE id = ?')
                 ->execute([$id]);

        jsonSuccess(null, 'Visibilidad del proyecto actualizada.');
    }

    // ----------------------------------------------------------------
    // POST /admin/proyectos/:id/imagenes — añadir imagen adicional
    // ----------------------------------------------------------------
    public function addImagen(int $id): void
    {
        AdminMiddleware::handle();
        $this->findOrFail($id);

        if (empty($_FILES['imagen']['tmp_name'])) {
            jsonError('No se recibió ninguna imagen.', 400);
        }

        [$url, $publicId] = $this->uploadToCloudinary($_FILES['imagen']['tmp_name'], 'proyectos');

        // Obtener el siguiente orden
        $ordenStmt = $this->db->prepare('SELECT COALESCE(MAX(orden), -1) + 1 FROM proyecto_imagenes WHERE proyecto_id = ?');
        $ordenStmt->execute([$id]);
        $orden = (int)$ordenStmt->fetchColumn();

        $stmt = $this->db->prepare(
            'INSERT INTO proyecto_imagenes (proyecto_id, url, cloudinary_public_id, orden) VALUES (?,?,?,?)'
        );
        $stmt->execute([$id, $url, $publicId, $orden]);

        jsonSuccess(['id' => $this->db->lastInsertId(), 'url' => $url], 'Imagen añadida.', 201);
    }

    // ----------------------------------------------------------------
    // DELETE /admin/proyectos/:id/imagenes/:imgId
    // ----------------------------------------------------------------
    public function deleteImagen(int $id, int $imgId): void
    {
        AdminMiddleware::handle();

        $stmt = $this->db->prepare(
            'SELECT id, cloudinary_public_id FROM proyecto_imagenes WHERE id = ? AND proyecto_id = ? LIMIT 1'
        );
        $stmt->execute([$imgId, $id]);
        $img = $stmt->fetch();

        if (!$img) {
            jsonError('Imagen no encontrada.', 404);
        }

        if ($img['cloudinary_public_id']) {
            $this->deleteFromCloudinary($img['cloudinary_public_id']);
        }

        $this->db->prepare('DELETE FROM proyecto_imagenes WHERE id = ?')->execute([$imgId]);

        jsonSuccess(null, 'Imagen eliminada.');
    }

    // ================================================================
    // Helpers privados
    // ================================================================

    private function findOrFail(int $id): array
    {
        $stmt = $this->db->prepare('SELECT * FROM proyectos WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $proyecto = $stmt->fetch();

        if (!$proyecto) {
            jsonError('Proyecto no encontrado.', 404);
        }

        return $proyecto;
    }

    private function getImagenesAdicionales(int $proyectoId): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, url, orden FROM proyecto_imagenes WHERE proyecto_id = ? ORDER BY orden ASC'
        );
        $stmt->execute([$proyectoId]);
        return $stmt->fetchAll();
    }

    /**
     * Sube un archivo a Cloudinary y retorna [url, public_id]
     */
    private function uploadToCloudinary(string $tmpPath, string $subfolder): array
    {
        $folder = trim($_ENV['CLOUDINARY_FOLDER'] ?? 'sysmicon/proyectos', '/');
        $folder = "{$folder}/{$subfolder}";

        $upload = new UploadApi();
        $result = $upload->upload($tmpPath, [
            'folder'         => $folder,
            'transformation' => [
                ['quality' => 'auto', 'fetch_format' => 'auto'],
                ['width' => 1920, 'height' => 1080, 'crop' => 'limit'],
            ],
        ]);

        return [(string)$result['secure_url'], (string)$result['public_id']];
    }

    private function deleteFromCloudinary(string $publicId): void
    {
        try {
            (new UploadApi())->destroy($publicId);
        } catch (\Exception) {
            // No bloquear la operación si Cloudinary falla
        }
    }

    private function handleMultipleImages(int $proyectoId, array $filesArray): void
    {
        // $_FILES['imagenes_adicionales'] viene como array de archivos
        $count = count($filesArray['tmp_name'] ?? []);
        for ($i = 0; $i < $count; $i++) {
            if (!empty($filesArray['tmp_name'][$i])) {
                [$url, $publicId] = $this->uploadToCloudinary($filesArray['tmp_name'][$i], 'proyectos');
                $stmt = $this->db->prepare(
                    'INSERT INTO proyecto_imagenes (proyecto_id, url, cloudinary_public_id, orden) VALUES (?,?,?,?)'
                );
                $stmt->execute([$proyectoId, $url, $publicId, $i]);
            }
        }
    }
}
