<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminConfigController extends Controller
{
    use ApiResponse;

    public function updateConfig(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'config' => ['required', 'array'],
        ]);

        foreach ($datos['config'] as $clave => $valor) {
            SiteConfig::updateOrCreate(
                ['clave' => $clave],
                ['valor' => $valor]
            );
        }

        return $this->ok(null, 'Configuración actualizada con éxito.');
    }
}
