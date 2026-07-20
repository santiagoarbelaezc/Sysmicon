import { Component, inject, signal, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import AOS from 'aos';

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  images: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => AOS.refresh(), 150);
  }
  // PROYECTOS PORTAFOLIO EXCLUSIVO SYSMICON
  readonly items: PortfolioItem[] = [
    {
      id: 'casaM',
      title: 'CASA M',
      subtitle: 'Geometría minimalista integrada con materiales nobles y luz natural en el Oriente Antioqueño.',
      img: '/assets/images/imagen6.jpg',
      images: [
        '/assets/images/imagen6.jpg',
        '/assets/images/principal.jpg',
        '/assets/images/imagen1.jpg',
        '/assets/images/casaM/4.png',
        '/assets/images/casaM/5.png',
        '/assets/images/casaM/6.png'
      ]
    },
    {
      id: 'casaS19',
      title: 'CASA S19',
      subtitle: 'Volumetría suspendida y grandes ventanales con vista panorámica y diseño bioclimático.',
      img: '/assets/images/casaS19/s19-portada.jpg',
      images: [
        '/assets/images/casaS19/s19-portada.jpg',
        '/assets/images/imagen4.jpg',
        '/assets/images/imagen5.jpg',
        '/assets/images/casaS19/S19-3.png',
        '/assets/images/casaS19/S19-5.png',
        '/assets/images/casaS19/S19-6.png',
        '/assets/images/casaS19/S19-7.png'
      ]
    },
    {
      id: 'casaS23',
      title: 'CASA S23',
      subtitle: 'Espacios fluidos que diluyen los límites entre el interior y los jardines exteriores.',
      img: '/assets/images/casaS23/S23-1.png',
      images: [
        '/assets/images/casaS23/S23-1.png',
        '/assets/images/casaS23/S23-2.png',
        '/assets/images/imagen2.jpg',
        '/assets/images/casaS23/S23-4.png',
        '/assets/images/casaS23/S23-5.png',
        '/assets/images/casaS23/S23-6.png'
      ]
    },
    {
      id: 'casaL',
      title: 'CASA L',
      subtitle: 'Estructura en concreto a la vista combinada con madera fina y acabados artesanales.',
      img: '/assets/images/casaL/CasaL-portada.jpg',
      images: [
        '/assets/images/casaL/CasaL-portada.jpg',
        '/assets/images/imagen3.jpg',
        '/assets/images/casaL/casaL-6.png',
        '/assets/images/casaL/casaL-5.png',
        '/assets/images/casaL/casaL-3.png'
      ]
    }
  ];

  currentSlide = 0;
  readonly selectedProject = signal<PortfolioItem | null>(null);
  readonly currentImageIndex = signal<number>(0);
  readonly activeLightboxImage = signal<string | null>(null);
  readonly animTrigger = signal<number>(0);

  trackByTrigger(index: number, item: number): number {
    return item;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.activeLightboxImage() || this.selectedProject()) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.anteriorImagen();
        if (this.activeLightboxImage()) {
          const p = this.selectedProject();
          if (p && p.images && p.images.length > 0) {
            this.activeLightboxImage.set(p.images[this.currentImageIndex()]);
          }
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.siguienteImagen();
        if (this.activeLightboxImage()) {
          const p = this.selectedProject();
          if (p && p.images && p.images.length > 0) {
            this.activeLightboxImage.set(p.images[this.currentImageIndex()]);
          }
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (this.activeLightboxImage()) {
          this.cerrarLightbox();
        } else if (this.selectedProject()) {
          this.cerrarGaleria();
        }
      }
    }
  }

  getMainImg(p: PortfolioItem, idx: number = this.currentImageIndex()): string {
    if (p.images && p.images.length > 0) {
      return p.images[idx] || p.img;
    }
    return p.img;
  }

  getDetailImg(p: PortfolioItem, idx: number = this.currentImageIndex()): string {
    if (p.images && p.images.length > 1) {
      return p.images[(idx + 1) % p.images.length];
    }
    return p.img;
  }

  onScroll(event: Event): void {
    const container = event.target as HTMLElement;
    if (container) {
      const slideWidth = container.clientWidth;
      this.currentSlide = Math.round(container.scrollLeft / slideWidth);
    }
  }

  scrollToSlide(index: number): void {
    this.currentSlide = index;
    const slideElement = document.getElementById('slide-proj-' + index);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  anteriorSlideMobile(): void {
    const total = this.items.length;
    const prev = (this.currentSlide - 1 + total) % total;
    this.scrollToSlide(prev);
  }

  siguienteSlideMobile(): void {
    const total = this.items.length;
    const next = (this.currentSlide + 1) % total;
    this.scrollToSlide(next);
  }

  abrirGaleria(item: PortfolioItem): void {
    this.selectedProject.set(item);
    this.currentImageIndex.set(0);
    this.animTrigger.set(0);
    document.body.style.overflow = 'hidden';
  }

  cerrarGaleria(): void {
    this.selectedProject.set(null);
    this.activeLightboxImage.set(null);
    document.body.style.overflow = '';
  }

  seleccionarImagen(idx: number): void {
    if (this.currentImageIndex() === idx) return;
    this.currentImageIndex.set(idx);
    this.animTrigger.update(v => v + 1);
  }

  anteriorImagen(): void {
    const sp = this.selectedProject();
    if (!sp || !sp.images || sp.images.length === 0) return;
    const total = sp.images.length;
    this.currentImageIndex.update(i => (i - 1 + total) % total);
    this.animTrigger.update(v => v + 1);
  }

  siguienteImagen(): void {
    const sp = this.selectedProject();
    if (!sp || !sp.images || sp.images.length === 0) return;
    const total = sp.images.length;
    this.currentImageIndex.update(i => (i + 1) % total);
    this.animTrigger.update(v => v + 1);
  }

  anteriorImagenLightbox(): void {
    this.anteriorImagen();
    const p = this.selectedProject();
    if (p && p.images && p.images.length > 0) {
      this.activeLightboxImage.set(p.images[this.currentImageIndex()]);
    }
  }

  siguienteImagenLightbox(): void {
    this.siguienteImagen();
    const p = this.selectedProject();
    if (p && p.images && p.images.length > 0) {
      this.activeLightboxImage.set(p.images[this.currentImageIndex()]);
    }
  }

  abrirLightbox(img: string): void {
    this.activeLightboxImage.set(img);
  }

  cerrarLightbox(): void {
    this.activeLightboxImage.set(null);
  }
}
