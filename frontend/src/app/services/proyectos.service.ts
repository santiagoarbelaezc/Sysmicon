import { Injectable, signal, computed } from '@angular/core';
import { Proyecto, CategoriaProyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private readonly proyectosSignal = signal<Proyecto[]>([
    {
      id: 'casaM',
      titulo: 'CASA M',
      subtitulo: 'Geometría minimalista integrada con materiales nobles y luz natural en el Oriente Antioqueño.',
      categoria: 'Residencial',
      descripcion: 'Una majestuosa residencia que celebra el minimalismo y la intimidad en el Oriente Antioqueño. Su volumetría en concreto y maderas nativas genera patios interiores que inundan de luz natural cada espacio social.',
      imagenUrl: '/images/imagen6.jpg',
      area: 520,
      anio: 2024,
      ubicacion: 'Llanogrande, Antioquia',
      destacado: true,
      caracteristicas: [
        'Estructura en concreto a la vista con formaleta de duela',
        'Patio interior central con vegetación endémica',
        'Iluminación arquitectónica indirecta regulada',
        'Aislamiento acústico y térmico de alta especificación'
      ],
      editorialTitle: 'CASA M',
      editorialSubtitle: 'Geometría minimalista e intimidad natural.',
      editorialSlogan: 'CONCRETO Y LUZ NATURAL EN EL ORIENTE.',
      editorialStyle: 'coral-title',
      barcode: '0 600229402 1',
      imagenesAdicionales: [
        '/assets/images/casaM/1.png',
        '/assets/images/casaM/2.png',
        '/assets/images/casaM/3.png',
        '/assets/images/casaM/4.png',
        '/assets/images/casaM/5.png',
        '/assets/images/casaM/6.png'
      ]
    },
    {
      id: 'casaS19',
      titulo: 'CASA S19',
      subtitulo: 'Volumetría suspendida y grandes ventanales con vista panorámica y diseño bioclimático.',
      categoria: 'Residencial',
      descripcion: 'Diseño arquitectónico concebido en voladizo para flotar sobre el paisaje. Con ventanales panorámicos sin perfiles divisorios y un sistema bioclimático pasivo, Casa S19 es un hito de ingeniería residencial.',
      imagenUrl: '/assets/images/casaS19/s19-portada.jpg',
      area: 610,
      anio: 2024,
      ubicacion: 'Envigado, Antioquia',
      destacado: true,
      caracteristicas: [
        'Voladizo estructural panorámico sin apoyos intermedios',
        'Ventanales de piso a techo con control solar térmico',
        'Recolección y filtrado de aguas lluvias integrado',
        'Acabados en piedra natural y roble ahumado'
      ],
      editorialTitle: 'CASA S19',
      editorialSubtitle: 'Volumetría suspendida con vista panorámica.',
      editorialSlogan: 'ARQUITECTURA SUSPENDIDA SOBRE EL BOSQUE.',
      editorialStyle: 'white-bold',
      barcode: '0 600229402 2',
      imagenesAdicionales: [
        '/assets/images/casaS19/S19-2.png',
        '/assets/images/casaS19/S19-3.png',
        '/assets/images/casaS19/S19-4.png',
        '/assets/images/casaS19/S19-5.png',
        '/assets/images/casaS19/S19-6.png',
        '/assets/images/casaS19/S19-7.png',
        '/assets/images/casaS19/S19-8.png'
      ]
    },
    {
      id: 'casaS23',
      titulo: 'CASA S23',
      subtitulo: 'Espacios fluidos que diluyen los límites entre el interior y los jardines exteriores.',
      categoria: 'Residencial',
      descripcion: 'Una obra de líneas continuas donde el interior social se extiende hacia terrazas cubiertas y jardines zen. La carpintería oculta de gran formato permite una apertura total hacia el exterior.',
      imagenUrl: '/assets/images/casaS23/S23-1.png',
      area: 580,
      anio: 2023,
      ubicacion: 'El Retiro, Antioquia',
      destacado: true,
      caracteristicas: [
        'Apertura total de cerramientos acristalados de 12 metros',
        'Jardines interiores y exteriores con paisajismo curado',
        'Suelos continuos en mármol y terrazas en teca',
        'Domótica integral para gestión de aperturas y clima'
      ],
      editorialTitle: 'CASA S23',
      editorialSubtitle: 'Espacios fluidos sin límites entre interior y exterior.',
      editorialSlogan: 'LA TRANSICIÓN FLUIDA DEL ESPACIO RESIDENCIAL.',
      editorialBadge: '+ DESTACADO',
      editorialStyle: 'ribbon-tag',
      barcode: '0 600229402 3',
      imagenesAdicionales: [
        '/assets/images/casaS23/S23-2.png',
        '/assets/images/casaS23/S23-3.png',
        '/assets/images/casaS23/S23-4.png',
        '/assets/images/casaS23/S23-5.png',
        '/assets/images/casaS23/S23-6.png',
        '/assets/images/casaS23/S23-7.png',
        '/assets/images/casaS23/S23-8.png'
      ]
    },
    {
      id: 'casaL',
      titulo: 'CASA L',
      subtitulo: 'Estructura en concreto a la vista combinada con madera fina y acabados artesanales.',
      categoria: 'Residencial',
      descripcion: 'Una pieza arquitectónica en forma de L que articula el área íntima con el ala social alrededor de una piscina reflectante. El concreto ocre y las celosías de madera aportan una identidad sobria y cálida.',
      imagenUrl: '/assets/images/casaL/CasaL-portada.jpg',
      area: 640,
      anio: 2024,
      ubicacion: 'Alto de las Palmas, Medellín',
      destacado: true,
      caracteristicas: [
        'Distribución en L en torno a piscina reflectante central',
        'Celosías motorizadas en madera noble de control solar',
        'Muros de concreto arquitectónico con pigmento cálido',
        'Cocina gourmet italiana conectada al comedor exterior'
      ],
      editorialTitle: 'CASA L',
      editorialSubtitle: 'Concreto a la vista, madera fina y artesanía.',
      editorialSlogan: 'LA GEOMETRÍA EN L SOBRE LA PISCINA REFLECTANTE.',
      editorialStyle: 'split-grid',
      barcode: '0 600229402 4',
      imagenesAdicionales: [
        '/assets/images/casaL/casaL-1.png',
        '/assets/images/casaL/casaL-2.png',
        '/assets/images/casaL/casaL-3.png',
        '/assets/images/casaL/casaL-4.png',
        '/assets/images/casaL/casaL-5.png',
        '/assets/images/casaL/casaL-6.png'
      ]
    },
    {
      id: 'casa-carmen',
      titulo: 'Casa Carmen',
      subtitulo: 'Fusión entre naturaleza y arquitectura contemporánea con espejos de agua.',
      categoria: 'Residencial',
      descripcion: 'Diseñada con grandes volúmenes horizontales que reposan suavemente entre la exuberante vegetación tropical. La casa propone un diálogo poético entre estanques reflectantes, concreto aparente y jardines exuberantes.',
      imagenUrl: '/images/project-villa.png',
      area: 720,
      anio: 2025,
      ubicacion: 'Llanogrande, Antioquia',
      destacado: true,
      caracteristicas: [
        'Espejos de agua perimetrales que regulan la temperatura exterior',
        'Estructura aporticada en concreto blanco arquitectónico',
        'Cubiertas verdes con aislamiento térmico natural',
        'Iluminación escénica integrada en estanques y jardines'
      ],
      editorialTitle: 'CASA CARMEN',
      editorialSubtitle: 'Fusión entre naturaleza y arq.',
      editorialSlogan: 'TRANSICIÓN ENTRE INTERIOR Y EXTERIOR.',
      editorialStyle: 'coral-title',
      barcode: '0 600229402 5',
      imagenesAdicionales: [
        '/assets/images/imagen1.jpg',
        '/assets/images/imagen2.jpg',
        '/assets/images/imagen3.jpg'
      ]
    },
    {
      id: 'edificio-gp',
      titulo: 'Edificio GP',
      subtitulo: 'Hito de arquitectura residencial vertical y ladrillo noble en La Aguacatala.',
      categoria: 'Residencial',
      descripcion: 'Un edificio residencial boutique que honra la tradición arquitectónica del ladrillo en Medellín fusionándola con grandes voladizos en concreto y jardines verticales en cada balcón.',
      imagenUrl: '/assets/images/principal.jpg',
      area: 1450,
      anio: 2025,
      ubicacion: 'La Aguacatala, Medellín',
      destacado: true,
      caracteristicas: [
        'Fachada en ladrillo arquitectónico de alta densidad con celosías',
        'Balcones profundos con vegetación colgante autorregable',
        'Lobby monumental de doble altura con arte fundido en concreto',
        'Sistema de eficiencia energética y aislamiento solar'
      ],
      editorialTitle: 'EDI FICIO GP',
      editorialSubtitle: 'GP se ubica en el barrio La Aguacatala',
      editorialSlogan: 'MEDELLÍN ES COLOR LADRILLO.',
      editorialStyle: 'split-grid',
      barcode: '0 600229402 6',
      imagenesAdicionales: [
        '/assets/images/imagen4.jpg',
        '/assets/images/imagen5.jpg',
        '/images/project-roble.png'
      ]
    }
  ]);

  readonly categoriaSeleccionada = signal<string>('Todas');

  readonly proyectosFiltrados = computed(() => {
    const cat = this.categoriaSeleccionada();
    const lista = this.proyectosSignal();
    if (cat === 'Todas') {
      return lista;
    }
    return lista.filter(p => p.categoria === cat);
  });

  readonly proyectosDestacados = computed(() => {
    return this.proyectosSignal().filter(p => p.destacado);
  });

  getCategorias(): string[] {
    return ['Todas', 'Residencial', 'Remodelación', 'Arquitectura interior', 'Oficina'];
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  getProyectos(): Proyecto[] {
    return this.proyectosSignal();
  }

  getProyectoById(id: string): Proyecto | undefined {
    return this.proyectosSignal().find(p => p.id === id);
  }
}
