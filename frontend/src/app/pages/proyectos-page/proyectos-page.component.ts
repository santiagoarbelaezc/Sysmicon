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

  readonly categorias = ['Todas', 'Residencial', 'Remodelación', 'Arquitectura interior', 'Oficina'];

  readonly proyectos = computed(() => {
    const cat = this.categoriaSeleccionada();
    const all = this.proyectosService.getProyectos();
    if (cat === 'Todas') {
      return all;
    }
    return all.filter(p => p.categoria === cat);
  });

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  abrirDossier(proyecto: Proyecto): void {
    this.selectedProject.set(proyecto);
    document.body.style.overflow = 'hidden';
  }

  cerrarDossier(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  solicitarAsesoria(p: Proyecto): void {
    this.cerrarDossier();
    this.router.navigate(['/cotiza-con-nosotros'], { queryParams: { proyecto: p.titulo } });
  }
}
