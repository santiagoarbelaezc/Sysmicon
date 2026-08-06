import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';
import { BannerVideoComponent } from '../banner-video/banner-video.component';
import AOS from 'aos';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerVideoComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements AfterViewInit {
  private readonly proyectosService = inject(ProyectosService);
  private readonly router = inject(Router);

  readonly proyectos = this.proyectosService.proyectosDestacados;

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        AOS.refreshHard();
      }, 100);
    }
  }

  abrirGaleria(proyecto: Proyecto): void {
    this.router.navigate(['/proyecto', proyecto.id]);
  }

  solicitarAsesoria(p: Proyecto): void {
    const msg = encodeURIComponent(`Hola Sysmicon, me interesa solicitar información sobre el proyecto ${p.titulo}.`);
    window.open(`https://wa.me/573108459210?text=${msg}`, '_blank');
  }
}
