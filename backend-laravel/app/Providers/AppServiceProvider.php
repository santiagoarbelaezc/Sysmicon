<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Política de contraseñas: >= 12, mixta, números, símbolos y no filtrada (HIBP) en producción.
        Password::defaults(function () {
            $rule = Password::min(12)->mixedCase()->numbers()->symbols();

            return app()->isProduction() ? $rule->uncompromised() : $rule;
        });

        RateLimiter::for('login', function (Request $request) {
            $email = mb_strtolower((string) $request->input('email'));

            return [
                Limit::perMinute(20)->by('ip:'.$request->ip()),
                Limit::perMinute(10)->by('cred:'.$email.'|'.$request->ip()),
            ];
        });

        RateLimiter::for('refresh', fn (Request $request) => Limit::perMinute(30)->by('ip:'.$request->ip()));
    }
}
