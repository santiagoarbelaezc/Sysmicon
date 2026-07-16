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
      descripcion: 'Transformamos tu visión en una obra maestra atemporal. Analizamos la topografía del terreno, la orientación solar y el estilo de vida de tu familia para crear un diseño personalizado con recorridos virtuales inmersivos de ultra precisión.',
      icono: 'architecture',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Concepción & Anteproyecto',
      imagen: '/assets/images/casaS19/s19-portada.jpg',
      caracteristicas: [
        'Modelado arquitectónico inmersivo con recorridos virtuales en tiempo real',
        'Estudio bioclimático, lumínico y aprovechamiento óptimo de vistas',
        'Selección curada de materiales nobles: maderas nativas, piedra y concreto',
        'Planimetría ejecutiva completa para trámites de licencia y obra'
      ]
    },
    {
      id: 'construccion-integral',
      titulo: 'Construcción Integral',
      subtitulo: 'Ejecución de Obra Llave en Mano',
      descripcion: 'Materializamos el diseño con rigor técnico absoluto y disciplina presupuestal ciega. Contamos con dirección residente de élite, mano de obra certificada y un estricto control quincenal que garantiza cero sobrecostos ni demoras.',
      icono: 'construction',
      destacado: true,
      pilarPrincipal: true,
      fase: 'Ingeniería & Ejecución',
      imagen: '/assets/images/casaL/CasaL-portada.jpg',
      caracteristicas: [
        'Presupuesto blindado y cronograma garantizado contractual desde el día 1',
        'Cálculo y sismorresistencia estructural con los más altos estándares',
        'Reportes quincenales transparentes en nube con avance financiero y físico',
        'Entrega llave en mano impecable con garantía estructural por 10 años'
      ]
    },
    {
      id: 'remodelacion-premium',
      titulo: 'Remodelación de Alto Nivel',
      subtitulo: 'Renovación & Revalorización Premium',
      descripcion: 'Intervenimos propiedades residenciales existentes para transformarlas en joyas arquitectónicas contemporáneas. Reconfiguramos espacios, actualizamos redes hidrosanitarias e integramos domótica y acabados de lujo mundial.',
      icono: 'remodel',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Transformación & Acabados',
      imagen: '/assets/images/casaS23/S23-1.png',
      caracteristicas: [
        'Diagnóstico estructural y reforzamiento antisísmico especializado',
        'Integración de sistemas de automatización, sonido y eficiencia energética',
        'Acabados de importación en cocinas gourmet, baños spa y carpintería',
        'Obra limpia y zonificada para generar el menor impacto en tu entorno'
      ]
    },
    {
      id: 'asesoria-supervision',
      titulo: 'Asesoría & Interventoría',
      subtitulo: 'Supervisión Técnica & Financiera',
      descripcion: 'Brindamos respaldo técnico neutral para inversionistas y propietarios que construyen su residencia. Auditamos calidad de materiales, cumplimiento normativo y ejecución presupuestal para proteger el 100% de tu patrimonio.',
      icono: 'consulting',
      destacado: false,
      pilarPrincipal: false,
      fase: 'Auditoría & Supervisión',
      imagen: '/assets/images/imagen6.jpg',
      caracteristicas: [
        'Interventoría técnica, administrativa y contable de proyectos en curso',
        'Evaluación de viabilidad técnica y normativa antes de la compra de lotes',
        'Optimización de costos constructivos mediante valor de ingeniería',
        'Peritaje de calidad y recepción de obras bajo normas NSR-10'
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
