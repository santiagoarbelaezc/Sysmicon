import { Component, signal, computed, HostListener, OnInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface BloqueCAD {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string;
  areaM2: number;
  precioUSD: number;
}

export interface ElementoLienzo {
  instanceId: string;
  bloque: BloqueCAD;
  x: number; // Pixels
  y: number; // Pixels
  rotacion: number; // Grados
  escala: number; // Factor de zoom
  zIndex: number;
}

@Component({
  selector: 'app-crea-tu-diseno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crea-tu-diseno.component.html',
  styleUrl: './crea-tu-diseno.component.css'
})
export class CreaTuDisenoComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly elRef = inject(ElementRef);
  private readonly authService = inject(AuthService);

  readonly currentYear = new Date().getFullYear();
  readonly isLoadingScreen = signal<boolean>(true);
  readonly isFullscreen = signal<boolean>(false);
  readonly catalogoAbierto = signal<boolean>(true);
  readonly mostrarModalAuth = signal<boolean>(false);
  private loadingTimer: any;

  ngOnInit(): void {
    this.loadingTimer = setTimeout(() => {
      this.isLoadingScreen.set(false);
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
    // Salir de pantalla completa si se destruye el componente
    if (this.isFullscreen() && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  saltarCarga(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
    this.isLoadingScreen.set(false);
  }

  cerrarModalAuth(): void {
    this.mostrarModalAuth.set(false);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  imprimirPlano(): void {
    window.print();
  }

  // --- PANTALLA COMPLETA ---
  private onFullscreenChange = () => {
    this.isFullscreen.set(!!document.fullscreenElement);
  };

  toggleFullscreen(): void {
    const canvasWrapper = this.elRef.nativeElement.querySelector('#cad-canvas-wrapper');
    if (!canvasWrapper) return;

    if (!document.fullscreenElement) {
      canvasWrapper.requestFullscreen().then(() => {
        this.isFullscreen.set(true);
        this.catalogoAbierto.set(false); // Empezar con sidebar cerrado para maximizar espacio
        document.addEventListener('fullscreenchange', this.onFullscreenChange);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen.set(false);
        this.catalogoAbierto.set(true);
      }).catch(() => {});
    }
  }

  toggleCatalogo(): void {
    this.catalogoAbierto.update(v => !v);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.elementosLienzo().length > 0 && !this.isSubmitted()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  // --- NAVEGACIÓN SIMPLE (sin modal de salida) ---
  solicitarSalida(url: string): void {
    this.router.navigateByUrl(url);
  }

  // Categorías de bloques con iconos arquitectónicos vectoriales SVG
  readonly categorias = [
    { 
      id: 'alcobas', nombre: 'Alcobas & Suites', count: 4,
      svg: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>'
    },
    { 
      id: 'area-comun', nombre: 'Áreas Sociales', count: 3,
      svg: '<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>'
    },
    { 
      id: 'bano', nombre: 'Baños & Aseos', count: 2,
      svg: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>'
    },
    { 
      id: 'cocina', nombre: 'Cocina Gourmet', count: 1,
      svg: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><circle cx="15" cy="10" r="2"/><circle cx="12" cy="16" r="2"/>'
    },
    { 
      id: 'columnas', nombre: 'Estructura & Columnas', count: 3,
      svg: '<path d="M4 20h16M4 4h16M6 4v16M10 4v16M14 4v16M18 4v16"/>'
    },
    { 
      id: 'estacionamiento', nombre: 'Garaje & Parking', count: 2,
      svg: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'
    },
    { 
      id: 'muro', nombre: 'Muros & Contención', count: 3,
      svg: '<path d="M3 3h18v18H3zM12 3v18M3 9h9M12 15h9"/>'
    },
    { 
      id: 'piscina', nombre: 'Piscina & Jacuzzi', count: 2,
      svg: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'
    }
  ];

  readonly categoriaSeleccionada = signal<string>('alcobas');

  // Catálogo completo de bloques CAD en blanco sobre transparente/negro
  readonly bloquesCAD: BloqueCAD[] = [
    // Alcobas
    { id: 'alc-1', nombre: 'Alcoba Principal Master Suite', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba-principal.png', areaM2: 45, precioUSD: 65000 },
    { id: 'alc-2', nombre: 'Alcoba Secundaria Doble', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba2.png', areaM2: 25, precioUSD: 35000 },
    { id: 'alc-3', nombre: 'Alcoba Individual / Huéspedes', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba3.png', areaM2: 20, precioUSD: 28000 },
    { id: 'alc-4', nombre: 'Walk-in Closet & Estudio', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba4.png', areaM2: 30, precioUSD: 42000 },
    
    // Área Común
    { id: 'com-1', nombre: 'Sala Principal & Comedor', categoria: 'area-comun', imagen: 'assets/images/arquitectura/area-comun/comun1.png', areaM2: 60, precioUSD: 85000 },
    { id: 'com-2', nombre: 'Estar de TV / Lounge', categoria: 'area-comun', imagen: 'assets/images/arquitectura/area-comun/comun2.png', areaM2: 35, precioUSD: 48000 },
    { id: 'com-3', nombre: 'Salón Social & Eventos', categoria: 'area-comun', imagen: 'assets/images/arquitectura/area-comun/comun3.png', areaM2: 50, precioUSD: 70000 },
    
    // Baños
    { id: 'ban-1', nombre: 'Baño Principal con Tina', categoria: 'bano', imagen: 'assets/images/arquitectura/bano/bano1.png', areaM2: 12, precioUSD: 24000 },
    { id: 'ban-2', nombre: 'Baño Social / Auxiliar', categoria: 'bano', imagen: 'assets/images/arquitectura/bano/bano2.png', areaM2: 6, precioUSD: 12000 },
    
    // Cocina
    { id: 'coc-1', nombre: 'Cocina Integral con Isla Gourmet', categoria: 'cocina', imagen: 'assets/images/arquitectura/cocina/cocina1.png', areaM2: 35, precioUSD: 58000 },
    
    // Columnas
    { id: 'col-1', nombre: 'Columna Circular Estructural', categoria: 'columnas', imagen: 'assets/images/arquitectura/columnas/circular.png', areaM2: 4, precioUSD: 6000 },
    { id: 'col-2', nombre: 'Columna Cuadrada de Concreto', categoria: 'columnas', imagen: 'assets/images/arquitectura/columnas/cuadrada.png', areaM2: 4, precioUSD: 6000 },
    { id: 'col-3', nombre: 'Columna / Muro Rectangular', categoria: 'columnas', imagen: 'assets/images/arquitectura/columnas/rectangular.png', areaM2: 6, precioUSD: 8500 },
    
    // Estacionamiento
    { id: 'est-1', nombre: 'Garaje Doble Cubierto', categoria: 'estacionamiento', imagen: 'assets/images/arquitectura/estacionamiento/congarage.png', areaM2: 40, precioUSD: 38000 },
    { id: 'est-2', nombre: 'Plaza de Estacionamiento Abierta', categoria: 'estacionamiento', imagen: 'assets/images/arquitectura/estacionamiento/singarage.png', areaM2: 25, precioUSD: 18000 },
    
    // Muros
    { id: 'mur-1', nombre: 'Muro de Contención / Perimetral', categoria: 'muro', imagen: 'assets/images/arquitectura/muro/muro-contencion.png', areaM2: 15, precioUSD: 22000 },
    { id: 'mur-2', nombre: 'Muro Divisorio Interno', categoria: 'muro', imagen: 'assets/images/arquitectura/muro/muro.png', areaM2: 8, precioUSD: 10000 },
    { id: 'mur-3', nombre: 'Muro Largo Estructural / Perimetral', categoria: 'muro', imagen: 'assets/images/arquitectura/muro/muro-largo.png', areaM2: 25, precioUSD: 35000 },
    
    // Piscina
    { id: 'pis-1', nombre: 'Jacuzzi Hidromasaje Exterior', categoria: 'piscina', imagen: 'assets/images/arquitectura/piscina/jacuzzi.png', areaM2: 15, precioUSD: 28000 },
    { id: 'pis-2', nombre: 'Piscina Infinity & Solárium', categoria: 'piscina', imagen: 'assets/images/arquitectura/piscina/piscina.png', areaM2: 55, precioUSD: 75000 }
  ];

  // Elementos actualmente colocados en el lienzo CAD
  readonly elementosLienzo = signal<ElementoLienzo[]>([
    // Un par de elementos iniciales de ejemplo
    {
      instanceId: 'inst-ini-1',
      bloque: this.bloquesCAD[0], // Alcoba principal
      x: 120,
      y: 100,
      rotacion: 0,
      escala: 1,
      zIndex: 10
    },
    {
      instanceId: 'inst-ini-2',
      bloque: this.bloquesCAD[4], // Sala principal
      x: 380,
      y: 100,
      rotacion: 0,
      escala: 1,
      zIndex: 11
    }
  ]);

  readonly selectedElementId = signal<string | null>('inst-ini-1');
  readonly mostrarCuadricula = signal<boolean>(true);
  readonly modoCotizacion = signal<boolean>(false);
  readonly isSubmitted = signal<boolean>(false);

  // Formulario final
  nombre = '';
  email = '';
  telefono = '';
  ciudad = 'Medellín';
  notas = '';

  // Variables para arrastre de elementos (Drag & Drop en vivo)
  private draggingElementId: string | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private maxZIndex = 20;
  private fueArrastrado = false;
  private estadoAntesDeArrastre: ElementoLienzo[] | null = null;

  // Historial de cambios (Deshacer y Rehacer) y Portapapeles
  historialPasos: ElementoLienzo[][] = [];
  historialRehacer: ElementoLienzo[][] = [];
  portapapeles: ElementoLienzo | null = null;

  // Cálculos en vivo
  readonly totalAreaM2 = computed(() => {
    return this.elementosLienzo().reduce((acc, el) => acc + Math.round(el.bloque.areaM2 * el.escala * el.escala), 0);
  });

  readonly totalPrecioUSD = computed(() => {
    return this.elementosLienzo().reduce((acc, el) => acc + Math.round(el.bloque.precioUSD * el.escala * el.escala), 0);
  });

  readonly bloqueSeleccionadoObj = computed(() => {
    const id = this.selectedElementId();
    if (!id) return null;
    return this.elementosLienzo().find(el => el.instanceId === id) || null;
  });

  getBloquesPorCategoria(): BloqueCAD[] {
    const cat = this.categoriaSeleccionada();
    return this.bloquesCAD.filter(b => b.categoria === cat);
  }

  setCategoria(catId: string): void {
    this.categoriaSeleccionada.set(catId);
  }

  // --- GESTIÓN DE HISTORIAL ---
  guardarPasoHistorial(): void {
    this.historialPasos.push(JSON.parse(JSON.stringify(this.elementosLienzo())));
    if (this.historialPasos.length > 30) {
      this.historialPasos.shift();
    }
    this.historialRehacer = [];
  }

  deshacer(): void {
    if (this.historialPasos.length === 0) return;
    const estadoActual = JSON.parse(JSON.stringify(this.elementosLienzo()));
    this.historialRehacer.push(estadoActual);
    
    const pasoAnterior = this.historialPasos.pop();
    if (pasoAnterior) {
      this.elementosLienzo.set(pasoAnterior);
      this.selectedElementId.set(null);
    }
  }

  rehacer(): void {
    if (this.historialRehacer.length === 0) return;
    const estadoActual = JSON.parse(JSON.stringify(this.elementosLienzo()));
    this.historialPasos.push(estadoActual);
    
    const pasoSiguiente = this.historialRehacer.pop();
    if (pasoSiguiente) {
      this.elementosLienzo.set(pasoSiguiente);
      this.selectedElementId.set(null);
    }
  }

  // --- ATAJOS DE TECLADO ARQUITECTÓNICOS ---
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    // Deshacer (Ctrl+Z)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.deshacer();
      return;
    }

    // Rehacer (Ctrl+Y o Ctrl+Shift+Z)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'Z' && event.shiftKey) || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      this.rehacer();
      return;
    }

    // Copiar (Ctrl+C)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
      const sel = this.bloqueSeleccionadoObj();
      if (sel) {
        event.preventDefault();
        this.portapapeles = JSON.parse(JSON.stringify(sel));
      }
      return;
    }

    // Pegar (Ctrl+V)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V')) {
      if (this.portapapeles) {
        event.preventDefault();
        this.pegarElemento();
      }
      return;
    }

    // Duplicar rápido (Ctrl+D)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D')) {
      if (this.selectedElementId()) {
        event.preventDefault();
        this.duplicarElemento();
      }
      return;
    }

    // Eliminar con Suprimir / Backspace
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.selectedElementId()) {
        event.preventDefault();
        this.eliminarElemento();
      }
      return;
    }

    // Movimiento milimétrico con flechas del teclado
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const selId = this.selectedElementId();
      if (!selId) return;
      event.preventDefault();
      
      const step = event.shiftKey ? 10 : 2;
      this.guardarPasoHistorial();
      this.elementosLienzo.update(list =>
        list.map(item => {
          if (item.instanceId !== selId) return item;
          let nx = item.x;
          let ny = item.y;
          if (event.key === 'ArrowUp') ny = Math.max(0, ny - step);
          if (event.key === 'ArrowDown') ny += step;
          if (event.key === 'ArrowLeft') nx = Math.max(0, nx - step);
          if (event.key === 'ArrowRight') nx += step;
          return { ...item, x: nx, y: ny };
        })
      );
    }
  }

  // Añadir nuevo bloque al lienzo en posición central
  agregarBloqueAlLienzo(bloque: BloqueCAD): void {
    this.guardarPasoHistorial();
    this.maxZIndex++;
    const nuevaInstancia: ElementoLienzo = {
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      bloque: bloque,
      x: 250 + (Math.random() * 80 - 40),
      y: 180 + (Math.random() * 80 - 40),
      rotacion: 0,
      escala: 1,
      zIndex: this.maxZIndex
    };
    this.elementosLienzo.update(list => [...list, nuevaInstancia]);
    this.selectedElementId.set(nuevaInstancia.instanceId);
  }

  // Seleccionar un elemento en el lienzo
  seleccionarElemento(event: MouseEvent | TouchEvent, elem: ElementoLienzo): void {
    event.stopPropagation();
    this.maxZIndex++;
    this.selectedElementId.set(elem.instanceId);
    
    // Guardamos estado por si inicia arrastre y se modifica
    this.estadoAntesDeArrastre = JSON.parse(JSON.stringify(this.elementosLienzo()));
    this.fueArrastrado = false;

    // Traer al frente
    this.elementosLienzo.update(list =>
      list.map(item => item.instanceId === elem.instanceId ? { ...item, zIndex: this.maxZIndex } : item)
    );

    // Iniciar arrastre
    this.draggingElementId = elem.instanceId;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    this.dragOffsetX = clientX - elem.x;
    this.dragOffsetY = clientY - elem.y;
  }

  onCanvasMouseMove(event: MouseEvent | TouchEvent): void {
    if (!this.draggingElementId) return;
    this.fueArrastrado = true;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const newX = Math.max(0, clientX - this.dragOffsetX);
    const newY = Math.max(0, clientY - this.dragOffsetY);

    this.elementosLienzo.update(list =>
      list.map(item => item.instanceId === this.draggingElementId ? { ...item, x: newX, y: newY } : item)
    );
  }

  onCanvasMouseUp(): void {
    if (this.fueArrastrado && this.estadoAntesDeArrastre) {
      this.historialPasos.push(this.estadoAntesDeArrastre);
      if (this.historialPasos.length > 30) this.historialPasos.shift();
      this.historialRehacer = [];
    }
    this.draggingElementId = null;
    this.estadoAntesDeArrastre = null;
  }

  onDeseleccionarLienzo(event: Event): void {
    if (event.target === event.currentTarget) {
      this.selectedElementId.set(null);
    }
  }

  // Controles de modificación para el elemento seleccionado
  rotarElemento(grados: number): void {
    const id = this.selectedElementId();
    if (!id) return;
    this.guardarPasoHistorial();
    this.elementosLienzo.update(list =>
      list.map(item => item.instanceId === id ? { ...item, rotacion: (item.rotacion + grados) % 360 } : item)
    );
  }

  escalarElemento(delta: number): void {
    const id = this.selectedElementId();
    if (!id) return;
    this.guardarPasoHistorial();
    this.elementosLienzo.update(list =>
      list.map(item => {
        if (item.instanceId === id) {
          const nuevaEscala = Math.max(0.5, Math.min(2.5, +(item.escala + delta).toFixed(1)));
          return { ...item, escala: nuevaEscala };
        }
        return item;
      })
    );
  }

  duplicarElemento(): void {
    const actual = this.bloqueSeleccionadoObj();
    if (!actual) return;
    this.guardarPasoHistorial();
    this.maxZIndex++;
    const clon: ElementoLienzo = {
      ...actual,
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      x: actual.x + 30,
      y: actual.y + 30,
      zIndex: this.maxZIndex
    };
    this.elementosLienzo.update(list => [...list, clon]);
    this.selectedElementId.set(clon.instanceId);
  }

  pegarElemento(): void {
    if (!this.portapapeles) return;
    this.guardarPasoHistorial();
    this.maxZIndex++;
    const nuevo: ElementoLienzo = {
      ...this.portapapeles,
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      x: this.portapapeles.x + 30,
      y: this.portapapeles.y + 30,
      zIndex: this.maxZIndex
    };
    this.portapapeles = JSON.parse(JSON.stringify(nuevo));
    this.elementosLienzo.update(list => [...list, nuevo]);
    this.selectedElementId.set(nuevo.instanceId);
  }

  eliminarElemento(): void {
    const id = this.selectedElementId();
    if (!id) return;
    this.guardarPasoHistorial();
    this.elementosLienzo.update(list => list.filter(item => item.instanceId !== id));
    this.selectedElementId.set(null);
  }

  limpiarTodoElLienzo(): void {
    if (confirm('¿Estás seguro de limpiar todo el lienzo 2D?')) {
      this.guardarPasoHistorial();
      this.elementosLienzo.set([]);
      this.selectedElementId.set(null);
    }
  }

  toggleCuadricula(): void {
    this.mostrarCuadricula.set(!this.mostrarCuadricula());
  }

  abrirCotizacion(): void {
    if (this.elementosLienzo().length === 0) {
      alert('Por favor añade al menos un bloque arquitectónico a tu lienzo antes de cotizar.');
      return;
    }
    this.modoCotizacion.set(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  enviarPropuesta(event: Event): void {
    event.preventDefault();
    if (this.nombre.trim() && this.email.includes('@') && this.telefono.trim()) {
      this.isSubmitted.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  reiniciarProyecto(): void {
    this.isSubmitted.set(false);
    this.modoCotizacion.set(false);
    this.elementosLienzo.set([
      { instanceId: 'inst-ini-1', bloque: this.bloquesCAD[0], x: 120, y: 100, rotacion: 0, escala: 1, zIndex: 10 },
      { instanceId: 'inst-ini-2', bloque: this.bloquesCAD[4], x: 380, y: 100, rotacion: 0, escala: 1, zIndex: 11 }
    ]);
    this.selectedElementId.set('inst-ini-1');
  }
}
