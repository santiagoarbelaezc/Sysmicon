import { Component, ElementRef, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
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
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440099/6c62aa8e-b604-4c3a-a8c2-cb4ac61759a2_czyho0.jpg'
    },
    {
      subtitle: 'NUESTRA FILOSOFÍA',
      title: 'Sobriedad. Función.',
      titleHighlight: 'Autenticidad.',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440100/6df1340c-7691-4ed0-9d57-e8d0f2dc3566_upfx1e.jpg'
    },
    {
      subtitle: 'NUESTRA MISIÓN',
      title: 'Residencias extraordinarias',
      titleHighlight: 'llave en mano',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg'
    },
    {
      subtitle: 'NUESTRO PROCESO',
      title: 'Liderazgo técnico integral',
      titleHighlight: '360°',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440111/a087b55c-2f1c-48a6-a2cd-80fc99502dc1_p8afun.jpg'
    },
    {
      subtitle: 'EXCELENCIA EN DETALLE',
      title: 'Precisión milimétrica y',
      titleHighlight: 'materialidad noble',
      description: '',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_1920/v1785440103/50d3b6d5-e4fb-406f-8515-75f1235a0047_fnb4bu.jpg'
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
