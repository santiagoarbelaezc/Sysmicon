<?php

namespace App\Services\Auth;

use App\Models\AuditoriaAcceso;
use Illuminate\Http\Request;

class AuditoriaService
{
    public function registrar(Request $request, string $evento, ?string $guard = null, ?int $sujetoId = null, ?string $email = null): void
    {
        AuditoriaAcceso::create([
            'guard' => $guard,
            'sujeto_id' => $sujetoId,
            'email' => $email ? mb_substr(mb_strtolower($email), 0, 255) : null,
            'evento' => $evento,
            'ip' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
        ]);
    }
}
