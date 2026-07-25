import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyecto-detalle.component.html',
  styleUrl: './proyecto-detalle.component.css'
})
export class ProyectoDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly proyectosService = inject(ProyectosService);

  readonly proyecto = signal<Proyecto | null>(null);
  readonly currentImageIndex = signal<number>(0);
  readonly animTrigger = signal<number>(0);
  readonly isPanelExpanded = signal<boolean>(false);

  private lastScrollTime = 0;
  private touchStartX = 0;
  private touchStartY = 0;

  readonly allImages = computed(() => {
    const p = this.proyecto();
    if (!p) return [];
    const list = [p.imagenUrl, ...(p.imagenesAdicionales || [])];
    return Array.from(new Set(list));
  });

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const found = this.proyectosService.getProyectoById(id);
        if (found) {
          this.proyecto.set(found);
          this.currentImageIndex.set(0);
          this.animTrigger.update(n => n + 1);
          this.scrollToActiveThumb(0);
        } else {
          this.router.navigate(['/proyectos']);
        }
      }
    });
  }

  trackByTrigger(index: number, item: number): number {
    return item;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'Escape' || key === 'Esc' || event.code === 'Escape') {
      event.preventDefault();
      this.regresar();
    } else if (key === 'ArrowLeft' || event.code === 'ArrowLeft') {
      event.preventDefault();
      this.anteriorImagen();
    } else if (key === 'ArrowRight' || event.code === 'ArrowRight') {
      event.preventDefault();
      this.siguienteImagen();
    }
  }

  @HostListener('wheel', ['$event'])
  handleWheel(event: WheelEvent): void {
    const now = Date.now();
    if (now - this.lastScrollTime < 300) return;

    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);

    if (absX > 15 || absY > 15) {
      if (absX >= absY) {
        if (event.deltaX > 15) {
          this.siguienteImagen();
          this.lastScrollTime = now;
        } else if (event.deltaX < -15) {
          this.anteriorImagen();
          this.lastScrollTime = now;
        }
      } else {
        if (event.deltaY > 30) {
          this.siguienteImagen();
          this.lastScrollTime = now;
        } else if (event.deltaY < -30) {
          this.anteriorImagen();
          this.lastScrollTime = now;
        }
      }
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (!event.touches[0]) return;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches[0]) return;
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const diffX = endX - this.touchStartX;
    const diffY = endY - this.touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        this.siguienteImagen();
      } else {
        this.anteriorImagen();
      }
    }
  }

  regresar(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/proyectos']);
    }
  }

  siguienteImagen(): void {
    const total = this.allImages().length;
    if (total <= 1) return;
    const nextIdx = (this.currentImageIndex() + 1) % total;
    this.currentImageIndex.set(nextIdx);
    this.animTrigger.update(n => n + 1);
    this.scrollToActiveThumb(nextIdx);
  }

  anteriorImagen(): void {
    const total = this.allImages().length;
    if (total <= 1) return;
    const nextIdx = (this.currentImageIndex() - 1 + total) % total;
    this.currentImageIndex.set(nextIdx);
    this.animTrigger.update(n => n + 1);
    this.scrollToActiveThumb(nextIdx);
  }

  seleccionarImagen(index: number): void {
    this.currentImageIndex.set(index);
    this.animTrigger.update(n => n + 1);
    this.scrollToActiveThumb(index);
  }

  private scrollToActiveThumb(idx: number): void {
    setTimeout(() => {
      const el = document.getElementById('thumb-item-' + idx);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 40);
  }

  getMainImg(): string {
    const images = this.allImages();
    if (images.length === 0) return '';
    return images[this.currentImageIndex() % images.length];
  }

  getDetailImg(): string {
    const images = this.allImages();
    if (images.length <= 1) return images[0] || '';
    const nextIdx = (this.currentImageIndex() + 1) % images.length;
    return images[nextIdx];
  }

  solicitarAsesoria(): void {
    const p = this.proyecto();
    const titulo = p ? p.titulo : 'Proyecto';
    const msg = encodeURIComponent(`Hola Sysmicon, me interesa solicitar información sobre el proyecto ${titulo}.`);
    window.open(`https://wa.me/573108459210?text=${msg}`, '_blank');
  }

  togglePanel(): void {
    this.isPanelExpanded.update(val => !val);
  }
}
