import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG } from '../../core/app.constants';
import { DirectorShowcaseComponent } from '../../components/director-showcase/director-showcase.component';
import AOS from 'aos';

export interface HistoriaNivel {
  id: string;
  numero: string;
  tag: string;
  titulo: string;
  texto: string;
  ubicacion: string;
  videoSrc?: string;
  imagenes: string[];
  tema: 'dark' | 'light';
  posicionClases: string;
  animacionAos: string;
  layoutTipo: 'video-left' | 'video-right' | 'video-center' | 'grid-asymmetric';
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectorShowcaseComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit, AfterViewInit {
  readonly brand = BRAND_CONFIG;

  readonly historiaNiveles: HistoriaNivel[] = [
    {
      id: 'nivel-01',
      numero: '01',
      tag: '01 // MATERIALIDAD & LUZ',
      titulo: 'CONCRETO, LUZ & PAISAJE',
      texto: 'Estructuras monolíticas concebidas a partir de la topografía del lote, donde la luz natural define el espacio y enaltece el entorno.',
      ubicacion: 'LLANOGRANDE • RESIDENCIA CASA M',
      videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017834/sysmi-0_n3fxgd.mp4',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439943/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf_pjfpj8.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439941/e58a67a3-c6b1-48f9-8f07-c1e26511bab0_qfzwzo.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439939/c43394b0-0473-41e9-80c5-62d17fc7f4cb_urtyhv.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439937/bbcec1ca-0b24-40fc-b46a-acb7c676350a_kf7vfn.jpg'
      ],
      tema: 'dark',
      posicionClases: 'left-4 sm:left-10 lg:left-16 bottom-8 sm:bottom-12 lg:bottom-16',
      animacionAos: 'fade-right',
      layoutTipo: 'video-left'
    },
    {
      id: 'nivel-02',
      numero: '02',
      tag: '02 // INGENIERÍA CIVIL',
      titulo: 'VOLUMETRÍAS SUSPENDIDAS',
      texto: 'Voladizos panorámicos y cálculo estructural sismorresistente bajo norma NSR-10 que desafían la gravedad con absoluto rigor.',
      ubicacion: 'ENVIGADO • RESIDENCIA CASA S19',
      videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017819/sysmi-1_mvv1wg.mp4',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440068/DJI_20240427090700_0336_D_kstvtb.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440076/dji_fly_20241221_104148_0591_1734879851956_photo_gmbz05.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440075/DJI_20240527083954_0365_D_fpxe5f.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440069/dji_fly_20241221_104006_0584_1734879871094_photo_v5cyrj.jpg'
      ],
      tema: 'light',
      posicionClases: 'right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-12 lg:bottom-16',
      animacionAos: 'fade-left',
      layoutTipo: 'video-right'
    },
    {
      id: 'nivel-03',
      numero: '03',
      tag: '03 // FLUIDEZ ESPACIAL',
      titulo: 'CERRAMIENTOS & MADERA',
      texto: 'Aperturas continuas hacia el bosque nativo mediante cancelería de gran formato y maderas nobles seleccionadas por su durabilidad.',
      ubicacion: 'EL RETIRO • RESIDENCIA CASA S23',
      videoSrc: 'https://res.cloudinary.com/dsv1gdgya/video/upload/v1785017752/sysmi-5_zakn8v.mp4',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440109/243315d3-e0c8-4791-8f0a-b341587e1c70_eshvqt.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440126/f3909659-36eb-40e5-9288-9667663de071_ajc48x.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440125/efa7fc63-cff7-43b1-a674-e7dbc681e571_clgt0m.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785440122/ea5179e4-6a1a-4fc8-a4da-829c4592c314_t1a9il.jpg'
      ],
      tema: 'dark',
      posicionClases: 'left-4 sm:left-10 lg:left-16 bottom-8 sm:bottom-12 lg:bottom-16',
      animacionAos: 'fade-right',
      layoutTipo: 'video-left'
    },
    {
      id: 'nivel-04',
      numero: '04',
      tag: '04 // LLAVE EN MANO',
      titulo: 'CASA L & RIGOR DE AUTOR',
      texto: 'Diseño, ingeniería civil e interventoría técnica permanente bajo un mismo techo. Presupuesto blindado y fidelidad absoluta al diseño.',
      ubicacion: 'ALTO DE LAS PALMAS • RESIDENCIA CASA L',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439869/0515c974-72ed-4747-a2b4-400fc4a61610_zz7mu0.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439890/0f162d2a-e7d2-486c-b766-9ca67aaac26a_miymg5.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439890/0c533cb5-672a-415b-9c14-67faf621322c_dbgg2b.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1785439889/f1336b8f-9e01-4acd-a702-834368833f38_yiv1pp.jpg'
      ],
      tema: 'light',
      posicionClases: 'right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-12 lg:bottom-16',
      animacionAos: 'fade-left',
      layoutTipo: 'grid-asymmetric'
    }
  ];

  readonly pilaresMetodologia = [
    {
      etapa: '01',
      tag: 'FASE CONCEPTUAL',
      titulo: 'Diseño de Autor',
      desc: 'Anteproyecto 3D a la medida y estudio bioclimático a partir del terreno.'
    },
    {
      etapa: '02',
      tag: 'INGENIERÍA CIVIL',
      titulo: 'Cálculo & Blindaje',
      desc: 'Estructura sismorresistente NSR-10 y presupuesto cerrado sin sobrecostos.'
    },
    {
      etapa: '03',
      tag: 'CONSTRUCCIÓN',
      titulo: 'Dirección Residente',
      desc: 'Supervisión técnica diaria en obra y reportes quincenales transparentes.'
    },
    {
      etapa: '04',
      tag: 'HABITABILIDAD',
      titulo: 'Llave en Mano',
      desc: 'Entrega impecable con sistemas testeados y 10 años de garantía estructural.'
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      try {
        AOS.refresh();
      } catch (e) {}
    }, 200);
  }
}
