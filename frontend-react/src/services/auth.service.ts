import { createSignal, useSignal } from '../core/signal';
import { httpClient } from '../core/apiClient';
import { environment } from '../core/env';
import { loadingService } from './loading.service';

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

class AuthService {
  private readonly ACCESS_TOKEN_KEY  = 'sysmicon_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sysmicon_refresh_token';
  private readonly USER_KEY          = 'sysmicon_user';
  private readonly apiUrl            = environment.apiUrl;

  readonly currentUser = createSignal<Usuario | null>(this.loadUserFromStorage());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('sysmicon-auth-logout', () => {
        this.clearSession();
      });
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.rol === 'admin';
  }

  login(email: string, password: string): Promise<boolean> {
    loadingService.show('Verificando credenciales...');

    return new Promise((resolve) => {
      httpClient.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
        .subscribe({
          next: (res) => {
            loadingService.hide();
            if (res && res.success && res.data) {
              this.saveSession(res.data.user, res.data.access_token, res.data.refresh_token);
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: () => {
            loadingService.hide();
            resolve(false);
          }
        });
    });
  }

  register(
    nombre: string,
    email: string,
    telefono: string,
    rol: 'propietario' | 'arquitecto' | 'inversionista' | 'usuario' = 'usuario',
    password?: string
  ): Promise<boolean> {
    loadingService.show('Procesando solicitud de registro...');

    return new Promise((resolve) => {
      httpClient.post<LoginResponse>(`${this.apiUrl}/auth/register`, {
        nombre,
        email,
        telefono,
        rol,
        password: password || 'Sysmicon-123'
      }).subscribe({
        next: (res) => {
          loadingService.hide();
          if (res && res.success && res.data) {
            this.saveSession(res.data.user, res.data.access_token, res.data.refresh_token);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: () => {
          loadingService.hide();
          resolve(false);
        }
      });
    });
  }

  logout(navigateFn?: (path: string) => void): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      httpClient.post(`${this.apiUrl}/auth/logout`, { refresh_token: refreshToken })
        .subscribe({ error: () => {} });
    }

    this.clearSession();
    if (navigateFn) {
      navigateFn('/login');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.resolve();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

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

export const authService = new AuthService();

export function useAuthService() {
  const currentUser = useSignal(authService.currentUser);
  return {
    currentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.rol === 'admin',
    login: (email: string, pass: string) => authService.login(email, pass),
    register: (
      nombre: string,
      email: string,
      telefono: string,
      rol?: 'propietario' | 'arquitecto' | 'inversionista' | 'usuario',
      password?: string
    ) => authService.register(nombre, email, telefono, rol, password),
    logout: (nav?: (p: string) => void) => authService.logout(nav),
    getAccessToken: () => authService.getAccessToken(),
    getRefreshToken: () => authService.getRefreshToken(),
  };
}
