import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-video',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-video.component.html',
  styleUrl: './hero-video.component.css'
})
export class HeroVideoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoEl') videoRef!: ElementRef<HTMLVideoElement>;

  readonly videoSrc = signal<string>('assets/videos/recursos/sysmi-0.mp4');
  readonly isMobile = signal<boolean>(false);
  readonly seekBadgeText = signal<string | null>(null);
  
  private observer?: IntersectionObserver;
  private isHeroVisible = true;
  private seekTimeout?: any;

  constructor(private hostEl: ElementRef) {}

  ngOnInit(): void {
    this.updateVideoSource();
  }

  ngAfterViewInit(): void {
    this.initVideo();
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.pauseVideo();
    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
    }
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.updateVideoSource();
  }

  private updateVideoSource(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      this.isMobile.set(mobile);
      const newSrc = mobile 
        ? 'assets/videos/recursos/sysmi-movil-0.mp4' 
        : 'assets/videos/recursos/sysmi-0.mp4';
      if (this.videoSrc() !== newSrc) {
        this.videoSrc.set(newSrc);
      }
    }
  }

  private initVideo(): void {
    if (this.videoRef?.nativeElement) {
      const v = this.videoRef.nativeElement;
      v.muted = true;
      v.play().catch(() => {});
    }
  }

  private initIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isHeroVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.playVideo();
          } else {
            this.pauseVideo();
          }
        });
      }, { threshold: 0.1 });

      if (this.hostEl?.nativeElement) {
        this.observer.observe(this.hostEl.nativeElement);
      }
    }
  }

  playVideo(): void {
    if (this.videoRef?.nativeElement && this.videoRef.nativeElement.paused) {
      this.videoRef.nativeElement.play().catch(() => {});
    }
  }

  pauseVideo(): void {
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.pause();
    }
  }

  // Avanzar 15 segundos de manera cíclica con animación elegante
  avanzar15Segundos(): void {
    if (!this.videoRef?.nativeElement) return;
    const v = this.videoRef.nativeElement;
    const duration = v.duration || 60;
    const targetTime = (v.currentTime + 15) % duration;
    v.currentTime = targetTime;

    this.showSeekBadge('+15s');
  }

  // Retroceder 15 segundos cíclicamente
  retroceder15Segundos(): void {
    if (!this.videoRef?.nativeElement) return;
    const v = this.videoRef.nativeElement;
    const duration = v.duration || 60;
    let targetTime = v.currentTime - 15;
    if (targetTime < 0) {
      targetTime = Math.max(0, duration + targetTime);
    }
    v.currentTime = targetTime;

    this.showSeekBadge('-15s');
  }

  private showSeekBadge(text: string): void {
    this.seekBadgeText.set(text);
    if (this.seekTimeout) {
      clearTimeout(this.seekTimeout);
    }
    this.seekTimeout = setTimeout(() => {
      this.seekBadgeText.set(null);
    }, 1000);
  }

  scrollToNext(): void {
    const projectsEl = document.querySelector('app-projects') || document.getElementById('proyectos');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  }
}
