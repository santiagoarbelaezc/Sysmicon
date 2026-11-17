<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicConfigController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $configs = SiteConfig::all()->pluck('valor', 'clave')->all();

        return $this->ok($configs);
    }
}
