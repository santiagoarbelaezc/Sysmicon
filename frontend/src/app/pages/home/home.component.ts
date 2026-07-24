import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeroComponent } from '../../shared/hero/hero.component';
import { HeroVideoComponent } from '../../shared/hero-video/hero-video.component';
import { AboutComponent } from '../../shared/about/about.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';
import { BannerCrearplanoComponent } from '../../components/banner-crearplano/banner-crearplano.component';
import { ProyectosService } from '../../services/proyectos.service';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    HeroVideoComponent,
    AboutComponent,
    ServiceCardComponent,
    ProjectCardComponent,
    ProjectsComponent,
    DirectorShowcaseComponent,
    BannerCrearplanoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  readonly proyectosService = inject(ProyectosService);
  readonly serviciosService = inject(ServiciosService);
  readonly router = inject(Router);

  readonly servicios = this.serviciosService.getServicios();
  readonly categorias = this.proyectosService.getCategorias();

  ngAfterViewInit(): void {
    if (this.router.url.includes('/proyectos')) {
      setTimeout(() => {
        const el = document.getElementById('proyectos');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  onSelectCategoria(cat: string): void {
    this.proyectosService.setCategoria(cat);
  }
}
