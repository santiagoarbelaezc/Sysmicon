import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG } from '../../core/app.constants';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  readonly brand = BRAND_CONFIG;

  readonly equipo = [
    {
      nombre: 'Arq. Santiago Arbelaez C.',
      cargo: 'Director General & Socio Fundador',
      bio: 'Arquitecto por la Universidad Nacional con Maestría en Diseño Bioclimático en Barcelona. Lidera la visión conceptual de Sysmicon desde su fundación en 2011.',
      especialidad: 'Volumetría & Concreto Arquitectónico'
    },
    {
      nombre: 'Arq. Valeria Saldarriaga',
      cargo: 'Directora de Diseño Interior & Acabados',
      bio: 'Especialista en arquitectura interior residencial de lujo. Su enfoque se centra en la ergonomía espacial, la selección curada de maderas y la iluminación escénica.',
      especialidad: 'Mobiliario a Medida & Materialidad'
    },
    {
      nombre: 'Ing. Mateo Echeverri',
      cargo: 'Director de Ingeniería & Construcción',
      bio: 'Ingeniero Civil con amplia experiencia en dirección de obras residenciales de alta exigencia, cálculo estructural de grandes luces y gestión BIM.',
      especialidad: 'Estructuras Sismorresistentes & Control de Obra'
    }
  ];

  readonly pilaresMetodologia = [
    {
      etapa: '01',
      titulo: 'Inmersión & Conceptualización',
      desc: 'Entendemos tu estilo de vida, exploramos las fortalezas del lote y desarrollamos el anteproyecto en modelado 3D interactivo.'
    },
    {
      etapa: '02',
      titulo: 'Ingeniería & Rigor Presupuestal',
      desc: 'Realizamos todos los estudios técnicos (suelos, cálculo estructural, bioclimática) y blindamos el presupuesto desde antes del primer ladrillo.'
    },
    {
      etapa: '03',
      titulo: 'Ejecución Impecable',
      desc: 'Construimos bajo dirección residente con mano de obra de élite, reportes quincenales transparentes y estricto control de calidad.'
    },
    {
      etapa: '04',
      titulo: 'Entrega Llave en Mano',
      desc: 'Entregamos tu hogar perfecto, limpio, con todos los sistemas probados (domótica, hidrosanitaria) y garantía estructural de 10 años.'
    }
  ];
}
