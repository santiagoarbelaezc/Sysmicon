import { Component, inject, signal, computed, AfterViewInit } from '@angular/core';
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
export class ProyectosPageComponent implements AfterViewInit {
  readonly proyectosService = inject(ProyectosService);
  readonly router = inject(Router);

  readonly categoriaSeleccionada = signal<string>('Todas');
  readonly selectedProject = signal<Proyecto | null>(null);
  readonly currentImageIndex = signal<number>(0);

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

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  abrirDossier(proyecto: Proyecto): void {
    this.selectedProject.set(proyecto);
    this.currentImageIndex.set(0);
    document.body.style.overflow = 'hidden';
  }

  cerrarDossier(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  seleccionarImagenModal(idx: number): void {
    this.currentImageIndex.set(idx);
  }

  anteriorImagenModal(): void {
    const total = this.modalImages().length;
    if (total === 0) return;
    this.currentImageIndex.update(i => (i - 1 + total) % total);
  }

  siguienteImagenModal(): void {
    const total = this.modalImages().length;
    if (total === 0) return;
    this.currentImageIndex.update(i => (i + 1) % total);
  }

  solicitarAsesoria(p: Proyecto): void {
    this.cerrarDossier();
    this.router.navigate(['/cotiza-con-nosotros'], { queryParams: { proyecto: p.titulo } });
  }
}
