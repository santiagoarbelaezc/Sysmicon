import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface VideoItem {
  id: number;
  src: string;
  title: string;
  tagline: string;
}

@Component({
  selector: 'app-hero-video',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-video.component.html',
  styleUrl: './hero-video.component.css'
})
export class HeroVideoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoA') videoA!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoB') videoB!: ElementRef<HTMLVideoElement>;

  readonly playlist: VideoItem[] = [
    {
      id: 0,
      src: 'assets/videos/recursos/sysmi-6.mp4',
      title: 'Ingeniería & Obra 360°',
      tagline: 'Innovación en Cada Detalle'
    },
    {
      id: 1,
      src: 'assets/videos/recursos/sysmi-1.mp4',
      title: 'Diseño Residencial & Fincas',
      tagline: 'Arquitectura de Alta Gama'
    },
    {
      id: 2,
      src: 'assets/videos/recursos/sysmi-4.mp4',
      title: 'Estructuración & Ejecución',
      tagline: 'Rigor Técnico y Presupuesto Blindado'
    },
    {
      id: 3,
      src: 'assets/videos/recursos/sysmi-5.mp4',
      title: 'Espacios Exclusivos & Acabados',
      tagline: 'Excelencia en Construcción'
    }
  ];

  readonly currentIndex = signal<number>(0);
  readonly activeSlot = signal<'A' | 'B'>('A');

  srcA = signal<string>(this.playlist[0].src);
  srcB = signal<string>(this.playlist[1].src);

  private isTransitioning = false;
  private observer?: IntersectionObserver;
  private isHeroVisible = true;

  constructor(private hostEl: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initVideos();
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.pauseAllVideos();
  }

  private initVideos(): void {
    if (this.videoA?.nativeElement) {
      const vA = this.videoA.nativeElement;
      vA.muted = true;
      vA.play().catch(() => {});
    }
  }

  private initIntersectionObserver(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isHeroVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.playActiveVideo();
          } else {
            this.pauseAllVideos();
          }
        });
      }, { threshold: 0.1 });

      if (this.hostEl?.nativeElement) {
        this.observer.observe(this.hostEl.nativeElement);
      }
    }
  }

  playActiveVideo(): void {
    const videoEl = this.activeSlot() === 'A' ? this.videoA?.nativeElement : this.videoB?.nativeElement;
    if (videoEl && videoEl.paused) {
      videoEl.play().catch(() => {});
    }
  }

  pauseAllVideos(): void {
    if (this.videoA?.nativeElement) {
      this.videoA.nativeElement.pause();
    }
    if (this.videoB?.nativeElement) {
      this.videoB.nativeElement.pause();
    }
  }

  onVideoEnded(slot: 'A' | 'B'): void {
    if (!this.isHeroVisible) return;
    if (slot === this.activeSlot() && !this.isTransitioning) {
      this.nextVideo();
    }
  }

  onTimeUpdate(slot: 'A' | 'B'): void {
    if (!this.isHeroVisible) return;
    const videoEl = slot === 'A' ? this.videoA?.nativeElement : this.videoB?.nativeElement;
    if (videoEl && slot === this.activeSlot() && !this.isTransitioning) {
      // Trigger transition slightly before actual end to guarantee smooth crossfade
      if (videoEl.duration > 0 && videoEl.currentTime >= videoEl.duration - 0.4) {
        this.nextVideo();
      }
    }
  }

  nextVideo(): void {
    const nextIdx = (this.currentIndex() + 1) % this.playlist.length;
    this.goToVideo(nextIdx);
  }

  prevVideo(): void {
    const prevIdx = (this.currentIndex() - 1 + this.playlist.length) % this.playlist.length;
    this.goToVideo(prevIdx);
  }

  goToVideo(targetIndex: number): void {
    if (this.isTransitioning || targetIndex === this.currentIndex()) return;
    this.isTransitioning = true;

    const currentSlot = this.activeSlot();
    const nextSlot = currentSlot === 'A' ? 'B' : 'A';
    const nextSrc = this.playlist[targetIndex].src;

    if (nextSlot === 'A') {
      this.srcA.set(nextSrc);
      if (this.videoA?.nativeElement) {
        const vA = this.videoA.nativeElement;
        vA.currentTime = 0;
        vA.play().then(() => {
          this.activeSlot.set('A');
          this.currentIndex.set(targetIndex);
          setTimeout(() => { this.isTransitioning = false; }, 800);
        }).catch(() => {
          this.activeSlot.set('A');
          this.currentIndex.set(targetIndex);
          this.isTransitioning = false;
        });
      }
    } else {
      this.srcB.set(nextSrc);
      if (this.videoB?.nativeElement) {
        const vB = this.videoB.nativeElement;
        vB.currentTime = 0;
        vB.play().then(() => {
          this.activeSlot.set('B');
          this.currentIndex.set(targetIndex);
          setTimeout(() => { this.isTransitioning = false; }, 800);
        }).catch(() => {
          this.activeSlot.set('B');
          this.currentIndex.set(targetIndex);
          this.isTransitioning = false;
        });
      }
    }
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
