import { Injectable, signal } from '@angular/core';
import { Testimonio } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class TestimoniosService {
  readonly testimoniosSignal = signal<Testimonio[]>([
    {
      id: 'test-1',
      cliente: 'Carlos E. Restrepo',
      puesto: 'Propietario Residencial',
      proyectoNombre: 'Villa Serena, Llanogrande',
      comentario: 'Trabajar con Sysmicon transformó por completo nuestra idea de construir una casa. Su nivel de detalle, desde la selección de la teca hasta la precisión en el concreto blanco, superó todas nuestras expectativas. Es un verdadero hogar que se siente en paz con la naturaleza.',
      calificacion: 5,
      fecha: 'Enero 2024'
    },
    {
      id: 'test-2',
      cliente: 'Dra. Patricia Mejía',
      puesto: 'Inversionista Bienes Raíces',
      proyectoNombre: 'Residencia Roble, Envigado',
      comentario: 'Lo que más destaco de Sysmicon es la transparencia presupuestal y el rigor técnico. Entregaron la obra a tiempo y cada terminación de piedra y madera es perfecta. La calidez y sobriedad del diseño han revalorizado la propiedad significativamente.',
      calificacion: 5,
      fecha: 'Diciembre 2023'
    },
    {
      id: 'test-3',
      cliente: 'Alejandro y Sofía Gómez',
      puesto: 'Propietarios Residenciales',
      proyectoNombre: 'Loft Cielo, El Poblado',
      comentario: 'Queríamos un diseño minimalista pero muy cálido para nuestro penthouse, y Sysmicon entendió exactamente esa sensibilidad. El muro de concreto expuesto en la sala y el diseño lumínico son la admiración de todos nuestros invitados.',
      calificacion: 5,
      fecha: 'Marzo 2024'
    }
  ]);

  getTestimonios(): Testimonio[] {
    return this.testimoniosSignal();
  }
}
