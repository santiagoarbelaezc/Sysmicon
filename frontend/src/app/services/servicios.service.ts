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
      subtitulo: 'Concepción Espacial Multi-Escala',
      descripcion: 'Diseño arquitectónico integral de hogares, fincas campestres, bodegas industriales y espacios comerciales.',
      icono: 'architecture',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Concepción & Anteproyecto',
      imagen: '/assets/images/casaS19/s19-portada.jpg',
      caracteristicas: [
        'Modelado y recorridos virtuales inmersivos',
        'Estudio bioclimático, solar y aprovechamiento de lotes',
        'Planimetría ejecutiva completa para licencias y obra'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Obra Llave en Mano',
      descripcion: 'Construcción civil y dirección residente para residencias, fincas de recreo, bodegas industriales y oficinas.',
      icono: 'construction',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Ingeniería & Ejecución',
      imagen: '/assets/images/casaL/CasaL-portada.jpg',
      caracteristicas: [
        'Presupuesto blindado y cronograma garantizado',
        'Cálculo y sismorresistencia en todo tipo de estructuras',
        'Entrega llave en mano con garantía estructural de 10 años'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Transformación Residencial & Industrial',
      descripcion: 'Renovación y revalorización integral de casas, fincas, oficinas y naves industriales con acabados premium.',
      icono: 'remodel',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Transformación & Acabados',
      imagen: '/assets/images/casaS23/S23-1.png',
      caracteristicas: [
        'Diagnóstico estructural y reforzamiento antisísmico',
        'Integración de domótica, redes y eficiencia energética',
        'Optimización espacial y acabados de lujo mundial'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Supervisión Técnica & Financiera',
      descripcion: 'Auditoría técnica e interventoría financiera neutral para proteger tu inversión constructiva en cualquier escala.',
      icono: 'consulting',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Auditoría & Supervisión',
      imagen: '/assets/images/imagen6.jpg',
      caracteristicas: [
        'Interventoría técnica, administrativa y contable',
        'Estudio de viabilidad técnica antes de comprar lotes',
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
