import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent {
  readonly serviciosService = inject(ServiciosService);
  readonly servicios = this.serviciosService.getServicios();

  readonly activeServiceIndex = signal<number>(0);
  
  private isWheelThrottled = false;
  private touchStartX = 0;

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
}
