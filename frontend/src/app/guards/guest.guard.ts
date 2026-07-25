import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * GuestGuard: Evita que usuarios ya autenticados vuelvan a la pantalla de login/registro.
 * Redirige directamente al Dashboard /admin si ya hay una sesión activa.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Redirigir a /admin si ya está logueado
  return router.createUrlTree(['/admin']);
};
