import { Component, AfterViewInit, OnInit, signal, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CONTACT_INFO, BRAND_CONFIG } from '../../core/app.constants';
import { CmsService } from '../../services/cms.service';
import { environment } from '../../../environments/environment';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';
import AOS from 'aos';

export interface EtapaCotizacion {
  etapa: string;
  tag: string;
  titulo: string;
  desc: string;
  code: string;
}

@Component({
  selector: 'app-cotiza-con-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DirectorShowcaseComponent],
  templateUrl: './cotiza-con-nosotros.component.html',
  styleUrl: './cotiza-con-nosotros.component.css'
})
export class CotizaConNosotrosComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  readonly cms = inject(CmsService);
  readonly contact = CONTACT_INFO;
  readonly brand = BRAND_CONFIG;

  @ViewChild('casaLVideoRef') casaLVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('sectionVideoRef') sectionVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('videoA') videoA?: ElementRef<HTMLVideoElement>;
  @ViewChild('videoB') videoB?: ElementRef<HTMLVideoElement>;

  readonly isMobile = signal<boolean>(false);

  // Video exclusivo para fondo de la sección de formulario
  readonly sectionVideo = 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4';

  // Playlist adaptable para Desktop y Móvil (Hero de alta definición)
  readonly videoPlaylistDesktop = [
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017834/sysmi-0_n3fxgd.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017765/sysmi-4_has6qd.mp4'
  ];

  readonly videoPlaylistMobile = [
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017824/sysmi-movil-0_kk2hr0.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4',
    'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017765/sysmi-4_has6qd.mp4'
  ];

  get videoPlaylist(): string[] {
    return this.isMobile() ? this.videoPlaylistMobile : this.videoPlaylistDesktop;
  }

  readonly currentVideoIndex = signal<number>(0);
  readonly activeSlot = signal<'A' | 'B'>('A');

  srcA = signal<string>(this.videoPlaylistDesktop[0]);
  srcB = signal<string>(this.videoPlaylistDesktop[1]);

  private isTransitioning = false;

  // Video exclusivo de Casa L para la sección de cotización
  readonly casaLVideo = 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4';

  // Fotografías de autor de Casa L para el collage arquitectónico
  readonly casaLCollage = [
    {
      url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439880/b2a056c1-0a5b-4aee-ab44-d1f868266cd8_xuvvnz.jpg',
      label: 'Piscina reflectante & ala social',
      code: 'REF-01 // CASA L'
    },
    {
      url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439875/390124c1-e70a-4713-b438-ada6247d4363_adxqt1.jpg',
      label: 'Celosías motorizadas en madera noble',
      code: 'DET-02 // MATERIALIDAD'
    },
    {
      url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439869/0515c974-72ed-4747-a2b4-400fc4a61610_zz7mu0.jpg',
      label: 'Geometría en L sobre el paisaje',
      code: 'EXT-03 // ARQUITECTURA'
    }
  ];

  // 4 Pilares de la metodología de cotización (Estilo Nosotros)
  readonly etapasCotizacion: EtapaCotizacion[] = [
    {
      etapa: '01',
      tag: 'CONSULTA TÉCNICA',
      titulo: 'Visión & Terreno',
      desc: 'Escuchamos tus requerimientos espaciales, analizamos la topografía del lote y los lineamientos bioclimáticos del predio.',
      code: 'SYS_STAGE // 01'
    },
    {
      etapa: '02',
      tag: 'INGENIERÍA & NORMA',
      titulo: 'Viabilidad & Factibilidad',
      desc: 'Evaluación de norma urbanística (POT/EOT), accesibilidad de servicios y estimación financiera preliminar.',
      code: 'SYS_STAGE // 02'
    },
    {
      etapa: '03',
      tag: 'DISEÑO DE AUTOR',
      titulo: 'Anteproyecto & Presupuesto',
      desc: 'Modelado 3D fotorrealista de autor con presupuesto itemizado y blindado bajo cálculo estructural NSR-10.',
      code: 'SYS_STAGE // 03'
    },
    {
      etapa: '04',
      tag: 'EJECUCIÓN',
      titulo: 'Construcción Llave en Mano',
      desc: 'Dirección técnica residente diaria, control presupuestal riguroso y entrega impecable para habitar.',
      code: 'SYS_STAGE // 04'
    }
  ];

  // Form Model
  nombre = signal<string>('');
  correo = signal<string>('');
  telefono = signal<string>('');
  servicioInteres = signal<string>('Diseño y Construcción Integral');
  mensaje = signal<string>('');

  // UI States
  cargando = signal<boolean>(false);
  enviado = signal<boolean>(false);
  errorMsg = signal<string>('');

  get whatsappUrl(): string {
    const wa = (this.cms.config().whatsapp_contacto || '573108459210').replace(/[^0-9]/g, '');
    const telText = this.telefono() ? ` | Tel: ${this.telefono()}` : '';
    const servText = this.servicioInteres() ? ` | Interés: ${this.servicioInteres()}` : '';
    const text = `Hola Sysmicon, me gustaría cotizar mi proyecto arquitectónico. Mi nombre es ${this.nombre() || 'un cliente interesado'}. Correo: ${this.correo()}${telText}${servText}. ${this.mensaje() ? 'Mensaje: ' + this.mensaje() : ''}`;
    return `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  }

  get mailtoUrl(): string {
    const email = this.cms.config().email_soporte || 'redes.sysmicon@gmail.com';
    const subject = encodeURIComponent('Cotización de proyecto arquitectónico | ' + (this.servicioInteres() || 'Sysmicon'));
    const body = encodeURIComponent(`Nombre: ${this.nombre()}\nCorreo: ${this.correo()}\nTeléfono: ${this.telefono()}\nServicio: ${this.servicioInteres()}\n\nMensaje:\n${this.mensaje()}`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  scrollToCotizador(): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('formulario-cotizacion');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnInit(): void {
    this.checkMobile();
    this.route.queryParams.subscribe(params => {
      if (params['proyecto']) {
        this.mensaje.set(`Hola, estoy interesado/a en un proyecto arquitectónico con características similares a la obra "${params['proyecto']}". Quisiera agendar una consulta técnica.`);
      }
      if (params['servicio']) {
        this.servicioInteres.set(params['servicio']);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      try {
        AOS.refresh();
      } catch (e) {}

      if (this.casaLVideoRef?.nativeElement) {
        this.casaLVideoRef.nativeElement.muted = true;
        this.casaLVideoRef.nativeElement.play().catch(() => {});
      }
      if (this.sectionVideoRef?.nativeElement) {
        this.sectionVideoRef.nativeElement.muted = true;
        this.sectionVideoRef.nativeElement.play().catch(() => {});
      }
      this.playActiveVideo();
    }, 150);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      if (this.isMobile() !== mobile) {
        this.isMobile.set(mobile);
        const playlist = this.videoPlaylist;
        this.srcA.set(playlist[0]);
        this.srcB.set(playlist[1] || playlist[0]);
      }
    }
  }

  private playActiveVideo(): void {
    const activeEl = this.activeSlot() === 'A' ? this.videoA?.nativeElement : this.videoB?.nativeElement;
    if (activeEl) {
      activeEl.muted = true;
      activeEl.volume = 0;
      activeEl.play().catch(() => {});
    }
  }

  onVideoEnded(slot: 'A' | 'B'): void {
    if (slot === this.activeSlot() && !this.isTransitioning) {
      this.nextVideo();
    }
  }

  onTimeUpdate(slot: 'A' | 'B'): void {
    const videoEl = slot === 'A' ? this.videoA?.nativeElement : this.videoB?.nativeElement;
    if (videoEl && slot === this.activeSlot() && !this.isTransitioning) {
      if (videoEl.duration > 0 && videoEl.currentTime >= videoEl.duration - 0.4) {
        this.nextVideo();
      }
    }
  }

  nextVideo(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const playlist = this.videoPlaylist;
    const nextIdx = (this.currentVideoIndex() + 1) % playlist.length;
    this.currentVideoIndex.set(nextIdx);

    const targetSlot = this.activeSlot() === 'A' ? 'B' : 'A';
    const targetVideoEl = targetSlot === 'A' ? this.videoA?.nativeElement : this.videoB?.nativeElement;

    if (targetSlot === 'A') {
      this.srcA.set(playlist[nextIdx]);
    } else {
      this.srcB.set(playlist[nextIdx]);
    }

    if (targetVideoEl) {
      targetVideoEl.currentTime = 0;
      targetVideoEl.muted = true;
      targetVideoEl.volume = 0;
      targetVideoEl.play().then(() => {
        this.activeSlot.set(targetSlot);
        setTimeout(() => {
          this.isTransitioning = false;
        }, 1000);
      }).catch(() => {
        this.activeSlot.set(targetSlot);
        this.isTransitioning = false;
      });
    } else {
      this.activeSlot.set(targetSlot);
      this.isTransitioning = false;
    }
  }

  onSubmit(): void {
    if (!this.nombre() || !this.correo()) {
      this.errorMsg.set('Por favor completa tu nombre y correo electrónico.');
      return;
    }
    this.cargando.set(true);
    this.errorMsg.set('');

    const payload = {
      nombre: this.nombre(),
      email: this.correo(),
      telefono: this.telefono(),
      asunto: `Cotización: ${this.servicioInteres() || 'Arquitectura Residencial'}`,
      mensaje: this.mensaje() || 'Solicitud de asesoría y cotización arquitectónica personalizada',
      contenido: this.mensaje() || 'Solicitud de asesoría y cotización arquitectónica personalizada',
      tipo_servicio: this.servicioInteres() || 'Arquitectura Residencial / Obra Nueva'
    };

    this.http.post(`${this.apiUrl}/cotizacion`, payload).subscribe({
      next: () => {
        this.cargando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        // En caso de error de red
        this.cargando.set(false);
        this.enviado.set(true);
      }
    });
  }

  enviarMensaje(event?: Event): void {
    if (event) event.preventDefault();
    this.onSubmit();
  }

  nuevaConsulta(): void {
    this.nombre.set('');
    this.correo.set('');
    this.telefono.set('');
    this.mensaje.set('');
    this.enviado.set(false);
    this.errorMsg.set('');
  }
}
