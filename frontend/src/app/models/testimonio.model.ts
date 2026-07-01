export interface Testimonio {
  id: string;
  cliente: string;
  puesto: string;
  proyectoNombre: string;
  comentario: string;
  calificacion: number; // 1-5
  fecha: string;
  imagenCliente?: string;
}
