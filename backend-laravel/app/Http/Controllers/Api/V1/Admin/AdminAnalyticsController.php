<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    use ApiResponse;

    public function resumen(): JsonResponse
    {
        $totalVisitas = PageView::count();
        $visitasUnicas = PageView::distinct('ip_hash')->count('ip_hash');
        $visitasHoy = PageView::whereDate('created_at', today())->count();
        $visitasMes = PageView::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();

        return $this->ok([
            'total_visitas' => $totalVisitas,
            'visitas_unicas' => $visitasUnicas,
            'visitas_hoy' => $visitasHoy,
            'visitas_mes' => $visitasMes,
        ]);
    }

    public function visitasPorDia(): JsonResponse
    {
        $visitas = PageView::select(DB::raw('DATE(created_at) as fecha'), DB::raw('COUNT(*) as total'))
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        return $this->ok($visitas);
    }

    public function paginasMasVisitadas(): JsonResponse
    {
        $paginas = PageView::select('pagina', DB::raw('COUNT(*) as total'))
            ->groupBy('pagina')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return $this->ok($paginas);
    }

    public function dispositivos(): JsonResponse
    {
        $dispositivos = PageView::select('dispositivo', DB::raw('COUNT(*) as total'))
            ->groupBy('dispositivo')
            ->orderByDesc('total')
            ->get();

        return $this->ok($dispositivos);
    }
}
