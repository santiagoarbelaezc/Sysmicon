export interface ContactoForm {
  nombre: string;
  email: string;
  telefono: string;
  tipoServicio: 'Diseño Arquitectónico' | 'Construcción Integral' | 'Remodelación Premium' | 'Asesoría y Supervisión' | 'Otro';
  ubicacionProyecto?: string;
  presupuestoAprox?: string;
  mensaje: string;
  aceptaPoliticas: boolean;
}
