import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProyectosService, optimizeCloudinary } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';
import { BannerVideoComponent } from '../banner-video/banner-video.component';
import { PhotoCollageComponent, CollageItem } from '../photo-collage/photo-collage.component';
import AOS from 'aos';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerVideoComponent, PhotoCollageComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements AfterViewInit {
  private readonly proyectosService = inject(ProyectosService);
  private readonly router = inject(Router);

  readonly proyectos = this.proyectosService.proyectosDestacados;

  // 12 imágenes seleccionadas — 3 por proyecto — para el collage editorial
  readonly galleryItems: CollageItem[] = [
    // Casa M — Interior, Exterior, Detalle
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439939/c43394b0-0473-41e9-80c5-62d17fc7f4cb_urtyhv.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439934/297313dd-f03c-41f9-a599-66aa95bbe707_btpq79.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439927/686baa17-10c8-4ac7-a3bf-74d1b4e0e3fb_uxs66r.jpg', 1200), projectLabel: 'CASA M', projectId: 'casaM' },
    // Casa S19 — Vista aérea, Voladizo, Interior
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440075/DJI_20240527083954_0365_D_fpxe5f.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440052/20240624_154845_h2bf0e.jpg', 1200), projectLabel: 'CASA S19', projectId: 'casaS19' },
    // Casa S23 — Jardín, Interior fluido, Detalle materialidad
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440100/6df1340c-7691-4ed0-9d57-e8d0f2dc3566_upfx1e.jpg', 1200), projectLabel: 'CASA S23', projectId: 'casaS23' },
    // Casa L — Piscina reflectante, Concreto & madera, Fachada
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439880/b2a056c1-0a5b-4aee-ab44-d1f868266cd8_xuvvnz.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439875/390124c1-e70a-4713-b438-ada6247d4363_adxqt1.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
    { url: optimizeCloudinary('https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439869/0515c974-72ed-4747-a2b4-400fc4a61610_zz7mu0.jpg', 1200), projectLabel: 'CASA L', projectId: 'casaL' },
  ];

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

