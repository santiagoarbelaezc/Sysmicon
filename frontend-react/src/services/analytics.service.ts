import { httpClient } from '../core/apiClient';
import { environment } from '../core/env';

class AnalyticsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly sessionId = this.generateSessionId();

  track(ruta: string): void {
    if (ruta.startsWith('/admin')) return;

    const payload = {
      ruta,
      referrer: document.referrer || null,
      session_id: this.sessionId,
    };

    httpClient.post(`${this.apiUrl}/analytics/view`, payload)
      .subscribe({ error: () => {} });
  }

  private generateSessionId(): string {
    try {
      const existing = sessionStorage.getItem('sysmicon_sid');
      if (existing) return existing;

      const id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);

      sessionStorage.setItem('sysmicon_sid', id);
      return id;
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }
}

export const analyticsService = new AnalyticsService();
