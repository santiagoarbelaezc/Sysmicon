import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { LoadingService } from './loading.service';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number | string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'admin' | 'usuario' | 'propietario' | 'arquitecto' | 'inversionista';
  estado: string;
  avatar_url?: string;
  created_at?: string;
  fechaRegistro?: Date;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: Usuario;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

interface RefreshResponse {
  success: boolean;
  data: {
    access_token: string;
    expires_in: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY  = 'sysmicon_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sysmicon_refresh_token';
  private readonly USER_KEY          = 'sysmicon_user';

  private readonly http           = inject(HttpClient);
  private readonly router         = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly apiUrl         = environment.apiUrl;

  readonly currentUser  = signal<Usuario | null>(this.loadUserFromStorage());
  readonly isLoggedIn   = computed(() => !!this.currentUser());
  readonly isAdmin      = computed(() => this.currentUser()?.rol === 'admin');

  // ----------------------------------------------------------------
  // Login
  // ----------------------------------------------------------------
  login(email: string, password: string): Promise<boolean> {
    this.loadingService.show('Verificando credenciales...');

    return new Promise((resolve) => {
      this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
        .subscribe({
          next: (res) => {
            this.loadingService.hide();
            if (res && res.success && res.data) {
              this.saveSession(res.data.user, res.data.access_token, res.data.refresh_token);
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: () => {
            this.loadingService.hide();
            resolve(false);
          }
        });
    });
  }

  // ----------------------------------------------------------------
  // Registro
  // ----------------------------------------------------------------
  register(
    nombre: string,
    email: string,
    telefono: string,
    rol: 'propietario' | 'arquitecto' | 'inversionista' | 'usuario' = 'usuario',
    password?: string
  ): Promise<boolean> {
    this.loadingService.show('Procesando solicitud de registro...');

    return new Promise((resolve) => {
      this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, {
        nombre,
        email,
        telefono,
        rol,
        password: password || 'Sysmicon-123'
      }).subscribe({
        next: (res) => {
          this.loadingService.hide();
          if (res && res.success && res.data) {
            this.saveSession(res.data.user, res.data.access_token, res.data.refresh_token);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: () => {
          this.loadingService.hide();
          resolve(false);
        }
      });
    });
  }

  // ----------------------------------------------------------------
  // Logout
  // ----------------------------------------------------------------
  logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.apiUrl}/auth/logout`, { refresh_token: refreshToken })
        .subscribe({ error: () => {} }); // fire-and-forget
    }

    this.clearSession();
    this.router.navigate(['/login']);
    return Promise.resolve();
  }

  // ----------------------------------------------------------------
  // Refresh access token (usado por el interceptor)
  // ----------------------------------------------------------------
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<RefreshResponse>(`${this.apiUrl}/auth/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap(res => {
          if (res.success && res.data?.access_token) {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, res.data.access_token);
          }
        }),
        map(res => res.data.access_token),
        catchError(err => {
          this.clearSession();
          return throwError(() => err);
        })
      );
  }

  // ----------------------------------------------------------------
  // Helpers de token
  // ----------------------------------------------------------------
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------
  private saveSession(user: Usuario, accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY,  accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY,          JSON.stringify(user));
    this.currentUser.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  private loadUserFromStorage(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
