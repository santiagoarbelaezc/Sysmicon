import { Injectable, signal, computed, inject } from '@angular/core';
import { LoadingService } from './loading.service';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'propietario' | 'arquitecto' | 'inversionista';
  avatar?: string;
  fechaRegistro: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'sysmicon_user_session';
  private readonly loadingService = inject(LoadingService);
  
  readonly currentUser = signal<Usuario | null>(null);
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    // Asegurar que no quede ninguna sesión abierta en este momento
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.USER_KEY);
      }
    } catch {}
  }

  login(email: string, pass: string): Promise<boolean> {
    this.loadingService.show('Verificando credenciales...');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide();
        // El acceso al Dashboard permanece bloqueado hasta conectar los servicios backend
        this.currentUser.set(null);
        resolve(false);
      }, 1000);
    });
  }

  register(nombre: string, email: string, telefono: string, rol: 'propietario' | 'arquitecto' | 'inversionista'): Promise<boolean> {
    this.loadingService.show('Procesando solicitud de registro...');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide();
        // El acceso al Dashboard permanece bloqueado hasta conectar los servicios backend
        this.currentUser.set(null);
        resolve(false);
      }, 1000);
    });
  }

  logout(): Promise<void> {
    this.currentUser.set(null);
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch {}
    return Promise.resolve();
  }
}
