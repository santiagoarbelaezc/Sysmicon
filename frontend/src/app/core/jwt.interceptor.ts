import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Solo interceptar peticiones al backend de Sysmicon
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();

    const cloned = token ? this.addToken(req, token) : req;

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es 401 y hay refresh token, intentar renovar
        if (error.status === 401 && this.authService.getRefreshToken()) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private handle401(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      // Esperar a que el refresh termine
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshAccessToken().pipe(
      switchMap(newToken => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(newToken);
        return next.handle(this.addToken(req, newToken));
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => err);
      })
    );
  }
}
