export type CategoriaProyecto = 'Residencial' | 'Remodelación' | 'Arquitectura interior' | 'Oficina';

export interface Proyecto {
  id: string;
  titulo: string;
  categoria: CategoriaProyecto;
  subtitulo: string;
  descripcion: string;
  imagenUrl: string;
  area: number; // m²
  anio: number;
  ubicacion: string;
  destacado: boolean;
  caracteristicas: string[];
}
