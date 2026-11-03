import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonio } from '../../models/testimonio.model';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.css'
})
export class TestimonialCardComponent {
  @Input({ required: true }) testimonio!: Testimonio;
  @Input() index: number = 0;

  getStarsArray(): number[] {
    return Array(this.testimonio.calificacion).fill(0);
  }
}
