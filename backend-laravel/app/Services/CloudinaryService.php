<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;
use Throwable;

class CloudinaryService
{
    private bool $configured = false;

    public function __construct()
    {
        $cloudName = config('services.cloudinary.cloud_name', env('CLOUDINARY_CLOUD_NAME'));
        $apiKey = config('services.cloudinary.api_key', env('CLOUDINARY_API_KEY'));
        $apiSecret = config('services.cloudinary.api_secret', env('CLOUDINARY_API_SECRET'));

        if ($cloudName && $apiKey && $apiSecret) {
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => $cloudName,
                    'api_key' => $apiKey,
                    'api_secret' => $apiSecret,
                ],
                'url' => ['secure' => true],
            ]);
            $this->configured = true;
        }
    }

    /**
     * @return array{url: string, public_id: string}
     */
    public function upload(UploadedFile $file, string $folder = 'sysmicon/portafolio'): array
    {
        if (! $this->configured) {
            // Fallback para entornos de prueba o locales sin credenciales de Cloudinary
            $path = $file->store($folder, 'public');

            return [
                'url' => '/storage/'.$path,
                'public_id' => 'local_'.basename($path),
            ];
        }

        $res = (new UploadApi())->upload($file->getRealPath(), [
            'folder' => $folder,
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ],
        ]);

        return [
            'url' => $res['secure_url'] ?? $res['url'],
            'public_id' => $res['public_id'],
        ];
    }

    public function delete(string $publicId): bool
    {
        if (! $this->configured || str_starts_with($publicId, 'local_')) {
            return true;
        }

        try {
            (new UploadApi())->destroy($publicId);

            return true;
        } catch (Throwable) {
            return false;
        }
    }
}
