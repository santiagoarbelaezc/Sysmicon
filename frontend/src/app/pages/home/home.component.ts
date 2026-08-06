import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeroComponent } from '../../shared/hero/hero.component';
import { HeroVideoComponent } from '../../shared/hero-video/hero-video.component';
import { AboutComponent } from '../../shared/about/about.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';
import { BannerCrearplanoComponent } from '../../components/banner-crearplano/banner-crearplano.component';
import { ArchitecturalScrollBlockComponent } from '../../components/architectural-scroll-block/architectural-scroll-block.component';
import { BannerVideoComponent } from '../../components/banner-video/banner-video.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { ContactStepsComponent } from '../../components/contact-steps/contact-steps.component';
import { MissionSectionComponent } from '../../components/mission-section/mission-section.component';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    HeroVideoComponent,
    AboutComponent,
    ProjectCardComponent,
    ProjectsComponent,
    DirectorShowcaseComponent,
    BannerCrearplanoComponent,
    ArchitecturalScrollBlockComponent,
    BannerVideoComponent,
    ServicesSectionComponent,
    ContactStepsComponent,
    MissionSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  readonly proyectosService = inject(ProyectosService);
  readonly router = inject(Router);

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
