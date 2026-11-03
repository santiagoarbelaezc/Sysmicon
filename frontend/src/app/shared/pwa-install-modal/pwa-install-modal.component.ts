import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

export interface StepInfo {
  numero: number;
  titulo: string;
  subtitulo: string;
  instruccion: string;
  badge: string;
}

@Component({
  selector: 'app-pwa-install-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install-modal.component.html',
  styleUrl: './pwa-install-modal.component.css'
})
export class PwaInstallModalComponent implements OnInit {
  readonly pwaService = inject(PwaService);

  readonly platform = signal<'ios' | 'android'>('ios');
  readonly currentStep = signal<number>(0);

  private touchStartX = 0;
  private touchStartY = 0;

  readonly iosSteps: StepInfo[] = [
    {
      numero: 1,
      titulo: 'Abrir en Safari',
      subtitulo: 'Navegador Oficial iOS',
      instruccion: 'Abre sysmicon.com directamente desde el navegador Safari en tu iPhone o iPad.',
      badge: 'Paso 1 de 4'
    },
    {
      numero: 2,
      titulo: 'Boton Compartir',
      subtitulo: 'Menú de Safari',
      instruccion: 'Presiona el botón "Compartir" (el ícono de un cuadrado con una flecha hacia arriba ⎋) en la barra inferior de Safari.',
      badge: 'Paso 2 de 4'
    },
    {
      numero: 3,
      titulo: 'Agregar a Inicio',
      subtitulo: 'Opción del Menú',
      instruccion: 'Desliza las opciones hacia abajo y selecciona "Agregar a la pantalla de inicio" (o "Add to Home Screen" ➕).',
      badge: 'Paso 3 de 4'
    },
    {
      numero: 4,
      titulo: 'Confirmar e Instalar',
      subtitulo: 'App en tu iPhone',
      instruccion: 'Toca "Agregar" en la esquina superior derecha. ¡Listo! La App de Sysmicon quedará instalada en tu pantalla.',
      badge: 'Paso 4 de 4'
    }
  ];

  readonly androidSteps: StepInfo[] = [
    {
      numero: 1,
      titulo: 'Abrir en Chrome',
      subtitulo: 'Navegador Recomendado',
      instruccion: 'Abre sysmicon.com desde Google Chrome, Edge o Samsung Internet en tu celular Android.',
      badge: 'Paso 1 de 4'
    },
    {
      numero: 2,
      titulo: 'Menú de Opciones',
      subtitulo: 'Tres Puntos Superiores',
      instruccion: 'Toca los tres puntos (⋮) en la esquina superior derecha del navegador.',
      badge: 'Paso 2 de 4'
    },
    {
      numero: 3,
      titulo: 'Instalar Aplicación',
      subtitulo: 'Instalador PWA',
      instruccion: 'Selecciona la opción "Instalar aplicación" o "Agregar a la pantalla principal" 📲.',
      badge: 'Paso 3 de 4'
    },
    {
      numero: 4,
      titulo: 'Disfrutar la App',
      subtitulo: 'Acceso Instantáneo',
      instruccion: 'Presiona "Instalar". La app se abrirá en pantalla completa sin barra de navegación.',
      badge: 'Paso 4 de 4'
    }
  ];

  ngOnInit(): void {
    if (this.pwaService.isAndroid()) {
      this.platform.set('android');
    } else {
      this.platform.set('ios');
    }
  }

  setPlatform(p: 'ios' | 'android'): void {
    this.platform.set(p);
    this.currentStep.set(0);
  }

  get activeSteps(): StepInfo[] {
    return this.platform() === 'ios' ? this.iosSteps : this.androidSteps;
  }

  get currentStepData(): StepInfo {
    const steps = this.activeSteps;
    return steps[this.currentStep() % steps.length];
  }

  siguientePaso(): void {
    const total = this.activeSteps.length;
    this.currentStep.update(idx => (idx + 1) % total);
  }

  anteriorPaso(): void {
    const total = this.activeSteps.length;
    this.currentStep.update(idx => (idx - 1 + total) % total);
  }

  setStepIndex(idx: number): void {
    this.currentStep.set(idx);
  }

  close(): void {
    this.pwaService.closeInstallModal();
  }

  async promptNative(): Promise<void> {
    const installed = await this.pwaService.promptNativeInstall();
    if (installed) {
      this.close();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.pwaService.isModalOpen()) return;
    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowRight') {
      this.siguientePaso();
    } else if (event.key === 'ArrowLeft') {
      this.anteriorPaso();
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (!event.touches[0]) return;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches[0]) return;
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const diffX = endX - this.touchStartX;
    const diffY = endY - this.touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        this.siguientePaso();
      } else {
        this.anteriorPaso();
      }
    }
  }
}
