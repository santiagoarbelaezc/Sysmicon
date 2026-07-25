import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';
import { BannerVideoComponent } from '../banner-video/banner-video.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerVideoComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  private readonly proyectosService = inject(ProyectosService);
  private readonly router = inject(Router);

  readonly proyectos = this.proyectosService.proyectosDestacados;

  abrirGaleria(proyecto: Proyecto): void {
    this.router.navigate(['/proyecto', proyecto.id]);
  }

  solicitarAsesoria(p: Proyecto): void {
    const msg = encodeURIComponent(`Hola Sysmicon, me interesa solicitar información sobre el proyecto ${p.titulo}.`);
    window.open(`https://wa.me/573108459210?text=${msg}`, '_blank');
  }
}
