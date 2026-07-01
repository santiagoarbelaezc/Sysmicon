import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CotizadorService } from '../../services/cotizador.service';
import { EstiloArquitectonico, SolicitudCotizacion } from '../../models/cotizacion.model';

@Component({
  selector: 'app-crea-tu-diseno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crea-tu-diseno.component.html',
  styleUrl: './crea-tu-diseno.component.css'
})
export class CreaTuDisenoComponent {
  readonly cotizador = inject(CotizadorService);
  readonly currentYear = new Date().getFullYear();

  readonly currentStep = signal<number>(1);
  readonly isSubmitted = signal<boolean>(false);
  readonly solicitudResultado = signal<SolicitudCotizacion | null>(null);

  // Formulario de cliente para el Paso 4
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  ciudad: string = 'Medellín';
  notasAdicionales: string = '';

  setStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this.currentStep.set(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.setStep(this.currentStep() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.setStep(this.currentStep() - 1);
    }
  }

  onSelectEstilo(estilo: EstiloArquitectonico): void {
    this.cotizador.setEstilo(estilo);
  }

  onToggleAcabado(id: string): void {
    this.cotizador.toggleAcabado(id);
  }

  onSubmitCotizacion(event: Event): void {
    event.preventDefault();
    if (this.nombre.trim() && this.email.includes('@') && this.telefono.trim()) {
      const res = this.cotizador.generarSolicitudCotizacion({
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        ciudad: this.ciudad,
        notasAdicionales: this.notasAdicionales
      });
      this.solicitudResultado.set(res);
      this.isSubmitted.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  reiniciarConfigurador(): void {
    this.isSubmitted.set(false);
    this.solicitudResultado.set(null);
    this.setStep(1);
  }
}
