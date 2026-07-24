import { Component, AfterViewInit, signal, inject, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CONTACT_INFO, BRAND_CONFIG } from '../../core/app.constants';

@Component({
  selector: 'app-cotiza-con-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cotiza-con-nosotros.component.html',
  styleUrl: './cotiza-con-nosotros.component.css'
})
export class CotizaConNosotrosComponent implements AfterViewInit {
  readonly contact = CONTACT_INFO;
  readonly brand = BRAND_CONFIG;

  @ViewChild('videoA') videoA!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoB') videoB!: ElementRef<HTMLVideoElement>;

  readonly videoPlaylist = [
    'assets/videos/recursos/sysmi-5.mp4',
    'assets/videos/recursos/sysmi-2.mp4'
  ];

  readonly currentVideoIndex = signal<number>(0);
  readonly activeSlot = signal<'A' | 'B'>('A');

  srcA = signal<string>(this.videoPlaylist[0]);
  srcB = signal<string>(this.videoPlaylist[1]);

  private isTransitioning = false;

  // Form Model
  nombre = signal<string>('');
  telefono = signal<string>('');
  asunto = signal<string>('');
  mensaje = signal<string>('');

  // UI States
  cargando = signal<boolean>(false);
  enviado = signal<boolean>(false);
  errorMsg = signal<string>('');
  modalAbierto = signal<boolean>(false);

  abrirModal(): void {
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  get whatsappUrl(): string {
    const text = `Hola Sysmicon, me gustaría cotizar mi proyecto arquitectónico. Mi nombre es ${this.nombre() || 'un cliente interesado'}.`;
    return `https://wa.me/573108459210?text=${encodeURIComponent(text)}`;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playActiveVideo();
    }, 100);
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
    const nextIdx = (this.currentVideoIndex() + 1) % this.videoPlaylist.length;
    const currentSlot = this.activeSlot();
    const nextSlot = currentSlot === 'A' ? 'B' : 'A';
    const nextSrc = this.videoPlaylist[nextIdx];

    if (nextSlot === 'A') {
      this.srcA.set(nextSrc);
      if (this.videoA?.nativeElement) {
        const vA = this.videoA.nativeElement;
        vA.currentTime = 0;
        vA.play().then(() => {
          this.activeSlot.set('A');
          this.currentVideoIndex.set(nextIdx);
          setTimeout(() => { this.isTransitioning = false; }, 800);
        }).catch(() => {
          this.activeSlot.set('A');
          this.currentVideoIndex.set(nextIdx);
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
          this.currentVideoIndex.set(nextIdx);
          setTimeout(() => { this.isTransitioning = false; }, 800);
        }).catch(() => {
          this.activeSlot.set('B');
          this.currentVideoIndex.set(nextIdx);
          this.isTransitioning = false;
        });
      }
    }
  }

  enviarMensaje(event: Event): void {
    event.preventDefault();
    if (!this.nombre().trim() || !this.telefono().trim() || !this.asunto().trim()) {
      this.errorMsg.set('Por favor completa al menos tu nombre, teléfono y asunto.');
      return;
    }

    this.errorMsg.set('');
    this.cargando.set(true);

    // Simulación de envío del formulario al sistema de contacto de Sysmicon
    setTimeout(() => {
      this.cargando.set(false);
      this.enviado.set(true);
      // Limpiar campos para nueva consulta
      this.nombre.set('');
      this.telefono.set('');
      this.asunto.set('');
      this.mensaje.set('');
    }, 1200);
  }

  nuevaConsulta(): void {
    this.enviado.set(false);
  }
}
