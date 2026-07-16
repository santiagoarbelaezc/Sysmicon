import { Injectable, signal, computed } from '@angular/core';
import { Proyecto, CategoriaProyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private readonly proyectosSignal = signal<Proyecto[]>([
    {
      id: 'villa-serena',
      titulo: 'Villa Serena',
      subtitulo: 'Residencia de Lujo con Piscina Infinita',
      categoria: 'Residencial',
      descripcion: 'Una majestuosa obra de arquitectura contemporánea que se integra de manera orgánica en la topografía natural. Destaca por su fachada de concreto blanco expuesto, celosías de madera noble y persianas de control solar con automatización integrada.',
      imagenUrl: '/images/project-villa.png',
      area: 640,
      anio: 2024,
      ubicacion: 'Llanogrande, Antioquia',
      destacado: true,
      caracteristicas: [
        'Piscina infinita con borde finlandés',
        'Eficiencia energética con paneles solares invisibles',
        'Carpintería en teca natural de origen sostenible',
        'Domótica KNX de control integral de iluminación y clima'
      ],
      editorialTitle: 'CASA CARMEN',
      editorialSubtitle: 'Fusión entre naturaleza y arq.',
      editorialSlogan: 'TRANSICIÓN ENTRE INTERIOR Y EXTERIOR.',
      editorialStyle: 'coral-title',
      barcode: '0 600229402 1'
    },
    {
      id: 'casa-roble',
      titulo: 'Residencia Roble',
      subtitulo: 'Arquitectura Nórdica Moderna en el Bosque',
      categoria: 'Residencial',
      descripcion: 'Concebida como un santuario privado en medio de pinos centenarios, Casa Roble combina muros de piedra pizarra natural con revestimientos de roble cálido y perfilería de acero en negro mate. Un diseño atemporal que celebra la luz natural del amanecer.',
      imagenUrl: '/images/project-roble.png',
      area: 480,
      anio: 2023,
      ubicacion: 'Envigado, Antioquia',
      destacado: true,
      caracteristicas: [
        'Aislamiento térmico y acústico de estándar europeo',
        'Grandes ventanales de piso a techo sin perfiles centrales',
        'Sistema de recolección y tratamiento de aguas lluvias',
        'Chimenea de doble combustión integrada en muro de piedra'
      ],
      editorialTitle: 'CASA RS',
      editorialSubtitle: 'La casa responde a dos preocupaciones.',
      editorialSlogan: 'PIEDRA COMO SÍNTESIS ESPACIAL.',
      editorialStyle: 'white-bold',
      barcode: '0 600229402 2'
    },
    {
      id: 'loft-cielo',
      titulo: 'Loft Cielo & Penthouse',
      subtitulo: 'Doble Altura y Concreto Arquitectónico',
      categoria: 'Arquitectura interior',
      descripcion: 'Diseño interior de lujo para un penthouse de doble altura. El proyecto articula un salón monumental con chimenea de concreto arquitectónico fundido en sitio y un cielo raso en duela de madera que aporta calidez y una acústica excepcional.',
      imagenUrl: '/images/project-loft.png',
      area: 320,
      anio: 2024,
      ubicacion: 'El Poblado, Medellín',
      destacado: true,
      caracteristicas: [
        'Doble altura de 6.2 metros libres en zona social',
        'Mobiliario arquitectónico hecho a la medida por Sysmicon',
        'Iluminación indirecta con luminarias empotradas sin marco',
        'Terraza jardín con vegetación nativa de bajo mantenimiento'
      ],
      editorialTitle: 'CASA MH',
      editorialSubtitle: 'Las vanguardias resultaron pictóricas.',
      editorialSlogan: 'EL VOLUMEN, LA TEXTURA Y LA LUZ.',
      editorialBadge: '+ NUEVO',
      editorialStyle: 'ribbon-tag',
      barcode: '0 600229402 3'
    },
    {
      id: 'casa-mirador',
      titulo: 'Casa Mirador del Valle',
      subtitulo: 'Volumetría Pura en Concreto y Vidrio',
      categoria: 'Residencial',
      descripcion: 'Una vivienda en voladizo que parece desafiar la gravedad, suspendida sobre una ladera con vistas panorámicas de 270 grados. El uso magistral del concreto arquitectónico pulido y madera de cedro le otorga un carácter majestuoso y sobrio.',
      imagenUrl: 'assets/images/principal.jpg',
      area: 550,
      anio: 2024,
      ubicacion: 'Alto de las Palmas, Medellín',
      destacado: true,
      caracteristicas: [
        'Voladizo estructural de 8 metros sin apoyos visibles',
        'Fachada acristalada con control UV de alto rendimiento',
        'Zona de spa interior con sauna seco en abeto nórdico',
        'Paisajismo integrado que respeta el bosque original'
      ],
      editorialTitle: 'EDI FICIO GP',
      editorialSubtitle: 'GP se ubica en el barrio La Aguacatala.',
      editorialSlogan: 'MEDELLÍN ES COLOR LADRILLO.',
      editorialStyle: 'split-grid',
      barcode: '0 600229402 4',
      imagenesAdicionales: ['assets/images/imagen1.jpg', 'assets/images/imagen2.jpg', 'assets/images/imagen3.jpg']
    },
    {
      id: 'remodelacion-zen',
      titulo: 'Cocina & Salón Gourmet Zen',
      subtitulo: 'Transformación Integral de Alta Gama',
      categoria: 'Remodelación',
      descripcion: 'Renovación completa de una residencia clásica transformándola en un oasis culinario contemporáneo. Combina gabinetes en negro mate anti-huella con una isla escultórica en mármol Calacatta italiano y apertura total hacia un jardín japonés interior.',
      imagenUrl: '/images/project-remodelacion.png',
      area: 180,
      anio: 2023,
      ubicacion: 'La Calera, Bogotá',
      destacado: true,
      caracteristicas: [
        'Isla en mármol Calacatta de 4.2 metros con barra de nogal',
        'Electrodomésticos ocultos panelados con tecnología push-to-open',
        'Transición fluida sin desniveles hacia patio exterior zen',
        'Pisos en porcelanato de gran formato 120x240cm'
      ],
      editorialTitle: 'CASA ZEN',
      editorialSubtitle: 'Transición fluida hacia el jardín interior.',
      editorialSlogan: 'MÁRMOL CALACATTA & NOGAL PURÍSIMO.',
      editorialStyle: 'coral-title',
      barcode: '0 600229402 5'
    },
    {
      id: 'estudio-central',
      titulo: 'Oficinas Boutique Sysmicon',
      subtitulo: 'Espacio de Creación y Arquitectura',
      categoria: 'Oficina',
      descripcion: 'Diseño de nuestras propias oficinas corporativas concebido para fomentar la creatividad, el trabajo colaborativo y la exhibición de materiales nobles a nuestros clientes. Un entorno luminoso con maquetaje y mesas de dibujo artesanal.',
      imagenUrl: '/images/about-studio.png',
      area: 250,
      anio: 2022,
      ubicacion: 'Medellín, Colombia',
      destacado: false,
      caracteristicas: [
        'Mesas colaborativas de roble macizo para revisión de planos',
        'Librería de materiales y muestrario físico de acabados premium',
        'Acústica optimizada con paneles de madera micro-perforada',
        'Iluminación natural maximizada y control de reflejos'
      ],
      editorialTitle: 'STUDIO SM',
      editorialSubtitle: 'Espacio curado para cocreación senior.',
      editorialSlogan: 'ARQUITECTURA SOBRE MESA DE ROBLE.',
      editorialBadge: 'ORIGEN 2022',
      editorialStyle: 'ribbon-tag',
      barcode: '0 600229402 6'
    },
    {
      id: 'finca-el-retiro',
      titulo: 'Finca Campestre El Retiro',
      subtitulo: 'Refugio de Madera y Cristal sobre la Niebla',
      categoria: 'Residencial',
      descripcion: 'Un refugio campestre de alta montaña diseñado para maximizar la relación con los bosques de pino. Cuenta con cubierta en voladizo, terrazas térmicas con chimenea exterior y acabados artesanales en piedra granítica local.',
      imagenUrl: 'assets/images/imagen4.jpg',
      area: 720,
      anio: 2025,
      ubicacion: 'El Retiro, Antioquia',
      destacado: false,
      caracteristicas: [
        'Sistema bioclimático de calefacción pasiva por masa térmica',
        'Zona de pesebreras y picadero arquitectónico integrado',
        'Estructura mixta en acero pesado y madera laminada',
        'Iluminación escénica exterior de bajo impacto ambiental'
      ],
      editorialTitle: 'FINCA RE',
      editorialSubtitle: 'Refugio entre la niebla y la montaña.',
      editorialSlogan: 'ACERO Y PIEDRA NATURAL GRANÍTICA.',
      editorialStyle: 'white-bold',
      barcode: '0 600229402 7'
    },
    {
      id: 'complejo-aurora',
      titulo: 'Complejo Comercial Aurora',
      subtitulo: 'Arquitectura Corporativa y Bodegas Premium',
      categoria: 'Oficina',
      descripcion: 'Diseño e interventoría para un centro corporativo de triple altura y bodegas industriales automatizadas de alto nivel en el corredor logístico occidental.',
      imagenUrl: 'assets/images/imagen5.jpg',
      area: 1850,
      anio: 2025,
      ubicacion: 'Guarne, Antioquia',
      destacado: false,
      caracteristicas: [
        'Fachadas flotantes micro-ventiladas en paneles de aluminio fundido',
        'Control de acceso inteligente biométrico y plazas peatonales verdes',
        'Altura libre industrial de 14 metros para almacenamiento de precisión',
        'Diseño estructural sismorresistente con certificación Leed Gold'
      ],
      editorialTitle: 'AURORA GP',
      editorialSubtitle: 'Hito corporativo y logístico de alto standing.',
      editorialSlogan: 'ALUMINIO FUNDIDO & TRIPLE ALTURA.',
      editorialStyle: 'split-grid',
      barcode: '0 600229402 8',
      imagenesAdicionales: ['assets/images/imagen6.jpg', 'assets/images/imagen1.jpg', 'assets/images/imagen2.jpg']
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
