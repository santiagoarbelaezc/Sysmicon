import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class ProjectsComponent {
  // PROYECTOS PORTAFOLIO EXCLUSIVO SYSMICON
  readonly items: PortfolioItem[] = [
    {
      id: 'casaM',
      title: 'CASA M',
      subtitle: 'Geometría minimalista integrada con materiales nobles y luz natural en el Oriente Antioqueño.',
      img: 'images/imagen6.jpg',
      images: [
        'assets/images/casaM/1.png',
        'assets/images/casaM/2.png',
        'assets/images/casaM/3.png',
        'assets/images/casaM/4.png',
        'assets/images/casaM/5.png',
        'assets/images/casaM/6.png'
      ]
    },
    {
      id: 'casaS19',
      title: 'CASA S19',
      subtitle: 'Volumetría suspendida y grandes ventanales con vista panorámica y diseño bioclimático.',
      img: 'images/imagen1.jpg',
      images: [
        'images/imagen1.jpg',
        'images/imagen2.jpg',
        'images/imagen3.jpg',
        'images/imagen4.jpg',
        'images/imagen5.jpg',
        'images/principal.jpg'
      ]
    },
    {
      id: 'casaS23',
      title: 'CASA S23',
      subtitle: 'Espacios fluidos que diluyen los límites entre el interior y los jardines exteriores.',
      img: 'images/imagen2.jpg',
      images: [
        'images/imagen2.jpg',
        'images/imagen3.jpg',
        'images/imagen4.jpg',
        'images/imagen5.jpg',
        'images/principal.jpg',
        'images/imagen1.jpg'
      ]
    },
    {
      id: 'casaL',
      title: 'CASA L',
      subtitle: 'Estructura en concreto a la vista combinada con madera fina y acabados artesanales.',
      img: 'images/imagen3.jpg',
      images: [
        'images/imagen3.jpg',
        'images/imagen4.jpg',
        'images/imagen5.jpg',
        'images/principal.jpg',
        'images/imagen1.jpg',
        'images/imagen2.jpg'
      ]
    }
  ];

  currentSlide = 0;
  readonly selectedProject = signal<PortfolioItem | null>(null);
  readonly activeLightboxImage = signal<string | null>(null);

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

  abrirGaleria(item: PortfolioItem): void {
    this.selectedProject.set(item);
    document.body.style.overflow = 'hidden';
  }

  cerrarGaleria(): void {
    this.selectedProject.set(null);
    this.activeLightboxImage.set(null);
    document.body.style.overflow = '';
  }

  abrirLightbox(img: string): void {
    this.activeLightboxImage.set(img);
  }

  cerrarLightbox(): void {
    this.activeLightboxImage.set(null);
  }
}
