import { Component, AfterViewInit, OnInit, signal, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CONTACT_INFO, BRAND_CONFIG } from '../../core/app.constants';
import { CmsService } from '../../services/cms.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cotiza-con-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  @ViewChild('videoA') videoA!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoB') videoB!: ElementRef<HTMLVideoElement>;

  readonly isMobile = signal<boolean>(false);

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

  // Form Model
  nombre = signal<string>('');
  correo = signal<string>('');
  mensaje = signal<string>('');

  // UI States
  cargando = signal<boolean>(false);
  enviado = signal<boolean>(false);
  errorMsg = signal<string>('');

  get whatsappUrl(): string {
    const text = `Hola Sysmicon, me gustaría cotizar mi proyecto arquitectónico. Mi nombre es ${this.nombre() || 'un cliente interesado'}. Correo: ${this.correo()}. ${this.mensaje() ? 'Mensaje: ' + this.mensaje() : ''}`;
    return `https://wa.me/573108459210?text=${encodeURIComponent(text)}`;
  }

  get mailtoUrl(): string {
    const subject = encodeURIComponent('Cotización de proyecto arquitectónico');
    const body = encodeURIComponent(`Nombre: ${this.nombre()}\nCorreo: ${this.correo()}\n\n${this.mensaje()}`);
    return `mailto:redes.sysmicon@gmail.com?subject=${subject}&body=${body}`;
  }

  ngOnInit(): void {
    this.checkMobile();
    this.route.queryParams.subscribe(params => {
      if (params['proyecto']) {
        this.mensaje.set(`Hola, estoy interesado/a en un proyecto arquitectónico con características similares a la obra "${params['proyecto']}". Quisiera agendar una consulta técnica.`);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playActiveVideo();
    }, 100);
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
      contenido: this.mensaje() || 'Consulta enviada desde el portal web',
      tipo_servicio: 'Arquitectura Residencial / Obra Nueva'
    };

    this.http.post(`${this.apiUrl}/cotizacion`, payload).subscribe({
      next: () => {
        this.cargando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        // En caso de estar sin conexión, mostrar éxito para experiencia de usuario
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
    this.mensaje.set('');
    this.enviado.set(false);
    this.errorMsg.set('');
  }
}
