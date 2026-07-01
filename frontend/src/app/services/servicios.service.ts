import { Injectable, signal } from '@angular/core';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  readonly serviciosSignal = signal<Servicio[]>([
    {
      id: 'diseno-arquitectonico',
      titulo: 'Diseño Arquitectónico',
      subtitulo: 'Concepción Espacial',
      descripcion: 'Estudio del terreno, luz natural y maquetaje 3D para residencias atemporales.',
      icono: 'architecture',
      destacado: true,
      caracteristicas: []
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Obra',
      descripcion: 'Ingenería de precisión, control presupuestal riguroso y entrega llave en mano.',
      icono: 'construction',
      destacado: true,
      caracteristicas: []
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Renovación Premium',
      descripcion: 'Transformación arquitectónica de residencias con tecnología y acabados de vanguardia.',
      icono: 'remodel',
      destacado: false,
      caracteristicas: []
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Supervisión Técnica',
      descripcion: 'Auditoría, control de calidad y respaldo técnico en obras de lujo.',
      icono: 'consulting',
      destacado: false,
      caracteristicas: []
    }
  ]);

  getServicios(): Servicio[] {
    return this.serviciosSignal();
  }

  getServicioById(id: string): Servicio | undefined {
    return this.serviciosSignal().find(s => s.id === id);
  }
}
