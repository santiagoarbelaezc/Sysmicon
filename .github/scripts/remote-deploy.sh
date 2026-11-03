#!/usr/bin/env bash
set -e

BACKEND_PATH="$1"
BASE_PATH="$2"
DB_NAME="$3"
DB_USER="$4"
DB_PASSWORD="$5"

echo "=== Configurando entorno remoto Sysmicon ==="
echo "Backend Path: $BACKEND_PATH"
echo "Base Path:    $BASE_PATH"

# 1. Configurar archivo .env en la carpeta privada si no existe
if [ ! -f "$BACKEND_PATH/.env" ]; then
  if [ -f "$BASE_PATH/backend_php/.env" ]; then
    cp "$BASE_PATH/backend_php/.env" "$BACKEND_PATH/.env"
    echo "[INFO] Copiado .env desde $BASE_PATH/backend_php/.env"
  elif [ -f "$BASE_PATH/public_html/backend_php/.env" ]; then
    cp "$BASE_PATH/public_html/backend_php/.env" "$BACKEND_PATH/.env"
    echo "[INFO] Copiado .env desde public_html/backend_php/.env"
  else
    cp "$BACKEND_PATH/.env.example" "$BACKEND_PATH/.env"
    echo "[INFO] Creado nuevo .env a partir de .env.example"
  fi
fi

# Asegurar host MySQL localhost para evitar error 504 en Hostinger
sed -i "s/^DB_HOST=.*/DB_HOST=localhost/" "$BACKEND_PATH/.env" 2>/dev/null || true

# Si existen secretos de BD en GitHub Actions, inyectarlos en el .env protegido
if [ -n "$DB_NAME" ]; then
  sed -i "s/^DB_NAME=.*/DB_NAME=$DB_NAME/" "$BACKEND_PATH/.env" 2>/dev/null || true
fi
if [ -n "$DB_USER" ]; then
  sed -i "s/^DB_USER=.*/DB_USER=$DB_USER/" "$BACKEND_PATH/.env" 2>/dev/null || true
fi
if [ -n "$DB_PASSWORD" ]; then
  sed -i "s/^DB_PASS=.*/DB_PASS=\"$DB_PASSWORD\"/" "$BACKEND_PATH/.env" 2>/dev/null || true
fi

chmod 600 "$BACKEND_PATH/.env" 2>/dev/null || true

# 2. Generar el API Bridge en public_html/api y public_html/backend_php
for BRIDGE_DIR in "$BASE_PATH/public_html/api" "$BASE_PATH/public_html/backend_php"; do
  mkdir -p "$BRIDGE_DIR"

  # Limpiar archivos viejos de backend completo si existían en esa carpeta pública
  rm -rf "$BRIDGE_DIR/vendor" "$BRIDGE_DIR/controllers" "$BRIDGE_DIR/config" \
         "$BRIDGE_DIR/middleware" "$BRIDGE_DIR/models" "$BRIDGE_DIR/helpers" \
         "$BRIDGE_DIR/database" "$BRIDGE_DIR/.env" 2>/dev/null || true

  # Generar index.php puente
  cat << 'EOF_BRIDGE_INDEX' > "$BRIDGE_DIR/index.php"
<?php
declare(strict_types=1);

/**
 * Sysmicon API Bridge
 * Puente público que delega la ejecución al backend protegido fuera de public_html.
 */
EOF_BRIDGE_INDEX

  echo "\$backendRoot = '$BACKEND_PATH';" >> "$BRIDGE_DIR/index.php"

  cat << 'EOF_BRIDGE_BODY' >> "$BRIDGE_DIR/index.php"

if (!file_exists($backendRoot . "/index.php")) {
    http_response_code(500);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["success" => false, "error" => "API Bridge: Backend principal no encontrado en carpeta protegida."]);
    exit;
}

require_once $backendRoot . "/index.php";
EOF_BRIDGE_BODY

  # Generar .htaccess puente
  PREFIX=$(basename "$BRIDGE_DIR")
  cat << EOF_BRIDGE_HTACCESS > "$BRIDGE_DIR/.htaccess"
Options -Indexes
RewriteEngine On
RewriteBase /$PREFIX/

# CORS preflight
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ index.php [QSA,L]

# Excepción para /config
RewriteRule ^config(/.*)?$ index.php [QSA,L]

# Enrutar todo al router index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php [QSA,L]
EOF_BRIDGE_HTACCESS

  chmod 755 "$BRIDGE_DIR"
  chmod 644 "$BRIDGE_DIR/index.php" "$BRIDGE_DIR/.htaccess"
  echo "[OK] API Bridge configurado en $BRIDGE_DIR"
done

# 3. Directorio de uploads protegido
mkdir -p "$BACKEND_PATH/uploads"
chmod 775 "$BACKEND_PATH/uploads" 2>/dev/null || true

# 4. Permisos de directorios y archivos backend
find "$BACKEND_PATH" -type d -exec chmod 755 {} + 2>/dev/null || true
find "$BACKEND_PATH" -type f -exec chmod 644 {} + 2>/dev/null || true
chmod 600 "$BACKEND_PATH/.env" 2>/dev/null || true

# 5. Ejecutar migraciones automáticas por CLI desde el backend protegido
echo "Ejecutando migraciones de base de datos..."
php "$BACKEND_PATH/database/migrate.php" || echo "[WARN] Migración CLI pendiente de revisión."

echo "[OK] Despliegue de Backend y API Bridge finalizado exitosamente."

