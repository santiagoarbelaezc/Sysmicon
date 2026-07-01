import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG } from '../../core/app.constants';

export interface HeroSlide {
  image: string;
  title: string;
  location: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly brand = BRAND_CONFIG;

  readonly slides: HeroSlide[] = [
    { image: 'images/hero.png', title: 'Residencia Principal', location: 'Llanogrande, Medellín' },
    { image: 'images/project-villa.png', title: 'Villa Serena', location: 'El Retiro, Antioquia' },
    { image: 'images/project-roble.png', title: 'Casa Roble', location: 'Alto de las Palmas' },
    { image: 'images/project-loft.png', title: 'Loft Cielo', location: 'El Poblado, Medellín' },
    { image: 'images/project-remodelacion.png', title: 'Interior Zen & Mármol', location: 'Envigado, Antioquia' }
  ];

  readonly currentSlide = signal<number>(0);
  private timerId: any;

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  startCarousel(): void {
    this.stopCarousel();
    this.timerId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopCarousel(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  nextSlide(): void {
    this.currentSlide.update(val => (val + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.currentSlide.update(val => (val - 1 + this.slides.length) % this.slides.length);
  }

  setSlide(index: number): void {
    this.currentSlide.set(index);
    this.startCarousel(); // reset timer on manual interaction
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
