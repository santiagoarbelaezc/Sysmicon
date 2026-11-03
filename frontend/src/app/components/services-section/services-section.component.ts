import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
export class ServicesSectionComponent implements OnInit, OnDestroy {
  readonly serviciosService = inject(ServiciosService);
  readonly servicios = this.serviciosService.getServicios();

  readonly activeServiceIndex = signal<number>(0);
  readonly direction = signal<'next' | 'prev'>('next');
  readonly isPaused = signal<boolean>(false);
  
  private autoPlayTimer: any = null;
  private isWheelThrottled = false;
  private touchStartX = 0;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused()) {
        this.nextService(false);
      }
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  pauseAutoPlay(): void {
    this.isPaused.set(true);
  }

  resumeAutoPlay(): void {
    this.isPaused.set(false);
  }

  nextService(userInitiated = true): void {
    if (userInitiated) this.startAutoPlay();
    this.direction.set('next');
    const total = this.servicios.length;
    this.activeServiceIndex.update(i => (i + 1) % total);
  }

  prevService(): void {
    this.startAutoPlay();
    this.direction.set('prev');
    const total = this.servicios.length;
    this.activeServiceIndex.update(i => (i - 1 + total) % total);
  }

  goToService(index: number): void {
    this.startAutoPlay();
    const currentIndex = this.activeServiceIndex();
    if (index === currentIndex) return;
    this.direction.set(index > currentIndex ? 'next' : 'prev');
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
