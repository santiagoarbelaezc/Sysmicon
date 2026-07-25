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
      descripcion: 'Diseño arquitectónico integral de fincas campestres y residencias contemporáneas de autor.',
      icono: 'architecture',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Concepción & Anteproyecto',
      imagen: 'assets/images/FOTOGRAFIA-CASA L/9245d22d-26fa-469c-aa3c-429fc0825f55.JPG',
      caracteristicas: [
        'Modelado 3D Inmersivo',
        'Estudio Bioclimático',
        'Planimetría Ejecutiva'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución Llave en Mano',
      descripcion: 'Dirección de obra y construcción civil residencial con presupuesto blindado y garantía estructural.',
      icono: 'construction',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Ingeniería & Ejecución',
      imagen: 'assets/images/FOTOGRAFIA-CASA L/85e0f169-2d00-444c-99a8-9ba0ab7c2836.JPG',
      caracteristicas: [
        'Presupuesto Blindado',
        'Cronograma Garantizado',
        'Garantía Estructural'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Transformación Residencial',
      descripcion: 'Renovación integral de espacios campestres y residenciales con acabados de alta gama.',
      icono: 'remodel',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Transformación & Acabados',
      imagen: 'assets/images/FOTOGRAFIA-CASA L/390124c1-e70a-4713-b438-ada6247d4363.JPG',
      caracteristicas: [
        'Reforzamiento Estructural',
        'Domótica e Iluminación',
        'Acabados de Lujo'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Supervisión Técnica',
      descripcion: 'Auditoría técnica e interventoría independiente para proteger tu inversión constructiva.',
      icono: 'consulting',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Auditoría & Supervisión',
      imagen: 'assets/images/FOTOGRAFIA-CASA L/cf9427b0-b774-455f-a0ab-e51c3729d5fb.JPG',
      caracteristicas: [
        'Interventoría de Obra',
        'Viabilidad de Lotes',
        'Recepción NSR-10'
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
