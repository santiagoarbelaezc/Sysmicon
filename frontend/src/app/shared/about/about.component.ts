import { Component, ElementRef, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';

export interface HitoHistorico {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  projectTag: string;
  image: string;
}

export interface SlideNosotros {
  subtitle: string;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectorShowcaseComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  @ViewChild('stickyWrapper') stickyWrapper?: ElementRef<HTMLElement>;

  activeIndex = 0;

  readonly slides: SlideNosotros[] = [
    {
      subtitle: 'SOBRE NOSOTROS',
      title: 'Arquitectura que trasciende',
      titleHighlight: 'el tiempo',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_900/v1785440099/6c62aa8e-b604-4c3a-a8c2-cb4ac61759a2_czyho0.jpg'
    },
    {
      subtitle: 'NUESTRA FILOSOFÍA',
      title: 'Sobriedad. Función.',
      titleHighlight: 'Autenticidad.',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_900/v1785440100/6df1340c-7691-4ed0-9d57-e8d0f2dc3566_upfx1e.jpg'
    },
    {
      subtitle: 'NUESTRA MISIÓN',
      title: 'Residencias extraordinarias',
      titleHighlight: 'llave en mano',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_900/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg'
    },
    {
      subtitle: 'NUESTRO PROCESO',
      title: 'Liderazgo técnico integral',
      titleHighlight: '360°',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_900/v1785440111/a087b55c-2f1c-48a6-a2cd-80fc99502dc1_p8afun.jpg'
    },
    {
      subtitle: 'EXCELENCIA EN DETALLE',
      title: 'Precisión milimétrica y',
      titleHighlight: 'materialidad noble',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_900/v1785440103/50d3b6d5-e4fb-406f-8515-75f1235a0047_fnb4bu.jpg'
    }
  ];

  readonly timelineEvents: HitoHistorico[] = [
    {
      year: '2018',
      title: 'Fundación de Sysmicon',
      subtitle: 'Orígenes & Rigor Estructural',
      description: 'Nace la firma con una visión clara: integrar el diseño arquitectónico de vanguardia con la ingeniería civil y la consultoría técnica.',
      projectTag: 'Fundación Institucional',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg'
    },
    {
      year: '2019',
      title: 'Hito Volumétrico: Casa S19',
      subtitle: 'Envigado, Antioquia',
      description: 'Consolidación del lenguaje en voladizo panorámico sin apoyos intermedios y grandes cerramientos bioclimáticos.',
      projectTag: 'CASA S19',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440068/DJI_20240427090700_0336_D_kstvtb.jpg'
    },
    {
      year: '2023',
      title: 'Espacios Fluidos: Casa S23',
      subtitle: 'El Retiro, Antioquia',
      description: 'Integración total entre interiores y jardines zen mediante ventanales acristalados de 12 metros de apertura continua.',
      projectTag: 'CASA S23',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg'
    },
    {
      year: '2024',
      title: 'Geometría Minimalista: Casa M & Casa L',
      subtitle: 'Llanogrande & Alto de las Palmas',
      description: 'Cúspide de la materialidad en concreto ocre a la vista, maderas nativas, celosías de control solar y patios reflectantes.',
      projectTag: 'CASA M • CASA L',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785439943/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf_pjfpj8.jpg'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId) || !this.stickyWrapper) return;

    const wrapper = this.stickyWrapper.nativeElement;
    const rect = wrapper.getBoundingClientRect();
    const wrapperHeight = rect.height - window.innerHeight;

    if (wrapperHeight <= 0) return;

    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / wrapperHeight);

    const step = 1 / this.slides.length;
    const index = Math.min(
      this.slides.length - 1,
      Math.floor(progress / step)
    );

    this.activeIndex = index;
  }

  scrollToIndex(index: number): void {
    if (!isPlatformBrowser(this.platformId) || !this.stickyWrapper) return;

    const wrapper = this.stickyWrapper.nativeElement;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const wrapperHeight = wrapper.offsetHeight - window.innerHeight;
    const step = wrapperHeight / this.slides.length;

    const targetScroll = wrapperTop + step * index + 10;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }
}
