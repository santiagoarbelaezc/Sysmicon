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
      subtitulo: 'Concepción Espacial & Anteproyecto',
      descripcion: 'Concepción de residencias exclusivas que integran topografía, bioclimática y recorridos virtuales inmersivos.',
      icono: 'architecture',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Concepción & Anteproyecto',
      imagen: '/assets/images/casaS19/s19-portada.jpg',
      caracteristicas: [
        'Recorridos virtuales inmersivos en tiempo real',
        'Estudio bioclimático, solar y aprovechamiento de vistas',
        'Planimetría ejecutiva para licencia y obra'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Obra Llave en Mano',
      descripcion: 'Ejecución de obra civil llave en mano con dirección residente de élite, presupuesto blindado y rigor técnico.',
      icono: 'construction',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Ingeniería & Ejecución',
      imagen: '/assets/images/casaL/CasaL-portada.jpg',
      caracteristicas: [
        'Presupuesto blindado y cronograma garantizado',
        'Cálculo estructural con alta sismorresistencia',
        'Entrega llave en mano con garantía de 10 años'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Renovación & Revalorización Premium',
      descripcion: 'Transformación integral de propiedades existentes en residencias contemporáneas con acabados de clase mundial.',
      icono: 'remodel',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Transformación & Acabados',
      imagen: '/assets/images/casaS23/S23-1.png',
      caracteristicas: [
        'Diagnóstico y reforzamiento estructural especializado',
        'Integración de domótica, sonido y eficiencia energética',
        'Acabados de importación en cocinas gourmet y baños spa'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Supervisión Técnica & Financiera',
      descripcion: 'Auditoría técnica neutral y supervisión financiera para proteger y maximizar el valor de tu inversión constructiva.',
      icono: 'consulting',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Auditoría & Supervisión',
      imagen: '/assets/images/imagen6.jpg',
      caracteristicas: [
        'Interventoría técnica, administrativa y financiera',
        'Evaluación de viabilidad antes de la compra de lotes',
        'Peritaje de calidad y recepción bajo normas NSR-10'
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
