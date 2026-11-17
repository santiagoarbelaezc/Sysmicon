<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuditoriaService;
use App\Services\Auth\TokenService;
use App\Services\Auth\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TwoFactorController extends Controller
{
    public function __construct(
        private readonly TwoFactorService $twoFactor,
        private readonly TokenService $tokens,
        private readonly AuditoriaService $auditoria,
    ) {
    }

    /** Paso 1: genera el secreto (exige contraseña actual). */
    public function setup(Request $request): JsonResponse
    {
        $request->validate(['password' => ['required', 'string']]);
        $usuario = $request->user();

        if (! Hash::check($request->input('password'), $usuario->password)) {
            return response()->json(['success' => false, 'message' => 'Contraseña incorrecta.'], 422);
        }

        if ($this->twoFactor->activo($usuario)) {
            return response()->json(['success' => false, 'message' => '2FA ya está activo.'], 409);
        }

        $secreto = $this->twoFactor->generarSecreto();
        $usuario->forceFill(['two_factor_secret' => $secreto, 'two_factor_confirmed_at' => null])->save();

        return response()->json(['success' => true, 'data' => [
            'secret' => $secreto,
            'otpauth_uri' => $this->twoFactor->uriOtpAuth($usuario, $secreto),
        ]]);
    }

    /** Paso 2: confirma con un código TOTP; entrega códigos de recuperación (una sola vez) y un access token con 2FA. */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate(['otp' => ['required', 'string', 'digits:6']]);
        $usuario = $request->user();

        if (! $usuario->two_factor_secret || $usuario->two_factor_confirmed_at) {
            return response()->json(['success' => false, 'message' => 'No hay una configuración 2FA pendiente.'], 409);
        }

        if (! $this->twoFactor->verificar($usuario->two_factor_secret, $request->input('otp'))) {
            return response()->json(['success' => false, 'message' => 'Código inválido.'], 422);
        }

        [$planos, $hashes] = $this->twoFactor->generarCodigosRecuperacion();
        $usuario->forceFill(['two_factor_confirmed_at' => now(), 'two_factor_recovery_codes' => $hashes])->save();
        $this->auditoria->registrar($request, '2fa_activado', 'staff', $usuario->id);

        $sesion = $request->attributes->get('sesion');
        $access = $this->tokens->emitir('staff', $usuario->id, $sesion->id, ['rol' => $usuario->rol->value, 'tfa' => true]);

        return response()->json(['success' => true, 'data' => [
            'recovery_codes' => $planos,
            'access_token' => $access,
            'expires_in' => (int) config('sysmicon.auth.access_ttl'),
        ]]);
    }
}
