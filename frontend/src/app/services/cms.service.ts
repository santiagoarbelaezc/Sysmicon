import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SiteConfig {
  // 1. Hero Portada
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_btn_cotizar: string;
  hero_btn_obras: string;
  hero_scroll_text: string;
  hero_tagline?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_btn_text?: string;
  [key: string]: any;

  // 2. Director Showcase (Juan Moreno)
  director_name: string;
  director_role: string;
  director_tagline: string;
  director_title: string;
  director_stat1_number: string;
  director_stat1_label: string;
  director_stat2_number: string;
  director_stat2_label: string;

  // 3. Casa M (Banner Video)
  casam_title: string;
  casam_highlight: string;
  casam_subtitle: string;
  casam_btn: string;

  // 4. Misión
  mision_title: string;
  mision_desc: string;

  // 5. Pasos de Contacto (Home)
  steps_title: string;
  steps_subtitle: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;

  // 6. Cotizador
  cotiza_title: string;
  cotiza_subtitle: string;

  // 7. Canales de Contacto
  telefono_contacto: string;
  whatsapp_contacto: string;
  email_soporte: string;
  direccion_oficina: string;
  instagram_handle: string;

  // 8. Banner de Alerta Global
  mostrar_banner_alerta: string;
  texto_banner_alerta: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // 1. Hero Portada
  hero_title_prefix: 'Diseñamos y',
  hero_title_highlight: 'Construimos',
  hero_btn_cotizar: 'Cotiza con nosotros',
  hero_btn_obras: 'Ver Obras & Proyectos',
  hero_scroll_text: 'DESLIZA PARA EXPLORAR',
  hero_tagline: '',
  hero_title: 'Diseñamos y Construimos',
  hero_subtitle: 'Creamos espacios residenciales de lujo combinando ingeniería de precisión con diseño arquitectónico atemporal.',
  hero_btn_text: 'Cotiza con nosotros',

  // 2. Director Showcase (Juan Moreno)
  director_name: 'JUAN MORENO',
  director_role: 'INGENIERO CIVIL',
  director_tagline: 'LIDERAZGO & RIGOR TÉCNICO',
  director_title: 'Ingeniería de Excelencia sin Concesiones',
  director_stat1_number: '7+',
  director_stat1_label: 'AÑOS DE EXPERIENCIA',
  director_stat2_number: '4+',
  director_stat2_label: 'OBRAS EJECUTADAS',

  // 3. Casa M (Banner Video)
  casam_title: 'CASA',
  casam_highlight: 'M',
  casam_subtitle: 'Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría.',
  casam_btn: 'VER PROYECTO',

  // 4. Misión
  mision_title: 'Nuestra Misión',
  mision_desc: 'Desarrollar proyectos a través de los conocimientos multidisciplinares que buscan canalizar la información por medio de la interacción con el espacio, el ingenio de la ejecución y la interpretación de la forma. Esto nos permite partir de lo esencial y generar ideas que proyecten espacios únicos con propósito y calidad de vida.',

  // 5. Pasos de Contacto (Home)
  steps_title: '¿Tienes un terreno o un sueño en mente?',
  steps_subtitle: 'Nuestros arquitectos e ingenieros están listos para asesorarte. Agenda una consulta de viabilidad técnica y presupuestal sin costo.',
  step1_title: 'Habla con un Experto',
  step1_desc: 'Te conectamos con un profesional que escucha y entiende tu visión.',
  step2_title: 'Obtén Claridad',
  step2_desc: 'Definimos lo que realmente necesitas, la viabilidad legal y el presupuesto estimado.',
  step3_title: 'Avanza con Seguridad',
  step3_desc: 'Encontramos lo que encaja con tus objetivos y lo hacemos realidad.',

  // 6. Cotizador
  cotiza_title: 'HABLEMOS DE TU PRÓXIMO PROYECTO',
  cotiza_subtitle: 'Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible para hacer realidad tu visión arquitectónica.',

  // 7. Canales de Contacto
  telefono_contacto: '+57 (310) 845-9210',
  whatsapp_contacto: '573108459210',
  email_soporte: 'redes.sysmicon@gmail.com',
  direccion_oficina: 'Calle 10A # 36-44, Piso 5, Medellín, Colombia',
  instagram_handle: '@sysmicon',

  // 8. Banner de Alerta Global
  mostrar_banner_alerta: '0',
  texto_banner_alerta: '⚡ Nuevas residencias campestres añadidas a nuestro portafolio 2026. ¡Explora las obras!'
};

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly config = signal<SiteConfig>(this.loadInitialConfig());

  constructor() {
    this.fetchConfig().subscribe();
  }

  fetchConfig(): Observable<{ success: boolean; data: Partial<SiteConfig> }> {
    return this.http.get<{ success: boolean; data: Partial<SiteConfig> }>(`${this.apiUrl}/config`).pipe(
      tap((res) => {
        if (res && res.success && res.data) {
          const merged = { ...DEFAULT_SITE_CONFIG, ...res.data };
          this.config.set(merged);
          try {
            localStorage.setItem('sysmicon_site_config', JSON.stringify(merged));
          } catch {}
        }
      })
    );
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
