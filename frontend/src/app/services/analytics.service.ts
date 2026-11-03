import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Identificador de sesión anónimo para esta visita del navegador
  private readonly sessionId = this.generateSessionId();

  /**
   * Llamar una vez en AppComponent para registrar automáticamente
   * cada cambio de ruta como una visita.
   */
  init(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.track(nav.urlAfterRedirects);
      });
  }

  private track(ruta: string): void {
    // No rastrear rutas del panel admin
    if (ruta.startsWith('/admin')) return;

    const payload = {
      ruta,
      referrer:   document.referrer || null,
      session_id: this.sessionId,
    };

    this.http.post(`${this.apiUrl}/analytics/view`, payload)
      .subscribe({ error: () => {} }); // fire-and-forget silencioso
  }

  private generateSessionId(): string {
    const existing = sessionStorage.getItem('sysmicon_sid');
    if (existing) return existing;

    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);

    sessionStorage.setItem('sysmicon_sid', id);
    return id;
  }
}
