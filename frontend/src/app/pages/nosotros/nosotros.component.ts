import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG } from '../../core/app.constants';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectorShowcaseComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  readonly brand = BRAND_CONFIG;

  readonly hitos = [
    {
      year: '2018',
      titulo: 'Fundación de Sysmicon',
      desc: 'Inicio de operaciones en Medellín con el compromiso de integrar el diseño sobrio, el cálculo estructural y la honestidad en los materiales.',
      projectTag: 'Fundación Institucional',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg'
    },
    {
      year: '2019',
      titulo: 'Casa S19 • Volumetría Suspendida',
      desc: 'Construcción y entrega de la Casa S19 en Envigado, destacada por su voladizo panorámico y diseño bioclimático pasivo.',
      projectTag: 'CASA S19',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440068/DJI_20240427090700_0336_D_kstvtb.jpg'
    },
    {
      year: '2023',
      titulo: 'Casa S23 • Espacios Fluidos',
      desc: 'Apertura total de cerramientos acristalados de 12 metros integrados con jardines zen y terrazas en teca en El Retiro.',
      projectTag: 'CASA S23',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg'
    },
    {
      year: '2024',
      titulo: 'Casa M & Casa L • Residencia de Autor',
      desc: 'Cúspide de la materialidad en concreto ocre a la vista, patios interiores reflectantes y maderas finas en Llanogrande y Alto de las Palmas.',
      projectTag: 'CASA M • CASA L',
      image: 'https://res.cloudinary.com/dsv1gdgya/image/upload/f_auto,q_auto,w_800/v1785439943/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf_pjfpj8.jpg'
    }
  ];

  readonly pilaresMetodologia = [
    {
      etapa: '01',
      titulo: 'Inmersión & Asesoría Conceptual',
      desc: 'Entendemos tu estilo de vida, exploramos las fortalezas del lote y conceptualizamos el anteproyecto arquitectónico con asesoría senior a la medida.'
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
