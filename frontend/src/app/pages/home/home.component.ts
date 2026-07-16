import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeroComponent } from '../../shared/hero/hero.component';
import { AboutComponent } from '../../shared/about/about.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { TestimonialCardComponent } from '../../components/testimonial-card/testimonial-card.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { TestimoniosComponent } from '../../components/testimonios/testimonios.component';
import { BannerCrearplanoComponent } from '../../components/banner-crearplano/banner-crearplano.component';
import { ProyectosService } from '../../services/proyectos.service';
import { ServiciosService } from '../../services/servicios.service';
import { TestimoniosService } from '../../services/testimonios.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    AboutComponent,
    ServiceCardComponent,
    ProjectCardComponent,
    TestimonialCardComponent,
    ProjectsComponent,
    TestimoniosComponent,
    BannerCrearplanoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  readonly proyectosService = inject(ProyectosService);
  readonly serviciosService = inject(ServiciosService);
  readonly testimoniosService = inject(TestimoniosService);
  readonly router = inject(Router);

  readonly servicios = this.serviciosService.getServicios();
  readonly testimonios = this.testimoniosService.getTestimonios();
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
