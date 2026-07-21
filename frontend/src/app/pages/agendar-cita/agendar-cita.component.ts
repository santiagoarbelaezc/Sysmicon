import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface TipoConsulta {
  id: string;
  titulo: string;
  subtitulo: string;
  duracion: string;
  modalidad: string;
  icono: string;
  destacado?: boolean;
}

export interface HorarioDisponible {
  hora: string;
  periodo: string;
  disponible: boolean;
}

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.css'
})
export class AgendarCitaComponent {
  pasoActual = signal<number>(1);
  citaConfirmada = signal<boolean>(false);

  tiposConsulta: TipoConsulta[] = [
    {
      id: 'diseno-arquitectonico',
      titulo: 'Diseño Arquitectónico Personalizado',
      subtitulo: 'Concepción integral de tu vivienda, distribución espacial, bioclíma y renders 3D de alta fidelidad.',
      duracion: '60 Minutos',
      modalidad: 'Presencial / Virtual',
      icono: '🏛️',
      destacado: true
    },
    {
      id: 'factibilidad-lote',
      titulo: 'Evaluación de Lote & Normativa',
      subtitulo: 'Análisis topográfico preliminar, viabilidad de servicios, retiros y máximo aprovechamiento.',
      duracion: '45 Minutos',
      modalidad: 'Presencial / Virtual',
      icono: '📐'
    },
    {
      id: 'ejecucion-obra',
      titulo: 'Dirección & Ejecución de Obra',
      subtitulo: 'Revisión técnica de cronogramas, presupuesto de construcción, materiales y garantías de entrega.',
      duracion: '60 Minutos',
      modalidad: 'Presencial / Virtual',
      icono: '🏗️'
    },
    {
      id: 'asesoria-financiera',
      titulo: 'Estructuración Presupuestal VIP',
      subtitulo: 'Modelación de costos de inversión, flujos de caja y planeación financiera por etapas de obra.',
      duracion: '45 Minutos',
      modalidad: 'Virtual VIP',
      icono: '💎'
    }
  ];

  consultaSeleccionada = signal<TipoConsulta | null>(this.tiposConsulta[0]);
  
  // Días de ejemplo para el calendario
  diasMes: { dia: number; fechaCompleta: string; nombreDia: string; disponible: boolean }[] = [];
  diaSeleccionado = signal<string>('');
  horaSeleccionada = signal<string>('10:00 AM');
  modalidadSeleccionada = signal<'Presencial' | 'Virtual'>('Presencial');

  horarios: HorarioDisponible[] = [
    { hora: '08:30', periodo: 'AM', disponible: true },
    { hora: '10:00', periodo: 'AM', disponible: true },
    { hora: '11:30', periodo: 'AM', disponible: true },
    { hora: '02:00', periodo: 'PM', disponible: true },
    { hora: '03:30', periodo: 'PM', disponible: false },
    { hora: '05:00', periodo: 'PM', disponible: true }
  ];

  citaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.citaForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      ubicacionLote: [''],
      presupuestoEstimado: ['500M - 1.200M COP'],
      notasAdicionales: ['']
    });

    this.generarDiasCalendario();
  }

  private generarDiasCalendario(): void {
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();
    for (let i = 1; i <= 14; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      const diaSemana = fecha.getDay();
      
      // No domingos
      if (diaSemana !== 0) {
        const strFecha = `${fecha.getFullYear()}-${(fecha.getMonth()+1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        const item = {
          dia: fecha.getDate(),
          fechaCompleta: strFecha,
          nombreDia: nombresDias[diaSemana],
          disponible: i % 5 !== 0 // simular que algunos días están llenos
        };
        this.diasMes.push(item);
        if (!this.diaSeleccionado() && item.disponible) {
          this.diaSeleccionado.set(item.fechaCompleta);
        }
      }
    }
  }

  seleccionarConsulta(consulta: TipoConsulta): void {
    this.consultaSeleccionada.set(consulta);
  }

  seleccionarDia(fecha: string, disponible: boolean): void {
    if (disponible) {
      this.diaSeleccionado.set(fecha);
    }
  }

  seleccionarHora(horaCompleta: string, disponible: boolean): void {
    if (disponible) {
      this.horaSeleccionada.set(horaCompleta);
    }
  }

  setModalidad(mod: 'Presencial' | 'Virtual'): void {
    this.modalidadSeleccionada.set(mod);
  }

  avanzarPaso(): void {
    if (this.pasoActual() === 1 && !this.consultaSeleccionada()) {
      return;
    }
    if (this.pasoActual() === 2 && (!this.diaSeleccionado() || !this.horaSeleccionada())) {
      return;
    }
    if (this.pasoActual() === 3 && this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }
    if (this.pasoActual() === 3 && this.citaForm.valid) {
      this.citaConfirmada.set(true);
    }
    if (this.pasoActual() < 4) {
      this.pasoActual.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  retrocederPaso(): void {
    if (this.pasoActual() > 1 && !this.citaConfirmada()) {
      this.pasoActual.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  reiniciarAgendamiento(): void {
    this.citaConfirmada.set(false);
    this.pasoActual.set(1);
    this.citaForm.reset({ presupuestoEstimado: '500M - 1.200M COP' });
  }

  get resumenFecha(): string {
    const f = this.diaSeleccionado();
    if (!f) return '';
    const d = new Date(f + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
