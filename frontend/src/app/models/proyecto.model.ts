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
  // Propiedades Editoriales para Galería Tipo Catálogo / Revista
  editorialTitle?: string;
  editorialSubtitle?: string;
  editorialSlogan?: string;
  editorialBadge?: string;
  editorialStyle?: 'coral-title' | 'white-bold' | 'ribbon-tag' | 'split-grid';
  barcode?: string;
  imagenesAdicionales?: string[];
}
