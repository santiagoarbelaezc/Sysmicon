export interface EstiloArquitectonico {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precioBaseM2: number; // USD por m2
}

export interface MaterialAcabado {
  id: string;
  categoria: 'Estructura' | 'Fachada' | 'Pisos' | 'Domótica';
  nombre: string;
  descripcion: string;
  multiplicadorPrecio: number; // e.g., 1.0 (base), 1.15 (+15%), etc.
  destacado?: boolean;
}

export interface OpcionEspacio {
  areaM2: number;
  habitaciones: number;
  banos: number;
  incluyePiscina: boolean;
  incluyeTerraza: boolean;
  incluyeJardin: boolean;
}

export interface SolicitudCotizacion {
  estilo: EstiloArquitectonico | null;
  espacio: OpcionEspacio;
  acabados: MaterialAcabado[];
  presupuestoEstimado: number;
  datosCliente: {
    nombre: string;
    email: string;
    telefono: string;
    ciudad: string;
    notasAdicionales?: string;
  };
  fechaCreacion: string;
}
