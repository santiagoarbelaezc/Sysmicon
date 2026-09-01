import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SiteConfig {
  // Hero Home
  hero_tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_btn_text: string;

  // About / Director
  about_quote: string;
  about_description: string;
  director_name: string;
  director_role: string;

  // Servicios
  services_title: string;
  services_subtitle: string;

  // Cotizador
  cotiza_title: string;
  cotiza_subtitle: string;
  cotiza_intro_text: string;
  cotiza_btn_text: string;

  // Canales de Contacto
  telefono_contacto: string;
  email_soporte: string;
  instagram_handle: string;
  direccion_oficina: string;

  // Banner Alerta Global
  mostrar_banner_alerta: string;
  texto_banner_alerta: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Hero Home
  hero_tagline: 'DISEÑO Y CONSTRUCCIÓN EN ORIENTE ANTIOQUEÑO',
  hero_title: 'Arquitectura Residencial de Alta Gama',
  hero_subtitle: 'Versatilidad y excelencia en cada detalle residencial',
  hero_badge: 'SYS_STUDIO 2026',
  hero_btn_text: 'Explorar Dossier de Obras',

  // About / Director
  about_quote: 'Cada trazo arquitectónico debe respetar la topografía y magnificar la luz natural.',
  about_description: 'Más de una década materializando residencias campestres en Llanogrande, El Retiro y Rionegro con los más altos estándares de ingeniería.',
  director_name: 'David Jaramillo',
  director_role: 'Director de Arquitectura & Construcción',

  // Servicios
  services_title: 'Excelencia Constructiva Integral',
  services_subtitle: 'Desde el primer esquema conceptual hasta la entrega de llaves.',

  // Cotizador
  cotiza_title: 'Diseña y Cotiza tu Próxima Residencia',
  cotiza_subtitle: 'Simulación arquitectónica y estimación presupuestal inmediata.',
  cotiza_intro_text: 'Cuéntanos sobre tu lote o visión arquitectónica y nuestro equipo directivo estructurará una propuesta a medida.',
  cotiza_btn_text: 'Solicitar Presupuesto Formal',

  // Canales de Contacto
  telefono_contacto: '+57 (300) 987-6543',
  email_soporte: 'arquitectura@sysmicon.com',
  instagram_handle: '@sysmicon',
  direccion_oficina: 'Llanogrande, Rionegro - Antioquia',

  // Banner Alerta
  mostrar_banner_alerta: '1',
  texto_banner_alerta: '⚡ Nuevas residencias campestres añadidas a nuestra galería 2026. ¡Descúbrelas en la sección de proyectos!'
};

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly config = signal<SiteConfig>(this.loadInitialConfig());

  constructor() {
    this.fetchConfig();
  }

  fetchConfig(): void {
    this.http.get<{ success: boolean; data: Partial<SiteConfig> }>(`${this.apiUrl}/config`)
      .subscribe({
        next: (res) => {
          if (res && res.success && res.data) {
            const merged = { ...DEFAULT_SITE_CONFIG, ...res.data };
            this.config.set(merged);
            try {
              localStorage.setItem('sysmicon_site_config', JSON.stringify(merged));
            } catch {}
          }
        },
        error: () => {
          // Mantener configuración local o default si el API no está disponible
        }
      });
  }

  saveConfig(nuevaConfig: SiteConfig): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/config`, nuevaConfig).pipe(
      tap(() => {
        this.config.set(nuevaConfig);
        try {
          localStorage.setItem('sysmicon_site_config', JSON.stringify(nuevaConfig));
        } catch {}
      })
    );
  }

  private loadInitialConfig(): SiteConfig {
    try {
      const stored = localStorage.getItem('sysmicon_site_config');
      return stored ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(stored) } : DEFAULT_SITE_CONFIG;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  }
}
