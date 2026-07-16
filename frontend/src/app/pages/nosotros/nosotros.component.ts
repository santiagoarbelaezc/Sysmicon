import { Component, HostListener } from '@angular/core';
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

  readonly hitos = [
    {
      year: '2011',
      titulo: 'Fundación de Sysmicon',
      desc: 'El arquitecto Santiago Arbeláez inicia el estudio en Medellín, estableciendo los principios de volumetría sobria, honestidad en los materiales y luz como materia prima.'
    },
    {
      year: '2015',
      titulo: 'Primer Hito Residencial',
      desc: 'Construcción y entrega de la Casa S19 en el Oriente Antioqueño, captando la atención nacional por su diseño suspendido y bioclimático integrado a la topografía.'
    },
    {
      year: '2018',
      titulo: 'Modelo Integral de Entrega',
      desc: 'Revolucionamos la práctica local al integrar la Ingeniería Civil y el Diseño de Interiores bajo una única gerencia técnica, garantizando plazos y presupuestos ciegos.'
    },
    {
      year: '2022',
      titulo: 'Metodología BIM & Precisión Ejecutiva',
      desc: 'Adoptamos metodologías colaborativas de alta precisión e interventoría técnica digitalizada para optimizar costos y tiempos en cada obra.'
    },
    {
      year: '2026',
      titulo: 'Consolidación Premium',
      desc: 'Reconocidos como el estudio de referencia residencial de alto standing en Antioquia, con más de 25 obras exclusivas habitadas y 100% de cumplimiento técnico.'
    }
  ];

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
      titulo: 'Inmersión & Asesoría Conceptual',
      desc: 'Entendemos tu estilo de vida, exploramos las fortalezas del lote y conceptualizamos el anteproyecto arquitectónico con asesoría senior a la medida.',
      img: '/images/imagen1.jpg'
    },
    {
      etapa: '02',
      titulo: 'Ingeniería & Rigor Presupuestal',
      desc: 'Realizamos todos los estudios técnicos (suelos, cálculo estructural, bioclimática) y blindamos el presupuesto desde antes del primer ladrillo.',
      img: '/images/imagen2.jpg'
    },
    {
      etapa: '03',
      titulo: 'Ejecución Impecable',
      desc: 'Construimos bajo dirección residente con mano de obra de élite, reportes quincenales transparentes y estricto control de calidad.',
      img: '/images/imagen3.jpg'
    },
    {
      etapa: '04',
      titulo: 'Entrega Llave en Mano',
      desc: 'Entregamos tu hogar perfecto, limpio, con todos los sistemas probados (domótica, hidrosanitaria) y garantía estructural de 10 años.',
      img: '/images/imagen4.jpg'
    }
  ];
}
