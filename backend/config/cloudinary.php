<?php
/**
 * Sysmicon Backend — Configuración Cloudinary
 * Inicializa el SDK oficial de Cloudinary desde variables de entorno.
 */

declare(strict_types=1);

use Cloudinary\Configuration\Configuration;

function initCloudinary(): void
{
    Configuration::instance([
        'cloud' => [
            'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
            'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
            'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
        ],
        'url' => [
            'secure' => true,
        ],
    ]);
}
