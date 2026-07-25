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
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA M/EN USO/ab5f10d9-edca-40d8-80d4-8e1f11a384f6.JPG',
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
        'assets/images/FOTOGRAFIA-CASA M/EN USO/ab5f10d9-edca-40d8-80d4-8e1f11a384f6.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/615491a3-a0e4-452c-bac4-b1db9b44503a.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/dc384e26-4d78-4198-a1c7-352a01ec60ff.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/f819cc53-49c4-49b6-9127-6666c4a7604d.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/7a194fca-99d7-4016-b968-45d58453d71b.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/9a8699de-acb4-413e-b85b-8286cc16c4da.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/a3078cd4-fbb3-42a4-8ac2-c4906606c11d.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/aeaf4984-006b-466f-a63e-5a28daac0936.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/b5f68a9c-ac42-41fc-8705-fc5b43eeae23.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/d150c5e3-dd80-4948-855c-2a1bad443d2c.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/476b7916-e5b6-4d40-b59a-45ef7769b1aa.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/6b5189ae-d70d-45d9-afea-e33174556c3e.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/e0cf7e52-35ab-491b-9475-08ba6dd2515e.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/b7d23d8d-2285-4d95-be21-77e8c55b9715.JPG',
        'assets/images/FOTOGRAFIA-CASA M/EN USO/e2a8b107-af13-4fc9-b007-51d41c7ec879.JPG',
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
      imagenUrl: 'assets/images/FOTOGRAFIA-S19/EN USO/93a47a98-4dc9-4987-9ff5-3d84ba629450.JPG',
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
        'assets/images/FOTOGRAFIA-S19/EN USO/93a47a98-4dc9-4987-9ff5-3d84ba629450.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/92f8b8b0-02fc-4490-8f6e-155f310b4be5.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/6ad40f37-e3f9-442e-b172-d1a61a36b82e.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/4965bed3-ab80-4da5-acba-6bff7fbbb9a8.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/20240425_144805.jpg',
        'assets/images/FOTOGRAFIA-S19/EN USO/20240624_154251.jpg',
        'assets/images/FOTOGRAFIA-S19/EN USO/30602ba9-c01d-4f40-b0fa-9f87cb480271.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/7586edc6-1420-402b-a03d-31aae070517d.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/a23e188e-a8ab-4273-b3af-22a1076d3590.JPG',
        'assets/images/FOTOGRAFIA-S19/EN USO/bfbc6648-f467-4b59-b0da-f96ed3b0003f.JPG',
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
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA23/EN USO/5130e97a-9a68-4b02-b533-36a1a4d0b75e.JPG',
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
        'assets/images/FOTOGRAFIA-CASA23/EN USO/5130e97a-9a68-4b02-b533-36a1a4d0b75e.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/949e9cd8-fb79-4a15-8ca1-1a54633b42e0.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/11194982-69dd-4a60-addd-89ee3f608f15.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/44c5b4fd-fcee-468b-b8d0-1cf729905540.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/b33c0ac5-facc-4eb9-9977-07dfdd6f9e77.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/fac391f2-881b-493e-b5da-553202967f8a.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/ff23b053-894d-4883-8108-69e9ff7bcaaa.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/969bb526-da22-427a-88ab-ce750091562c.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/be7759cb-3d63-45bb-85a8-496f85109454.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/588af1c7-e9f5-4fcc-8f36-16820f20df16.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/c97b7b3b-41d8-40b5-afda-da0f7d6d94a8.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/76debdd3-01e9-41c5-af8d-ac24b3495178.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/fc66c710-1ba4-460c-8fdc-e97e76388f2b.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/dc7a3681-fb94-402b-80ed-d4fc4bdd0e7b.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/52ce04f4-9576-4015-b3d1-78782ece38bf.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/58e6804d-5ee2-4cab-b88e-75900ebc438d.JPG',
        'assets/images/FOTOGRAFIA-CASA23/EN USO/a820b1e7-7f50-49b9-aad0-3aaa4f77f431.JPG',
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
      imagenUrl: 'assets/images/FOTOGRAFIA-CASA L/EN USO/396559e6-a70b-410f-be78-f7b542633120.JPG',
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
        'assets/images/FOTOGRAFIA-CASA L/EN USO/396559e6-a70b-410f-be78-f7b542633120.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/f7c44514-abe8-4d6c-98d4-97f586977d89.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/cc1d190e-f95e-4a87-ac66-c75b8769c932.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/d791c849-a8af-4d8a-a220-95d8603a9d0d.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/45a9825e-2bcc-4840-8316-9cdac7f00eae.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/61d67b7c-0608-43b2-b5ec-d8d7c04c8b5f.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/5d0277b5-796c-47d2-8d27-49e75d55d60c.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/8f5998b5-76f4-4ca4-9003-0bba528a4799.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/ca141940-1b3e-4c81-ac92-42aaa82cde0b.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/4140b7eb-f21f-4d3b-8e35-676aafe75907.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/d07f030a-dded-49a3-a424-30b981185c40.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/0dac6149-ae69-4565-8c6e-fff524f613a8.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/200cea72-cad4-4a4f-8063-f0e52c34fa10.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/842b7385-c49a-4eb7-b62a-78cfa50bc84f.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/c2c8c90b-5fb5-4f66-87b3-b35ca8a4fd1b.JPG',
        'assets/images/FOTOGRAFIA-CASA L/EN USO/88a46e83-bd9f-4000-883e-bceb7b71ce56.JPG',
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
