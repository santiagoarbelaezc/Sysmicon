import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { TestimoniosService } from '../../services/testimonios.service';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule, TestimonialCardComponent],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent implements OnInit, OnDestroy {
  readonly testimoniosService = inject(TestimoniosService);
  readonly testimonios = this.testimoniosService.getTestimonios();

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
    }, 6000); // Avanzar cada 6 segundos
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
    this.startTestimoniosCarousel(); // resetear temporizador en interacción
  }
}
