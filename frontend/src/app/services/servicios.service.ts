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
      descripcion: 'Transformamos tu visión en un diseño arquitectónico extraordinario. Realizamos un estudio riguroso del terreno, asoleamiento y necesidades familiares para crear viviendas de líneas limpias, máxima funcionalidad y estética atemporal.',
      icono: 'architecture', // Icon identifier
      destacado: true,
      caracteristicas: [
        'Anteproyecto conceptual con maquetaje 3D interactivo',
        'Diseño bioclimático y optimización de luz natural',
        'Planos arquitectónicos de detalle constructivo premium',
        'Selección curada de acabados y especificaciones técnicas'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Alta Precisión',
      descripcion: 'Hacemos realidad el proyecto con los más altos estándares de ingeniería y mano de obra cualificada. Gestionamos integralmente la obra para garantizar una ejecución impecable, cumplimiento estricto del cronograma y control presupuestal absoluto.',
      icono: 'construction',
      destacado: true,
      caracteristicas: [
        'Dirección residente y supervisión continua de ingeniería',
        'Uso de concretos de alta resistencia y materiales certificados',
        'Control de calidad en cada fase constructiva con bitácora digital',
        'Entrega llave en mano con garantía de calidad estructural'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Renovación y Revitalización',
      descripcion: 'Reinventamos residencias existentes y apartamentos de lujo para adaptarlos al estilo de vida contemporáneo. Optimizamos distribuciones, renovamos redes hidráulicas y eléctricas e incorporamos acabados y tecnología de última generación.',
      icono: 'remodel',
      destacado: false,
      caracteristicas: [
        'Diagnóstico estructural y patología arquitectónica previa',
        'Rediseño de zonas sociales, cocinas gourmet y baños de spa',
        'Insonorización y mejora en eficiencia térmica de la vivienda',
        'Ejecución limpia y minimización de impactos en copropiedades'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Respaldo Técnico y Supervisión',
      descripcion: 'Brindamos consultoría especializada y supervisión técnica independiente para proyectos en curso. Aseguramos que la obra cumpla al 100% con los planos, las normas sismorresistentes y la calidad estética exigida en proyectos residenciales de lujo.',
      icono: 'consulting',
      destacado: false,
      caracteristicas: [
        'Auditoría técnica de presupuestos y contratos de construcción',
        'Verificación de especificaciones y calidad de materiales en obra',
        'Informes quincenales de avance y alertas preventivas',
        'Acompañamiento en recibo de zonas comunes y garantías'
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
