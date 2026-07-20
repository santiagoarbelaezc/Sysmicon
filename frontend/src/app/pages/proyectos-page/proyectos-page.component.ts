import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyectos-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos-page.component.html',
  styleUrl: './proyectos-page.component.css'
})
export class ProyectosPageComponent {
  readonly proyectosService = inject(ProyectosService);
  readonly router = inject(Router);

  readonly categoriaSeleccionada = signal<string>('Todas');
  readonly selectedProject = signal<Proyecto | null>(null);
  readonly currentImageIndex = signal<number>(0);
  readonly activeLightboxImage = signal<string | null>(null);
  readonly animTrigger = signal<number>(0);

  readonly categorias = ['Todas', 'Residencial', 'Remodelación', 'Arquitectura interior', 'Oficina'];

  readonly proyectos = computed(() => {
    const cat = this.categoriaSeleccionada();
    const all = this.proyectosService.getProyectos();
    if (cat === 'Todas') {
      return all;
    }
    return all.filter(p => p.categoria === cat);
  });

  readonly modalImages = computed(() => {
    const sp = this.selectedProject();
    if (!sp) return [];
    // Unir imagen principal con las adicionales eliminando duplicados exactos
    const list = [sp.imagenUrl, ...(sp.imagenesAdicionales || [])];
    return Array.from(new Set(list));
  });

  constructor() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByTrigger(index: number, item: number): number {
    return item;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.activeLightboxImage()) {
      if (event.key === 'Escape') {
        this.cerrarLightbox();
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        this.anteriorImagenLightbox();
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        this.siguienteImagenLightbox();
        event.preventDefault();
      }
      return;
    }

    if (this.selectedProject()) {
      if (event.key === 'Escape') {
        this.cerrarDossier();
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        this.anteriorImagenModal();
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        this.siguienteImagenModal();
        event.preventDefault();
      }
    }
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  abrirDossier(proyecto: Proyecto): void {
    this.selectedProject.set(proyecto);
    this.currentImageIndex.set(0);
    this.animTrigger.update(v => v + 1);
    document.body.style.overflow = 'hidden';
  }

  cerrarDossier(): void {
    this.selectedProject.set(null);
    this.activeLightboxImage.set(null);
    document.body.style.overflow = '';
  }

  seleccionarImagenModal(idx: number): void {
    this.currentImageIndex.set(idx);
    this.animTrigger.update(v => v + 1);
  }

  anteriorImagenModal(): void {
    const total = this.modalImages().length;
    if (total === 0) return;
    this.currentImageIndex.update(i => (i - 1 + total) % total);
    this.animTrigger.update(v => v + 1);
  }

  siguienteImagenModal(): void {
    const total = this.modalImages().length;
    if (total === 0) return;
    this.currentImageIndex.update(i => (i + 1) % total);
    this.animTrigger.update(v => v + 1);
  }

  getMainImg(): string {
    const images = this.modalImages();
    if (!images || images.length === 0) return '';
    const idx = this.currentImageIndex() % images.length;
    return images[idx] || '';
  }

  getDetailImg(): string {
    const images = this.modalImages();
    if (!images || images.length <= 1) return '';
    const idx = (this.currentImageIndex() + 1) % images.length;
    return images[idx] || '';
  }

  abrirLightbox(imgUrl: string): void {
    if (!imgUrl) return;
    this.activeLightboxImage.set(imgUrl);
    this.animTrigger.update(v => v + 1);
  }

  cerrarLightbox(): void {
    this.activeLightboxImage.set(null);
  }

  anteriorImagenLightbox(): void {
    const images = this.modalImages();
    if (!images || images.length === 0) return;
    const current = this.activeLightboxImage();
    let idx = images.indexOf(current || '');
    if (idx === -1) idx = 0;
    const newIdx = (idx - 1 + images.length) % images.length;
    this.activeLightboxImage.set(images[newIdx]);
    this.animTrigger.update(v => v + 1);
  }

  siguienteImagenLightbox(): void {
    const images = this.modalImages();
    if (!images || images.length === 0) return;
    const current = this.activeLightboxImage();
    let idx = images.indexOf(current || '');
    if (idx === -1) idx = 0;
    const newIdx = (idx + 1) % images.length;
    this.activeLightboxImage.set(images[newIdx]);
    this.animTrigger.update(v => v + 1);
  }

  solicitarAsesoria(p: Proyecto): void {
    this.cerrarDossier();
    this.router.navigate(['/cotiza-con-nosotros'], { queryParams: { proyecto: p.titulo } });
  }
}
