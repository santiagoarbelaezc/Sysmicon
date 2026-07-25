import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';
import { BannerVideoComponent } from '../../components/banner-video/banner-video.component';

@Component({
  selector: 'app-proyectos-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerVideoComponent],
  templateUrl: './proyectos-page.component.html',
  styleUrl: './proyectos-page.component.css'
})
export class ProyectosPageComponent {
  readonly proyectosService = inject(ProyectosService);
  readonly router = inject(Router);

  readonly categoriaSeleccionada = signal<string>('Todas');
  readonly categorias = ['Todas', 'Residencial', 'Remodelación', 'Arquitectura interior', 'Oficina'];

  readonly proyectos = computed(() => {
    const cat = this.categoriaSeleccionada();
    const all = this.proyectosService.getProyectos();
    if (cat === 'Todas') {
      return all;
    }
    return all.filter(p => p.categoria === cat);
  });

  constructor() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  abrirDossier(proyecto: Proyecto): void {
    this.router.navigate(['/proyecto', proyecto.id]);
  }

  solicitarAsesoria(p: Proyecto): void {
    const msg = encodeURIComponent(`Hola Sysmicon, me interesa solicitar información sobre el proyecto ${p.titulo}.`);
    window.open(`https://wa.me/573108459210?text=${msg}`, '_blank');
  }
}
