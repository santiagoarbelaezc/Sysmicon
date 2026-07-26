import { Injectable, signal, computed } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private readonly proyectosSignal = signal<Proyecto[]>([
    {
      id: 'casaM',
      titulo: 'CASA M',
      subtitulo: 'Geometría minimalista integrada con materiales nobles y luz natural en el Oriente Antioqueño.',
      categoria: 'Residencial',
      descripcion: 'Una majestuosa residencia que celebra el minimalismo y la intimidad en el Oriente Antioqueño. Su volumetría en concreto y maderas nativas genera patios interiores que inundan de luz natural cada espacio social.',
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA M/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf.JPG',
      area: 520,
      anio: 2024,
      ubicacion: 'Llanogrande, Antioquia',
      destacado: true,
      caracteristicas: [
        'Estructura en concreto a la vista con formaleta de duela',
        'Patio interior central con vegetación endémica',
        'Iluminación arquitectónica indirecta regulada',
        'Aislamiento acústico y térmico de alta especificación'
      ],
      editorialTitle: 'CASA M',
      editorialSubtitle: 'Geometría minimalista e intimidad natural.',
      editorialSlogan: 'CONCRETO Y LUZ NATURAL EN EL ORIENTE.',
      editorialStyle: 'coral-title',
      barcode: '0 600229402 1',
      imagenesAdicionales: [
        'assets/images/FOTOGRAFIA-CASA M/0bb0bfc3-d421-4b92-90ba-1bd3b1600bdf.JPG',
        'assets/images/FOTOGRAFIA-CASA M/1f2f3f7e-396b-45c0-9250-442352720986.JPG',
        'assets/images/FOTOGRAFIA-CASA M/297313dd-f03c-41f9-a599-66aa95bbe707.JPG',
        'assets/images/FOTOGRAFIA-CASA M/303ccd27-bb88-47ce-b5fe-97b86ed90379.JPG',
        'assets/images/FOTOGRAFIA-CASA M/4583317f-0e0a-4255-9c37-2b40bb3f0629.JPG',
        'assets/images/FOTOGRAFIA-CASA M/4998e7bb-5d73-4aad-b29c-c1a2af27c0da.JPG',
        'assets/images/FOTOGRAFIA-CASA M/4fce2d32-af26-4a1c-9da9-caa27c8c1ece.JPG',
        'assets/images/FOTOGRAFIA-CASA M/5328c3e8-19a7-4d93-8440-6729da219436.JPG',
        'assets/images/FOTOGRAFIA-CASA M/5e6cc529-2da2-44d1-92b6-fcba9ebfe698.JPG',
        'assets/images/FOTOGRAFIA-CASA M/6292c992-984d-46a9-b6cb-568093d415b0.JPG',
        'assets/images/FOTOGRAFIA-CASA M/686baa17-10c8-4ac7-a3bf-74d1b4e0e3fb.JPG',
        'assets/images/FOTOGRAFIA-CASA M/71289b8d-db79-4c91-8638-5d20efdf14fb.JPG',
        'assets/images/FOTOGRAFIA-CASA M/73803bf5-ac24-4e52-b27b-3459df040e70.JPG',
        'assets/images/FOTOGRAFIA-CASA M/7a071798-9bc0-4d1d-ad44-673dd10bea3b.JPG',
        'assets/images/FOTOGRAFIA-CASA M/89349079-fa25-49e4-aa1c-541a7bbb869a.JPG',
        'assets/images/FOTOGRAFIA-CASA M/96f8cd1d-4de5-499c-ab01-dcb9a38110cc.JPG',
        'assets/images/FOTOGRAFIA-CASA M/99f1cbe0-505a-4793-937b-5050fb10586f.JPG',
        'assets/images/FOTOGRAFIA-CASA M/9d05c958-46a8-431e-a769-a6025dfecc09.JPG',
        'assets/images/FOTOGRAFIA-CASA M/bbcec1ca-0b24-40fc-b46a-acb7c676350a.JPG',
        'assets/images/FOTOGRAFIA-CASA M/c43394b0-0473-41e9-80c5-62d17fc7f4cb.JPG',
        'assets/images/FOTOGRAFIA-CASA M/c5ecaf9e-6448-41ac-b040-4b4037379c72.JPG',
        'assets/images/FOTOGRAFIA-CASA M/d5ee98a7-11b5-46d7-8475-b06e1b8757f1.JPG',
        'assets/images/FOTOGRAFIA-CASA M/e58a67a3-c6b1-48f9-8f07-c1e26511bab0.JPG',
        'assets/images/FOTOGRAFIA-CASA M/e6700600-7bdd-43e3-95bd-1b501b0daf15.JPG'
      ]
    },
    {
      id: 'casaS19',
      titulo: 'CASA S19',
      subtitulo: 'Volumetría suspendida y grandes ventanales con vista panorámica y diseño bioclimático.',
      categoria: 'Residencial',
      descripcion: 'Diseño arquitectónico concebido en voladizo para flotar sobre el paisaje. Con ventanales panorámicos sin perfiles divisorios y un sistema bioclimático pasivo, Casa S19 es un hito de ingeniería residencial.',
      imagenUrl: 'assets/images/FOTOGRAFIA-S19/0561ea51-063e-4a47-a39b-14b9ca3320eb.JPG',
      area: 610,
      anio: 2024,
      ubicacion: 'Envigado, Antioquia',
      destacado: true,
      caracteristicas: [
        'Voladizo estructural panorámico sin apoyos intermedios',
        'Ventanales de piso a techo con control solar térmico',
        'Recolección y filtrado de aguas lluvias integrado',
        'Acabados en piedra natural y roble ahumado'
      ],
      editorialTitle: 'CASA S19',
      editorialSubtitle: 'Volumetría suspendida con vista panorámica.',
      editorialSlogan: 'ARQUITECTURA SUSPENDIDA SOBRE EL BOSQUE.',
      editorialStyle: 'white-bold',
      barcode: '0 600229402 2',
      imagenesAdicionales: [
        'assets/images/FOTOGRAFIA-S19/0561ea51-063e-4a47-a39b-14b9ca3320eb.JPG',
        'assets/images/FOTOGRAFIA-S19/15fec915-4377-4363-84a3-beacfccd68d7.JPG',
        'assets/images/FOTOGRAFIA-S19/16012be3-e3d6-4d91-abf7-d3f815aa25e7.JPG',
        'assets/images/FOTOGRAFIA-S19/1d6b8e46-c097-42d0-ae6d-ef26346ddd60.JPG',
        'assets/images/FOTOGRAFIA-S19/20240608_113010.jpg',
        'assets/images/FOTOGRAFIA-S19/20240624_154845.jpg',
        'assets/images/FOTOGRAFIA-S19/20241017_155616.jpg',
        'assets/images/FOTOGRAFIA-S19/20241024_090121.jpg',
        'assets/images/FOTOGRAFIA-S19/20241024_090133.jpg',
        'assets/images/FOTOGRAFIA-S19/20241024_090135.jpg',
        'assets/images/FOTOGRAFIA-S19/20241024_090140.jpg',
        'assets/images/FOTOGRAFIA-S19/3aa330ef-5f35-468c-a5d0-cf146ec42a16.JPG',
        'assets/images/FOTOGRAFIA-S19/5ff0a3fe-fab5-4dba-8e60-0f669af6702f.JPG',
        'assets/images/FOTOGRAFIA-S19/6ee72183-052f-4634-920e-c0272de1b610.JPG',
        'assets/images/FOTOGRAFIA-S19/83c57d93-e8eb-4e7d-9f2b-93b005c1d5d8.JPG',
        'assets/images/FOTOGRAFIA-S19/8796c803-aed8-44dc-8827-c06f6f3e992e.JPG',
        'assets/images/FOTOGRAFIA-S19/92859dae-f9b8-48db-b07d-82a21c4e4ca7.JPG',
        'assets/images/FOTOGRAFIA-S19/DJI_20240427090700_0336_D.JPG',
        'assets/images/FOTOGRAFIA-S19/DJI_20240527083954_0365_D.JPG',
        'assets/images/FOTOGRAFIA-S19/adff3913-60cd-4280-af42-cc7f1a641bf3.JPG',
        'assets/images/FOTOGRAFIA-S19/b9c98cbb-a7b1-4b4a-9bdd-e2e40541f7c9.JPG',
        'assets/images/FOTOGRAFIA-S19/bc80a963-20a4-4d90-aab7-1c5ee5064458.JPG',
        'assets/images/FOTOGRAFIA-S19/c63cb955-27fb-4ea1-bddb-83ad3da8cf24.JPG',
        'assets/images/FOTOGRAFIA-S19/c7dd7132-6a05-487c-83e9-c805887eac9c.JPG',
        'assets/images/FOTOGRAFIA-S19/d0183036-7441-4bac-9fff-dde4708b1359.JPG',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_103942_0582_1734879879713_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_103958_0583_1734879874071_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104006_0584_1734879871094_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104014_0585_1734879868298_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104036_0586_1734879865619_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104102_0587_1734879862586_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104118_0588_1734879859742_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/dji_fly_20241221_104148_0591_1734879851956_photo.jpg',
        'assets/images/FOTOGRAFIA-S19/e0b9cce4-38f3-44a0-b858-d007c12c8254.JPG',
        'assets/images/FOTOGRAFIA-S19/e5c09f1b-41c9-44d2-a344-6029aaa3d0ac.JPG',
        'assets/images/FOTOGRAFIA-S19/e654d41f-1f6c-474c-9151-bb3e0f56d8b3.JPG',
        'assets/images/FOTOGRAFIA-S19/e86d7bcb-6acd-4427-a097-c02c545d5e46.JPG',
        'assets/images/FOTOGRAFIA-S19/eb0b02d8-618b-4b22-b5b6-70ff9b1c938d.JPG',
        'assets/images/FOTOGRAFIA-S19/f708bbb3-8ebc-43d5-a605-e1b273c0b95a.JPG',
        'assets/images/FOTOGRAFIA-S19/fc2ca530-2b24-47fd-93e6-1d8501f0929f.JPG'
      ]
    },
    {
      id: 'casaS23',
      titulo: 'CASA S23',
      subtitulo: 'Espacios fluidos que diluyen los límites entre el interior y los jardines exteriores.',
      categoria: 'Residencial',
      descripcion: 'Una obra de líneas continuas donde el interior social se extiende hacia terrazas cubiertas y jardines zen. La carpintería oculta de gran formato permite una apertura total hacia el exterior.',
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA23/243315d3-e0c8-4791-8f0a-b341587e1c70.JPG',
      area: 580,
      anio: 2023,
      ubicacion: 'El Retiro, Antioquia',
      destacado: true,
      caracteristicas: [
        'Apertura total de cerramientos acristalados de 12 metros',
        'Jardines interiores y exteriores con paisajismo curado',
        'Suelos continuos en mármol y terrazas en teca',
        'Domótica integral para gestión de aperturas y clima'
      ],
      editorialTitle: 'CASA S23',
      editorialSubtitle: 'Espacios fluidos sin límites entre interior y exterior.',
      editorialSlogan: 'LA TRANSICIÓN FLUIDA DEL ESPACIO RESIDENCIAL.',
      editorialBadge: '+ DESTACADO',
      editorialStyle: 'ribbon-tag',
      barcode: '0 600229402 3',
      imagenesAdicionales: [
        'assets/images/FOTOGRAFIA-CASA23/243315d3-e0c8-4791-8f0a-b341587e1c70.JPG',
        'assets/images/FOTOGRAFIA-CASA23/419fb599-25f5-4dbc-9bf5-3e325a7190d9.JPG',
        'assets/images/FOTOGRAFIA-CASA23/46150393-72c3-4c55-af5c-2fc3fddd5d16.JPG',
        'assets/images/FOTOGRAFIA-CASA23/50d3b6d5-e4fb-406f-8515-75f1235a0047.JPG',
        'assets/images/FOTOGRAFIA-CASA23/5b32dea6-e4b3-4d14-b2b0-3cc18f67a056.JPG',
        'assets/images/FOTOGRAFIA-CASA23/5b558f90-b7e8-4e87-8d25-9729150bf5db.JPG',
        'assets/images/FOTOGRAFIA-CASA23/64b29759-3652-44b3-87b6-ac78743f8c8d.JPG',
        'assets/images/FOTOGRAFIA-CASA23/694c84f2-efab-4e27-8206-d073e33e515d.JPG',
        'assets/images/FOTOGRAFIA-CASA23/6c62aa8e-b604-4c3a-a8c2-cb4ac61759a2.JPG',
        'assets/images/FOTOGRAFIA-CASA23/6df1340c-7691-4ed0-9d57-e8d0f2dc3566.JPG',
        'assets/images/FOTOGRAFIA-CASA23/6f90b1c7-6aaa-4dd9-836a-8c4e9fede49c.JPG',
        'assets/images/FOTOGRAFIA-CASA23/a087b55c-2f1c-48a6-a2cd-80fc99502dc1.JPG',
        'assets/images/FOTOGRAFIA-CASA23/b60a4a63-04d4-4317-9d7c-854e5010d610.JPG',
        'assets/images/FOTOGRAFIA-CASA23/c4026d95-6ea4-41f0-b104-40382d11eb21.JPG',
        'assets/images/FOTOGRAFIA-CASA23/ca5b840a-905e-4c81-8ec1-0cbbf30d0817.JPG',
        'assets/images/FOTOGRAFIA-CASA23/d3bdff88-e1ed-4086-a69a-fb5c09f70289.JPG',
        'assets/images/FOTOGRAFIA-CASA23/e04d80ba-ffe0-40f2-9170-c6feb00c7473.JPG',
        'assets/images/FOTOGRAFIA-CASA23/e08deab5-01fe-4c06-b7da-5556e60dcbe8.JPG',
        'assets/images/FOTOGRAFIA-CASA23/ea5179e4-6a1a-4fc8-a4da-829c4592c314.JPG',
        'assets/images/FOTOGRAFIA-CASA23/edf00840-5b39-4c6f-911e-2e031defbca5.JPG',
        'assets/images/FOTOGRAFIA-CASA23/efa7fc63-cff7-43b1-a674-e7dbc681e571.JPG',
        'assets/images/FOTOGRAFIA-CASA23/f3909659-36eb-40e5-9288-9667663de071.JPG'
      ]
    },
    {
      id: 'casaL',
      titulo: 'CASA L',
      subtitulo: 'Estructura en concreto a la vista combinada con madera fina y acabados artesanales.',
      categoria: 'Residencial',
      descripcion: 'Una pieza arquitectónica en forma de L que articula el área íntima con el ala social alrededor de una piscina reflectante. El concreto ocre y las celosías de madera aportan una identidad sobria y cálida.',
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA L/0515c974-72ed-4747-a2b4-400fc4a61610.JPG',
      area: 640,
      anio: 2024,
      ubicacion: 'Alto de las Palmas, Medellín',
      destacado: true,
      caracteristicas: [
        'Distribución en L en torno a piscina reflectante central',
        'Celosías motorizadas en madera noble de control solar',
        'Muros de concreto arquitectónico con pigmento cálido',
        'Cocina gourmet italiana conectada al comedor exterior'
      ],
      editorialTitle: 'CASA L',
      editorialSubtitle: 'Concreto a la vista, madera fina y artesanía.',
      editorialSlogan: 'LA GEOMETRÍA EN L SOBRE LA PISCINA REFLECTANTE.',
      editorialStyle: 'split-grid',
      barcode: '0 600229402 4',
      imagenesAdicionales: [
        'assets/images/FOTOGRAFIA-CASA L/0515c974-72ed-4747-a2b4-400fc4a61610.JPG',
        'assets/images/FOTOGRAFIA-CASA L/0c533cb5-672a-415b-9c14-67faf621322c.JPG',
        'assets/images/FOTOGRAFIA-CASA L/0f162d2a-e7d2-486c-b766-9ca67aaac26a.JPG',
        'assets/images/FOTOGRAFIA-CASA L/1519ffc6-e0b6-4925-888d-a4f42caa95ec.JPG',
        'assets/images/FOTOGRAFIA-CASA L/1704c23c-0c1e-4240-aaa5-b0c2b59a8ac5.JPG',
        'assets/images/FOTOGRAFIA-CASA L/20a1e7fd-ac20-431f-93c9-9693250df4a5.JPG',
        'assets/images/FOTOGRAFIA-CASA L/29fa7f3b-b634-4a2d-88ed-0e07e77165d6.JPG',
        'assets/images/FOTOGRAFIA-CASA L/38508a97-351f-4515-a2ef-266b94fe2222.JPG',
        'assets/images/FOTOGRAFIA-CASA L/390124c1-e70a-4713-b438-ada6247d4363.JPG',
        'assets/images/FOTOGRAFIA-CASA L/46399414-e560-43cf-8b5b-d4a87d5a78da.JPG',
        'assets/images/FOTOGRAFIA-CASA L/4649dd82-1a51-4b96-ae51-1dc00d31c1fe.JPG',
        'assets/images/FOTOGRAFIA-CASA L/556935ef-955f-4d0a-888b-d72a9a3485aa.JPG',
        'assets/images/FOTOGRAFIA-CASA L/66066cd5-53bd-44b4-98bd-e1e9f4969567.JPG',
        'assets/images/FOTOGRAFIA-CASA L/6ea43fc4-e148-4ac6-aeab-5484c4aef69d.JPG',
        'assets/images/FOTOGRAFIA-CASA L/71b66400-b913-47be-84be-8de6ecf9f69a.JPG',
        'assets/images/FOTOGRAFIA-CASA L/85e0f169-2d00-444c-99a8-9ba0ab7c2836.JPG',
        'assets/images/FOTOGRAFIA-CASA L/8cb5f9f1-6745-4626-93e0-6c3c740d0fd0.JPG',
        'assets/images/FOTOGRAFIA-CASA L/9245d22d-26fa-469c-aa3c-429fc0825f55.JPG',
        'assets/images/FOTOGRAFIA-CASA L/95fe448e-8df2-43a4-b0ab-34d696f6a317.JPG',
        'assets/images/FOTOGRAFIA-CASA L/98831fcc-6577-43ea-b819-882c64a75302.JPG',
        'assets/images/FOTOGRAFIA-CASA L/a0901996-ceff-417b-9b11-e4df74a08af3.JPG',
        'assets/images/FOTOGRAFIA-CASA L/ab7d4628-dc9f-43e4-b376-98c384b0425f.JPG',
        'assets/images/FOTOGRAFIA-CASA L/b2a056c1-0a5b-4aee-ab44-d1f868266cd8.JPG',
        'assets/images/FOTOGRAFIA-CASA L/b7816e0f-09b8-4ec2-a58f-58a92738e1af.JPG',
        'assets/images/FOTOGRAFIA-CASA L/cf9427b0-b774-455f-a0ab-e51c3729d5fb.JPG',
        'assets/images/FOTOGRAFIA-CASA L/d7a1bf0b-da8c-4dc1-9268-a2f89bd58c89.JPG',
        'assets/images/FOTOGRAFIA-CASA L/d98f41b2-c03a-475a-adb3-218f7d6cc399.JPG',
        'assets/images/FOTOGRAFIA-CASA L/e1146e85-7149-47f6-b093-48fc6288a1e8.JPG',
        'assets/images/FOTOGRAFIA-CASA L/e634b2ae-1975-497c-be5a-385d8bfb17bd.JPG',
        'assets/images/FOTOGRAFIA-CASA L/e6d833a2-e741-4a80-9a77-08eca2112d6d.JPG',
        'assets/images/FOTOGRAFIA-CASA L/e9075dc4-b107-4469-a0a6-210256535853.JPG',
        'assets/images/FOTOGRAFIA-CASA L/f1336b8f-9e01-4acd-a702-834368833f38.JPG',
        'assets/images/FOTOGRAFIA-CASA L/f26a4892-683a-48dc-8911-ade957c95edf.JPG'
      ]
    }
  ]);

  readonly categoriaSeleccionada = signal<string>('Todas');

  readonly proyectosFiltrados = computed(() => {
    const cat = this.categoriaSeleccionada();
    const lista = this.proyectosSignal();
    if (cat === 'Todas') {
      return lista;
    }
    return lista.filter(p => p.categoria === cat);
  });

  readonly proyectosDestacados = computed(() => {
    return this.proyectosSignal().filter(p => p.destacado);
  });

  readonly proyectoModalActivo = signal<Proyecto | null>(null);

  getCategorias(): string[] {
    return ['Todas', 'Residencial', 'Remodelación', 'Arquitectura interior', 'Oficina'];
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  getProyectos(): Proyecto[] {
    return this.proyectosSignal();
  }

  getProyectoById(id: string): Proyecto | undefined {
    return this.proyectosSignal().find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase());
  }

  abrirProyectoModal(proyecto: Proyecto | string): void {
    let target: Proyecto | undefined;
    if (typeof proyecto === 'string') {
      target = this.getProyectoById(proyecto) || this.proyectosSignal().find(p => p.titulo.toLowerCase().includes(proyecto.toLowerCase()));
    } else {
      target = proyecto;
    }
    if (target) {
      this.proyectoModalActivo.set(target);
    }
  }

  cerrarProyectoModal(): void {
    this.proyectoModalActivo.set(null);
  }
}
