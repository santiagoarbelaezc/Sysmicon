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
            'pagina' => ['nullable', 'string', 'max:255'],
            'ruta' => ['nullable', 'string', 'max:255'],
            'path' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:255'],
            'dispositivo' => ['nullable', 'string', 'max:20'],
            'referrer' => ['nullable', 'string', 'max:255'],
            'session_id' => ['nullable', 'string', 'max:120'],
        ]);

        $pagina = (string) (
            $request->input('pagina')
            ?? $request->input('ruta')
            ?? $request->input('path')
            ?? $request->input('url')
            ?? '/'
        );

        $dispositivo = $request->input('dispositivo');
        if (! $dispositivo) {
            $ua = (string) $request->userAgent();
            $dispositivo = 'desktop';
            if (preg_match('/Mobile|Android|iPhone|iPad/i', $ua)) {
                $dispositivo = preg_match('/iPad/i', $ua) ? 'tablet' : 'mobile';
            }
        }

        PageView::create([
            'pagina' => substr($pagina, 0, 255),
            'dispositivo' => substr($dispositivo, 0, 20),
            'referrer' => $request->input('referrer') ? substr((string) $request->input('referrer'), 0, 255) : null,
            'ip_hash' => hash('sha256', (string) $request->ip()),
        ]);

        return $this->ok(null, 'Visita registrada.');
    }
}
