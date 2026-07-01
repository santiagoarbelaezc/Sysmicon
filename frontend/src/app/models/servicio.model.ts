export interface Servicio {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  icono: string; // SVG icon path o nombre
  caracteristicas: string[];
  destacado?: boolean;
}
