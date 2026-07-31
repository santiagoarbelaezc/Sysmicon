import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-banner-video',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner-video.component.html',
  styleUrl: './banner-video.component.css'
})
export class BannerVideoComponent implements AfterViewInit, OnDestroy {
  private readonly proyectosService = inject(ProyectosService);
  private readonly router = inject(Router);

  @ViewChild('sectionEl') sectionElement?: ElementRef<HTMLElement>;
  @ViewChild('videoEl') videoElement?: ElementRef<HTMLVideoElement>;

  @Input() videoSrc: string = 'https://res.cloudinary.com/dsv1gdgya/video/upload/f_auto,q_auto,w_1000/v1785017819/sysmi-1_mvv1wg.mp4';
  @Input() logoSrc: string = 'assets/icons/logo-hero.png';
  @Input() badgeText: string = '';
  @Input() titulo: string = 'CASA';
  @Input() tituloHighlight: string = 'M';
  @Input() subtitulo: string = 'Residencia contemporánea donde la arquitectura de autor y la materialidad convergen en perfecta simetría.';
  @Input() ctaText: string = 'VER PROYECTO';
  @Input() ctaLink: string = '/proyectos';
  @Input() secondaryCtaText: string = 'VER DOSSIER COMPLETO';
  @Input() secondaryCtaLink: string = '/proyectos';
  @Input() showCta: boolean = true;
  @Input() proyectoId: string = 'casaM';

  private observer?: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private hostEl: ElementRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initVideo();
      this.initIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.pauseVideo();
  }

  private initVideo(): void {
    if (this.videoElement?.nativeElement) {
      const v = this.videoElement.nativeElement;
      v.muted = true;
      v.play().catch(() => {});
    }
  }

  playVideo(): void {
    if (this.videoElement?.nativeElement && this.videoElement.nativeElement.paused) {
      const v = this.videoElement.nativeElement;
      v.muted = true;
      v.play().catch(() => {});
    }
  }

  pauseVideo(): void {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
    }
  }

  abrirProyecto(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/proyecto', this.proyectoId || 'casaM']);
  }

  private initIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.playVideo();
          } else {
            this.pauseVideo();
          }
        });
      }, { threshold: 0.1 });

      const target = this.sectionElement?.nativeElement || this.hostEl?.nativeElement;
      if (target) {
        this.observer.observe(target);
      }
    }
  }
}
