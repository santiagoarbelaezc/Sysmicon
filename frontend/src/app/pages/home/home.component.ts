import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../../shared/hero/hero.component';
import { AboutComponent } from '../../shared/about/about.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { TestimonialCardComponent } from '../../components/testimonial-card/testimonial-card.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
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
    ProjectsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly proyectosService = inject(ProyectosService);
  readonly serviciosService = inject(ServiciosService);
  readonly testimoniosService = inject(TestimoniosService);

  readonly servicios = this.serviciosService.getServicios();
  readonly testimonios = this.testimoniosService.getTestimonios();
  readonly categorias = this.proyectosService.getCategorias();

  // ESTADO DEL CARRUSEL DE TESTIMONIOS
  readonly activeTestimonioIndex = signal<number>(0);
  private testimoniosTimerId: any;

  ngOnInit(): void {
    this.startTestimoniosCarousel();
  }

  ngOnDestroy(): void {
    this.stopTestimoniosCarousel();
  }

  startTestimoniosCarousel(): void {
    this.stopTestimoniosCarousel();
    this.testimoniosTimerId = setInterval(() => {
      this.nextTestimonio();
    }, 6000); // Cambiar cada 6 segundos
  }

  stopTestimoniosCarousel(): void {
    if (this.testimoniosTimerId) {
      clearInterval(this.testimoniosTimerId);
      this.testimoniosTimerId = null;
    }
  }

  nextTestimonio(): void {
    this.activeTestimonioIndex.update(idx => (idx + 1) % this.testimonios.length);
  }

  prevTestimonio(): void {
    this.activeTestimonioIndex.update(idx => (idx - 1 + this.testimonios.length) % this.testimonios.length);
  }

  setTestimonio(index: number): void {
    this.activeTestimonioIndex.set(index);
    this.startTestimoniosCarousel(); // resetear temporizador
  }

  onSelectCategoria(cat: string): void {
    this.proyectosService.setCategoria(cat);
  }
}
