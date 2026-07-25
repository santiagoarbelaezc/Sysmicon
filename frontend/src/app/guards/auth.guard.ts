import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard: Protege la ruta /admin.
 * Bloquea estrictamente el acceso al Dashboard y redirige a /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirigir a /login indicando que la ruta privada /admin está bloqueada
  return router.createUrlTree(['/login'], { queryParams: { blocked: 'true' } });
};
