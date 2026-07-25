import { Component, inject, AfterViewInit, signal } from '@angular/core';
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
import { ArchitecturalScrollBlockComponent } from '../../components/architectural-scroll-block/architectural-scroll-block.component';
import { BannerVideoComponent } from '../../components/banner-video/banner-video.component';
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
    BannerCrearplanoComponent,
    ArchitecturalScrollBlockComponent,
    BannerVideoComponent
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

  readonly activeServiceIndex = signal<number>(0);
  
  private isWheelThrottled = false;
  private touchStartX = 0;

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

  nextService(): void {
    const total = this.servicios.length;
    this.activeServiceIndex.update(i => (i + 1) % total);
  }

  prevService(): void {
    const total = this.servicios.length;
    this.activeServiceIndex.update(i => (i - 1 + total) % total);
  }

  goToService(index: number): void {
    this.activeServiceIndex.set(index);
  }

  onServicesWheel(event: WheelEvent): void {
    // Exclusivamente para scroll horizontal (deltaX dominante)
    // El scroll vertical normal (deltaY) se ignora por completo para no interferir con la navegación de la página
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 15 || this.isWheelThrottled) {
      return;
    }

    this.isWheelThrottled = true;

    if (event.deltaX > 0) {
      this.nextService();
    } else {
      this.prevService();
    }

    setTimeout(() => {
      this.isWheelThrottled = false;
    }, 450);
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      const touchEndX = event.changedTouches[0].clientX;
      const diff = this.touchStartX - touchEndX;

      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          this.nextService();
        } else {
          this.prevService();
        }
      }
    }
  }

  onSelectCategoria(cat: string): void {
    this.proyectosService.setCategoria(cat);
  }
}
