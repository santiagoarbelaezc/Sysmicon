<?php

namespace App\Services\Auth;

use App\Models\Sesion;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SesionService
{
    /** Crea una sesión nueva (login). Devuelve [Sesion, refreshTokenPlano]. */
    public function crear(Request $request, string $guard, int $sujetoId): array
    {
        return $this->emitir($request, $guard, $sujetoId, (string) Str::uuid(), now()->addSeconds((int) config('sysmicon.auth.session_ttl')));
    }

    /** Rota el refresh token conservando familia y expiración ABSOLUTA. */
    public function rotar(Request $request, Sesion $anterior): array
    {
        [$nueva, $plano] = $this->emitir($request, $anterior->guard, $anterior->sujeto_id, $anterior->familia_id, $anterior->expira_at);

        $anterior->forceFill(['revocada_at' => now(), 'reemplazada_por' => $nueva->id])->save();

        return [$nueva, $plano];
    }

    public function buscarPorRefresh(string $plano): ?Sesion
    {
        return Sesion::where('refresh_hash', hash('sha256', $plano))->first();
    }

    public function revocar(Sesion $sesion): void
    {
        if ($sesion->revocada_at === null) {
            $sesion->forceFill(['revocada_at' => now()])->save();
        }
    }

    public function revocarFamilia(string $familiaId): void
    {
        Sesion::where('familia_id', $familiaId)->whereNull('revocada_at')->update(['revocada_at' => now()]);
    }

    public function revocarTodas(string $guard, int $sujetoId): void
    {
        Sesion::where('guard', $guard)->where('sujeto_id', $sujetoId)->whereNull('revocada_at')->update(['revocada_at' => now()]);
    }

    public function inactiva(Sesion $sesion): bool
    {
        return $sesion->ultimo_uso_at !== null
            && $sesion->ultimo_uso_at->addSeconds((int) config('sysmicon.auth.idle_ttl'))->isPast();
    }

    private function emitir(Request $request, string $guard, int $sujetoId, string $familia, CarbonInterface $expira): array
    {
        $plano = bin2hex(random_bytes(32));

        $sesion = Sesion::create([
            'guard' => $guard,
            'sujeto_id' => $sujetoId,
            'refresh_hash' => hash('sha256', $plano),
            'familia_id' => $familia,
            'ip' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
            'ultimo_uso_at' => now(),
            'expira_at' => $expira,
        ]);

        return [$sesion, $plano];
    }
}
