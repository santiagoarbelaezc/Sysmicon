<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicAnalyticsController extends Controller
{
    use ApiResponse;

    public function registrarVisita(Request $request): JsonResponse
    {
        $request->validate([
            'pagina' => ['required', 'string', 'max:255'],
            'dispositivo' => ['nullable', 'string', 'max:20'],
            'referrer' => ['nullable', 'string', 'max:255'],
        ]);

        PageView::create([
            'pagina' => $request->input('pagina'),
            'dispositivo' => $request->input('dispositivo', 'desktop'),
            'referrer' => $request->input('referrer'),
            'ip_hash' => hash('sha256', (string) $request->ip()),
        ]);

        return $this->ok(null, 'Visita registrada.');
    }
}
