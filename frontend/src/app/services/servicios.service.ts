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
      subtitulo: 'Concepción Espacial y Volumétrica',
      descripcion: 'Concepción espacial de líneas limpias y funcionalidad pura. Realizamos estudio bioclimático, análisis del entorno y maquetaje 3D para una arquitectura residencial atemporal.',
      icono: 'architecture',
      destacado: true,
      caracteristicas: [
        'Anteproyecto conceptual y maquetaje 3D interactivo',
        'Planos constructivos de rigor técnico y detalle premium'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Alta Precisión',
      descripcion: 'Ejecución de obra con estándares superiores de ingeniería y mano de obra cualificada. Control presupuestal riguroso, cronograma estricto y garantía estructural absoluta.',
      icono: 'construction',
      destacado: true,
      caracteristicas: [
        'Dirección residente y supervisión continua de ingeniería',
        'Entrega llave en mano con bitácora de control digital'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Renovación y Revitalización',
      descripcion: 'Reinventamos residencias y apartamentos de lujo para adaptarlos al estilo contemporáneo. Optimizamos distribuciones e incorporamos tecnología y acabados de vanguardia.',
      icono: 'remodel',
      destacado: false,
      caracteristicas: [
        'Rediseño arquitectónico de zonas sociales y cocinas gourmet',
        'Optimización térmica, acústica e integración domótica'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Respaldo Técnico y Supervisión',
      descripcion: 'Consultoría especializada y supervisión técnica independiente en proyectos de lujo. Aseguramos el cumplimiento exacto de planos, normas sismorresistentes y estética.',
      icono: 'consulting',
      destacado: false,
      caracteristicas: [
        'Auditoría técnica de presupuestos, contratos y materiales',
        'Informes quincenales de avance y control en sitio'
      ]
    }
  ]);

  getServicios(): Servicio[] {
    return this.serviciosSignal();
  }

  getServicioById(id: string): Servicio | undefined {
    return this.serviciosSignal().find(s => s.id === id);
  }
}
