import { Injectable, signal, computed } from '@angular/core';
import { EstiloArquitectonico, MaterialAcabado, OpcionEspacio, SolicitudCotizacion } from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class CotizadorService {
  // Catalogo de Estilos
  readonly estilos = signal<EstiloArquitectonico[]>([
    {
      id: 'minimalista',
      nombre: 'Minimalista Puro',
      descripcion: 'Volumetría limpia, líneas ortogonales, grandes claros en concreto blanco y ventanales sin marcos visibles.',
      imagen: 'images/principal.jpg',
      precioBaseM2: 1450
    },
    {
      id: 'nordico-moderno',
      nombre: 'Nórdico Cálido',
      descripcion: 'Fusión de arquitectura nórdica con materiales locales: revestimientos abundantes en madera noble, piedra y chimeneas de leña.',
      imagen: 'images/project-roble.png',
      precioBaseM2: 1580
    },
    {
      id: 'contemporaneo-villa',
      nombre: 'Villa Contemporánea',
      descripcion: 'Grandes luces estructurales, aperturas integrales al paisaje, piscinas infinitas y transiciones fluidas interior-exterior.',
      imagen: 'images/project-villa.png',
      precioBaseM2: 1720
    },
    {
      id: 'mediterraneo-zen',
      nombre: 'Mediterráneo Zen',
      descripcion: 'Espacios introspectivos con patios interiores de agua y vegetación, muros estucados en tonos cálidos y pérgolas de madera.',
      imagen: 'images/project-remodelacion.png',
      precioBaseM2: 1520
    }
  ]);

  // Catalogo de Acabados
  readonly materiales = signal<MaterialAcabado[]>([
    {
      id: 'concreto-teca',
      categoria: 'Fachada',
      nombre: 'Concreto Arquitectónico & Teca',
      descripcion: 'Combinación soberbia de concreto expuesto pulido con celosías exteriores de madera teca tratada.',
      multiplicadorPrecio: 1.08,
      destacado: true
    },
    {
      id: 'piedra-natural',
      categoria: 'Fachada',
      nombre: 'Piedra Pizarra & Acero Mate',
      descripcion: 'Revestimiento en piedra natural importada con perfilería estructural de acero en acabado negro mate.',
      multiplicadorPrecio: 1.12
    },
    {
      id: 'vidrio-termico',
      categoria: 'Estructura',
      nombre: 'Acristalamiento Termo-Acústico Low-E',
      descripcion: 'Vidrios de seguridad de piso a techo con control solar UV y máximo aislamiento térmico y acústico.',
      multiplicadorPrecio: 1.15,
      destacado: true
    },
    {
      id: 'pisos-marmol',
      categoria: 'Pisos',
      nombre: 'Mármol Calacatta & Roble Macizo',
      descripcion: 'Zonas sociales en mármol italiano de gran formato y áreas privadas en duela de madera de roble europeo.',
      multiplicadorPrecio: 1.18,
      destacado: true
    },
    {
      id: 'domotica-total',
      categoria: 'Domótica',
      nombre: 'Sistema KNX Domótica Integral',
      descripcion: 'Control inteligente automatizado de iluminación DALI, climatización, cortinas, audio multi-zona y seguridad.',
      multiplicadorPrecio: 1.10,
      destacado: true
    },
    {
      id: 'sostenibilidad-solar',
      categoria: 'Domótica',
      nombre: 'Pack Eco-Sustentable Premium',
      descripcion: 'Paneles solares arquitectónicos, recolección y reciclaje de aguas pluviales y cargador para vehículos eléctricos.',
      multiplicadorPrecio: 1.09
    }
  ]);

  // Estado reactivo de la cotizacion actual
  readonly estiloSeleccionado = signal<EstiloArquitectonico | null>(this.estilos()[0]);
  
  readonly espacioSeleccionado = signal<OpcionEspacio>({
    areaM2: 320,
    habitaciones: 4,
    banos: 4.5,
    incluyePiscina: true,
    incluyeTerraza: true,
    incluyeJardin: true
  });

  readonly acabadosSeleccionados = signal<string[]>(['concreto-teca', 'vidrio-termico', 'domotica-total']);

  // Computed: Presupuesto estimado en USD
  readonly presupuestoEstimado = computed(() => {
    const estilo = this.estiloSeleccionado();
    const espacio = this.espacioSeleccionado();
    const idsAcabados = this.acabadosSeleccionados();
    const catalogoMat = this.materiales();

    if (!estilo) return 0;

    let base = estilo.precioBaseM2 * espacio.areaM2;

    // Multiplicadores por acabados
    let multiplicadorTotal = 1.0;
    for (const id of idsAcabados) {
      const mat = catalogoMat.find(m => m.id === id);
      if (mat) {
        multiplicadorTotal += (mat.multiplicadorPrecio - 1.0);
      }
    }

    let subtotal = base * multiplicadorTotal;

    // Adicionales por zonas exteriores
    if (espacio.incluyePiscina) subtotal += 38000;
    if (espacio.incluyeTerraza) subtotal += 18000;
    if (espacio.incluyeJardin) subtotal += 12000;

    return Math.round(subtotal);
  });

  // Acciones de actualización
  setEstilo(estilo: EstiloArquitectonico): void {
    this.estiloSeleccionado.set(estilo);
  }

  updateEspacio(partial: Partial<OpcionEspacio>): void {
    this.espacioSeleccionado.update(curr => ({ ...curr, ...partial }));
  }

  toggleAcabado(id: string): void {
    this.acabadosSeleccionados.update(list => {
      if (list.includes(id)) {
        return list.filter(item => item !== id);
      } else {
        return [...list, id];
      }
    });
  }

  isAcabadoSeleccionado(id: string): boolean {
    return this.acabadosSeleccionados().includes(id);
  }

  getObjetosAcabadosSeleccionados(): MaterialAcabado[] {
    const ids = this.acabadosSeleccionados();
    return this.materiales().filter(m => ids.includes(m.id));
  }

  generarSolicitudCotizacion(datosCliente: { nombre: string; email: string; telefono: string; ciudad: string; notasAdicionales?: string }): SolicitudCotizacion {
    return {
      estilo: this.estiloSeleccionado(),
      espacio: this.espacioSeleccionado(),
      acabados: this.getObjetosAcabadosSeleccionados(),
      presupuestoEstimado: this.presupuestoEstimado(),
      datosCliente,
      fechaCreacion: new Date().toISOString()
    };
  }
}
