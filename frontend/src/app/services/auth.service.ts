import { Injectable, signal, computed } from '@angular/core';

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
  
  readonly currentUser = signal<Usuario | null>(this.loadUserFromStorage());
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor() {}

  private loadUserFromStorage(): Usuario | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(email: string, pass: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // En demostración creamos la sesión del usuario
        const user: Usuario = {
          id: 'usr-' + Date.now(),
          nombre: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          rol: 'propietario',
          fechaRegistro: new Date()
        };
        this.currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        resolve(true);
      }, 800);
    });
  }

  register(nombre: string, email: string, telefono: string, rol: 'propietario' | 'arquitecto' | 'inversionista'): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: Usuario = {
          id: 'usr-' + Date.now(),
          nombre: nombre,
          email: email,
          telefono: telefono,
          rol: rol,
          fechaRegistro: new Date()
        };
        this.currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        resolve(true);
      }, 1000);
    });
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.USER_KEY);
  }
}
