import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreaTuDiseno.css';

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

const CATEGORIAS = [
  { id: 'alcobas', nombre: 'Alcobas & Suites', count: 4 },
  { id: 'area-comun', nombre: 'Áreas Sociales', count: 3 },
  { id: 'bano', nombre: 'Baños & Aseos', count: 2 },
  { id: 'cocina', nombre: 'Cocina Gourmet', count: 1 },
  { id: 'columnas', nombre: 'Estructura & Columnas', count: 3 },
  { id: 'estacionamiento', nombre: 'Garaje & Parking', count: 2 },
  { id: 'muro', nombre: 'Muros & Contención', count: 3 },
  { id: 'piscina', nombre: 'Piscina & Jacuzzi', count: 2 }
];

const BLOQUES_CAD: BloqueCAD[] = [
  // Alcobas
  { id: 'alc-1', nombre: 'Alcoba Principal Master Suite', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba-principal.png', areaM2: 45, precioUSD: 65000 },
  { id: 'alc-2', nombre: 'Alcoba Secundaria Doble', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba2.png', areaM2: 25, precioUSD: 35000 },
  { id: 'alc-3', nombre: 'Alcoba Individual / Huéspedes', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba3.png', areaM2: 20, precioUSD: 28000 },
  { id: 'alc-4', nombre: 'Walk-in Closet & Estudio', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba4.png', areaM2: 30, precioUSD: 42000 },
  // Área Común
  { id: 'com-1', nombre: 'Sala Principal & Comedor', categoria: 'area-comun', imagen: '/assets/images/arquitectura/area-comun/comun1.png', areaM2: 60, precioUSD: 85000 },
  { id: 'com-2', nombre: 'Estar de TV / Lounge', categoria: 'area-comun', imagen: '/assets/images/arquitectura/area-comun/comun2.png', areaM2: 35, precioUSD: 48000 },
  { id: 'com-3', nombre: 'Salón Social & Eventos', categoria: 'area-comun', imagen: '/assets/images/arquitectura/area-comun/comun3.png', areaM2: 50, precioUSD: 70000 },
  // Baños
  { id: 'ban-1', nombre: 'Baño Principal con Tina', categoria: 'bano', imagen: '/assets/images/arquitectura/bano/bano1.png', areaM2: 12, precioUSD: 24000 },
  { id: 'ban-2', nombre: 'Baño Social / Auxiliar', categoria: 'bano', imagen: '/assets/images/arquitectura/bano/bano2.png', areaM2: 6, precioUSD: 12000 },
  // Cocina
  { id: 'coc-1', nombre: 'Cocina Integral con Isla Gourmet', categoria: 'cocina', imagen: '/assets/images/arquitectura/cocina/cocina1.png', areaM2: 35, precioUSD: 58000 },
  // Columnas
  { id: 'col-1', nombre: 'Columna Circular Estructural', categoria: 'columnas', imagen: '/assets/images/arquitectura/columnas/circular.png', areaM2: 4, precioUSD: 6000 },
  { id: 'col-2', nombre: 'Columna Cuadrada de Concreto', categoria: 'columnas', imagen: '/assets/images/arquitectura/columnas/cuadrada.png', areaM2: 4, precioUSD: 6000 },
  { id: 'col-3', nombre: 'Columna / Muro Rectangular', categoria: 'columnas', imagen: '/assets/images/arquitectura/columnas/rectangular.png', areaM2: 6, precioUSD: 8500 },
  // Estacionamiento
  { id: 'est-1', nombre: 'Garaje Doble Cubierto', categoria: 'estacionamiento', imagen: '/assets/images/arquitectura/estacionamiento/congarage.png', areaM2: 40, precioUSD: 38000 },
  { id: 'est-2', nombre: 'Plaza de Estacionamiento Abierta', categoria: 'estacionamiento', imagen: '/assets/images/arquitectura/estacionamiento/singarage.png', areaM2: 25, precioUSD: 18000 },
  // Muros
  { id: 'mur-1', nombre: 'Muro de Contención / Perimetral', categoria: 'muro', imagen: '/assets/images/arquitectura/muro/muro-contencion.png', areaM2: 15, precioUSD: 22000 },
  { id: 'mur-2', nombre: 'Muro Divisorio Interno', categoria: 'muro', imagen: '/assets/images/arquitectura/muro/muro.png', areaM2: 8, precioUSD: 10000 },
  { id: 'mur-3', nombre: 'Muro Largo Estructural / Perimetral', categoria: 'muro', imagen: '/assets/images/arquitectura/muro/muro-largo.png', areaM2: 25, precioUSD: 35000 },
  // Piscina
  { id: 'pis-1', nombre: 'Jacuzzi Hidromasaje Exterior', categoria: 'piscina', imagen: '/assets/images/arquitectura/piscina/jacuzzi.png', areaM2: 15, precioUSD: 28000 },
  { id: 'pis-2', nombre: 'Piscina Infinity & Solárium', categoria: 'piscina', imagen: '/assets/images/arquitectura/piscina/piscina.png', areaM2: 55, precioUSD: 75000 }
];

const INITIAL_ELEMENTOS: ElementoLienzo[] = [
  {
    instanceId: 'inst-ini-1',
    bloque: BLOQUES_CAD[0],
    x: 120,
    y: 100,
    rotacion: 0,
    escala: 1,
    zIndex: 10
  },
  {
    instanceId: 'inst-ini-2',
    bloque: BLOQUES_CAD[4],
    x: 380,
    y: 100,
    rotacion: 0,
    escala: 1,
    zIndex: 11
  }
];

export const CreaTuDiseno: React.FC = () => {
  const navigate = useNavigate();
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  const currentYear = new Date().getFullYear();
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [catalogoAbierto, setCatalogoAbierto] = useState<boolean>(true);
  const [mostrarModalAuth, setMostrarModalAuth] = useState<boolean>(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('alcobas');
  const [elementosLienzo, setElementosLienzo] = useState<ElementoLienzo[]>(INITIAL_ELEMENTOS);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('inst-ini-1');
  const [mostrarCuadricula, setMostrarCuadricula] = useState<boolean>(true);
  const [modoCotizacion, setModoCotizacion] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [ciudad, setCiudad] = useState<string>('Medellín');
  const [notas, setNotas] = useState<string>('');

  const [historialPasos, setHistorialPasos] = useState<ElementoLienzo[][]>([]);
  const [historialRehacer, setHistorialRehacer] = useState<ElementoLienzo[][]>([]);

  const draggingElementIdRef = useRef<string | null>(null);
  const dragOffsetXRef = useRef<number>(0);
  const dragOffsetYRef = useRef<number>(0);
  const maxZIndexRef = useRef<number>(20);
  const fueArrastradoRef = useRef<boolean>(false);
  const estadoAntesDeArrastreRef = useRef<ElementoLienzo[] | null>(null);
  const portapapelesRef = useRef<ElementoLienzo | null>(null);
  const loadingTimerRef = useRef<any>(null);

  useEffect(() => {
    loadingTimerRef.current = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 2500);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (elementosLienzo.length > 0 && !isSubmitted) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [elementosLienzo.length, isSubmitted]);

  const saltarCarga = () => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    setIsLoadingScreen(false);
  };

  const cerrarModalAuth = () => {
    setMostrarModalAuth(false);
  };

  const irARegistro = () => {
    navigate('/registro');
  };

  const imprimirPlano = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    const canvasWrapper = canvasWrapperRef.current;
    if (!canvasWrapper) return;

    if (!document.fullscreenElement) {
      canvasWrapper
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setCatalogoAbierto(false);
        })
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
          setCatalogoAbierto(true);
        })
        .catch(() => {});
    }
  };

  const toggleCatalogo = () => {
    setCatalogoAbierto(v => !v);
  };

  const solicitarSalida = (url: string) => {
    navigate(url);
  };

  const totalAreaM2 = useMemo(() => {
    return elementosLienzo.reduce((acc, el) => acc + Math.round(el.bloque.areaM2 * el.escala * el.escala), 0);
  }, [elementosLienzo]);

  const totalPrecioUSD = useMemo(() => {
    return elementosLienzo.reduce((acc, el) => acc + Math.round(el.bloque.precioUSD * el.escala * el.escala), 0);
  }, [elementosLienzo]);

  const bloqueSeleccionadoObj = useMemo(() => {
    if (!selectedElementId) return null;
    return elementosLienzo.find(el => el.instanceId === selectedElementId) || null;
  }, [elementosLienzo, selectedElementId]);

  const bloquesCategoria = useMemo(() => {
    return BLOQUES_CAD.filter(b => b.categoria === categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  const guardarPasoHistorial = useCallback(() => {
    setHistorialPasos(prev => {
      const next = [...prev, JSON.parse(JSON.stringify(elementosLienzo))];
      if (next.length > 30) next.shift();
      return next;
    });
    setHistorialRehacer([]);
  }, [elementosLienzo]);

  const deshacer = useCallback(() => {
    if (historialPasos.length === 0) return;
    const estadoActual = JSON.parse(JSON.stringify(elementosLienzo));
    const pasoAnterior = historialPasos[historialPasos.length - 1];
    setHistorialPasos(prev => prev.slice(0, -1));
    setHistorialRehacer(prev => [...prev, estadoActual]);
    if (pasoAnterior) {
      setElementosLienzo(pasoAnterior);
      setSelectedElementId(null);
    }
  }, [historialPasos, elementosLienzo]);

  const rehacer = useCallback(() => {
    if (historialRehacer.length === 0) return;
    const estadoActual = JSON.parse(JSON.stringify(elementosLienzo));
    const pasoSiguiente = historialRehacer[historialRehacer.length - 1];
    setHistorialRehacer(prev => prev.slice(0, -1));
    setHistorialPasos(prev => [...prev, estadoActual]);
    if (pasoSiguiente) {
      setElementosLienzo(pasoSiguiente);
      setSelectedElementId(null);
    }
  }, [historialRehacer, elementosLienzo]);

  const duplicarElemento = useCallback(() => {
    if (!bloqueSeleccionadoObj) return;
    guardarPasoHistorial();
    maxZIndexRef.current += 1;
    const clon: ElementoLienzo = {
      ...bloqueSeleccionadoObj,
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      x: bloqueSeleccionadoObj.x + 30,
      y: bloqueSeleccionadoObj.y + 30,
      zIndex: maxZIndexRef.current
    };
    setElementosLienzo(list => [...list, clon]);
    setSelectedElementId(clon.instanceId);
  }, [bloqueSeleccionadoObj, guardarPasoHistorial]);

  const pegarElemento = useCallback(() => {
    if (!portapapelesRef.current) return;
    guardarPasoHistorial();
    maxZIndexRef.current += 1;
    const nuevo: ElementoLienzo = {
      ...portapapelesRef.current,
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      x: portapapelesRef.current.x + 30,
      y: portapapelesRef.current.y + 30,
      zIndex: maxZIndexRef.current
    };
    portapapelesRef.current = JSON.parse(JSON.stringify(nuevo));
    setElementosLienzo(list => [...list, nuevo]);
    setSelectedElementId(nuevo.instanceId);
  }, [guardarPasoHistorial]);

  const eliminarElemento = useCallback(() => {
    if (!selectedElementId) return;
    guardarPasoHistorial();
    setElementosLienzo(list => list.filter(item => item.instanceId !== selectedElementId));
    setSelectedElementId(null);
  }, [selectedElementId, guardarPasoHistorial]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        deshacer();
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'y' || (event.key === 'Z' && event.shiftKey) || (event.key === 'z' && event.shiftKey))
      ) {
        event.preventDefault();
        rehacer();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
        if (bloqueSeleccionadoObj) {
          event.preventDefault();
          portapapelesRef.current = JSON.parse(JSON.stringify(bloqueSeleccionadoObj));
        }
        return;
      }

      if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V')) {
        if (portapapelesRef.current) {
          event.preventDefault();
          pegarElemento();
        }
        return;
      }

      if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D')) {
        if (selectedElementId) {
          event.preventDefault();
          duplicarElemento();
        }
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedElementId) {
          event.preventDefault();
          eliminarElemento();
        }
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        if (!selectedElementId) return;
        event.preventDefault();
        const step = event.shiftKey ? 10 : 2;
        guardarPasoHistorial();
        setElementosLienzo(list =>
          list.map(item => {
            if (item.instanceId !== selectedElementId) return item;
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
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deshacer, rehacer, bloqueSeleccionadoObj, pegarElemento, selectedElementId, duplicarElemento, eliminarElemento, guardarPasoHistorial]);

  const agregarBloqueAlLienzo = (bloque: BloqueCAD) => {
    guardarPasoHistorial();
    maxZIndexRef.current += 1;
    const nuevaInstancia: ElementoLienzo = {
      instanceId: 'cad-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      bloque,
      x: 250 + (Math.random() * 80 - 40),
      y: 180 + (Math.random() * 80 - 40),
      rotacion: 0,
      escala: 1,
      zIndex: maxZIndexRef.current
    };
    setElementosLienzo(list => [...list, nuevaInstancia]);
    setSelectedElementId(nuevaInstancia.instanceId);
  };

  const seleccionarElemento = (event: React.MouseEvent | React.TouchEvent, elem: ElementoLienzo) => {
    event.stopPropagation();
    maxZIndexRef.current += 1;
    const nextZ = maxZIndexRef.current;
    setSelectedElementId(elem.instanceId);

    estadoAntesDeArrastreRef.current = JSON.parse(JSON.stringify(elementosLienzo));
    fueArrastradoRef.current = false;

    setElementosLienzo(list =>
      list.map(item => (item.instanceId === elem.instanceId ? { ...item, zIndex: nextZ } : item))
    );

    draggingElementIdRef.current = elem.instanceId;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    dragOffsetXRef.current = clientX - elem.x;
    dragOffsetYRef.current = clientY - elem.y;
  };

  const onCanvasMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggingElementIdRef.current) return;
    fueArrastradoRef.current = true;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const newX = Math.max(0, clientX - dragOffsetXRef.current);
    const newY = Math.max(0, clientY - dragOffsetYRef.current);
    const dragId = draggingElementIdRef.current;

    setElementosLienzo(list =>
      list.map(item => (item.instanceId === dragId ? { ...item, x: newX, y: newY } : item))
    );
  };

  const onCanvasMouseUp = () => {
    if (fueArrastradoRef.current && estadoAntesDeArrastreRef.current) {
      const snapshot = estadoAntesDeArrastreRef.current;
      setHistorialPasos(prev => {
        const next = [...prev, snapshot];
        if (next.length > 30) next.shift();
        return next;
      });
      setHistorialRehacer([]);
    }
    draggingElementIdRef.current = null;
    estadoAntesDeArrastreRef.current = null;
  };

  const onDeseleccionarLienzo = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setSelectedElementId(null);
    }
  };

  const rotarElemento = (grados: number) => {
    if (!selectedElementId) return;
    guardarPasoHistorial();
    setElementosLienzo(list =>
      list.map(item =>
        item.instanceId === selectedElementId ? { ...item, rotacion: (item.rotacion + grados) % 360 } : item
      )
    );
  };

  const escalarElemento = (delta: number) => {
    if (!selectedElementId) return;
    guardarPasoHistorial();
    setElementosLienzo(list =>
      list.map(item => {
        if (item.instanceId === selectedElementId) {
          const nuevaEscala = Math.max(0.5, Math.min(2.5, +(item.escala + delta).toFixed(1)));
          return { ...item, escala: nuevaEscala };
        }
        return item;
      })
    );
  };

  const limpiarTodoElLienzo = () => {
    if (window.confirm('¿Estás seguro de limpiar todo el lienzo 2D?')) {
      guardarPasoHistorial();
      setElementosLienzo([]);
      setSelectedElementId(null);
    }
  };

  const toggleCuadricula = () => {
    setMostrarCuadricula(v => !v);
  };

  const abrirCotizacion = () => {
    if (elementosLienzo.length === 0) {
      window.alert('Por favor añade al menos un bloque arquitectónico a tu lienzo antes de cotizar.');
      return;
    }
    setModoCotizacion(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const enviarPropuesta = (event: React.FormEvent) => {
    event.preventDefault();
    if (nombre.trim() && email.includes('@') && telefono.trim()) {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reiniciarProyecto = () => {
    setIsSubmitted(false);
    setModoCotizacion(false);
    setElementosLienzo(INITIAL_ELEMENTOS);
    setSelectedElementId('inst-ini-1');
  };

  const formatNumber = (n: number, maxDecimals = 0) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDecimals });

  return (
    <>
      <div className="config-page min-h-screen bg-[#002345] text-white py-16 font-sans">
        {/* PANTALLA DE CARGA ELEGANTE STUDIO CAD 2D */}
        {isLoadingScreen && (
          <div className="fixed inset-0 z-[9999] bg-[#001A33] text-white flex flex-col items-center justify-center px-6 font-sans overflow-hidden animate-fade">
            {/* Trazos y ejes de plano arquitectónico de precisión en el fondo */}
            <div className="absolute top-0 bottom-0 left-[8%] w-[1px] bg-white/[0.04] pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-[8%] w-[1px] bg-white/[0.04] pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-[20%] h-[1px] bg-white/[0.04] pointer-events-none"></div>
            <div className="absolute left-0 right-0 bottom-[20%] h-[1px] bg-white/[0.04] pointer-events-none"></div>

            {/* Cruces técnicas de intersección de ejes */}
            <div className="absolute top-[20%] left-[8%] -translate-x-1/2 -translate-y-1/2 text-white/20 font-mono text-[10px] select-none pointer-events-none">+</div>
            <div className="absolute top-[20%] right-[8%] translate-x-1/2 -translate-y-1/2 text-white/20 font-mono text-[10px] select-none pointer-events-none">+</div>
            <div className="absolute bottom-[20%] left-[8%] -translate-x-1/2 translate-y-1/2 text-white/20 font-mono text-[10px] select-none pointer-events-none">+</div>
            <div className="absolute bottom-[20%] right-[8%] translate-x-1/2 translate-y-1/2 text-white/20 font-mono text-[10px] select-none pointer-events-none">+</div>

            {/* Trazos esquineros técnicos (Plano Offset) */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/15 pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/15 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/15 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/15 pointer-events-none"></div>

            {/* Marcadores técnicos y cotas */}
            <div className="absolute top-10 left-24 text-[8px] font-mono text-white/15 select-none pointer-events-none tracking-widest">CAD_CORE_INITIALIZATION</div>
            <div className="absolute bottom-10 left-24 text-[8px] font-mono text-white/15 select-none pointer-events-none tracking-widest">SYS_READY_V2.0</div>
            <div className="absolute bottom-10 right-24 text-[8px] font-mono text-white/15 select-none pointer-events-none tracking-widest">WAIT_TIMEOUT: 2500ms</div>

            {/* Iluminación ambiental arquitectónica de fondo */}
            <div className="absolute w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[180px] pointer-events-none"></div>

            {/* Contenedor del video (Centrado, blanco y negro con filtro grayscale) */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-90 md:h-90 rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.95)] border border-white/10 relative bg-[#002345] z-10 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter grayscale"
                style={{ filter: 'grayscale(100%)', opacity: 0.9 }}
              >
                <source src="assets/videos/video-sysmicon.mp4" type="video/mp4" />
                <source src="videos/video-sysmicon.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Contenido de Texto Elegante con espaciado equilibrado */}
            <div className="mt-6 text-center space-y-3 max-w-md z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-sans tracking-widest uppercase shadow-sm">
                <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" className="w-4 h-4 object-contain" />
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>Entorno Interactivo en Vivo</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Evaluación de Lote & Proyecto <br />
                <span className="text-gray-400 font-serif italic font-normal">Sysmicon Arquitectura</span>
              </h2>

              <p className="text-xs text-gray-400 font-sans max-w-xs mx-auto leading-relaxed">
                Preparando fichas técnicas, parámetros urbanísticos y costos por metro cuadrado.
              </p>

              {/* Barra de progreso animada (Blanca Minimalista) */}
              <div className="w-64 h-[2px] bg-white/10 rounded-full mx-auto overflow-hidden mt-5 relative">
                <div className="absolute top-0 left-0 h-full bg-white animate-progress w-full origin-left"></div>
              </div>

              {/* Opción sutil para saltar la carga */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={saltarCarga}
                  className="text-[11px] text-gray-500 hover:text-white transition-colors underline decoration-white/20 cursor-pointer font-sans"
                >
                  Saltar introducción →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-[1750px] mx-auto px-4 md:px-10">
          {/* HEADER ARQUITECTÓNICO CAD */}
          {!isSubmitted && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wood-accent/15 border border-wood-accent/30 text-wood-light font-sans text-xs font-bold tracking-widest uppercase mb-3 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Estudio CAD 2D — Diseño Libre por Bloques</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
                Diseña tu Plano{' '}
                <span className="text-wood-light underline decoration-wood-accent decoration-2 underline-offset-8">
                  2D Interactivo
                </span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
                Selecciona bloques arquitectónicos de nuestro catálogo CAD, arrástralos sobre el lienzo negro, rótalos y ajusta tu distribución libremente.
              </p>
            </div>
          )}

          {/* PANTALLA PRINCIPAL DE ESTUDIO CAD 2D */}
          {!isSubmitted && (
            <div
              id="cad-canvas-wrapper"
              ref={canvasWrapperRef}
              className={`relative ${
                isFullscreen
                  ? 'flex flex-row w-full h-full bg-[#002345] overflow-hidden'
                  : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16'
              }`}
            >
              {/* COLUMNA IZQUIERDA: MENÚ Y CATÁLOGO DE BLOQUES */}
              <div
                className={`flex flex-col bg-[#001A33] border-r border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
                  isFullscreen
                    ? catalogoAbierto
                      ? 'w-72 flex-shrink-0 h-full'
                      : 'w-0 overflow-hidden'
                    : 'lg:col-span-3 h-[700px] md:h-[760px]'
                }`}
              >
                {/* Cabecera del menú */}
                <div className="p-4 border-b border-white/10 bg-[#002345] flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-wood-accent"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span>Categorías CAD</span>
                  </span>
                  <span className="text-[10px] bg-wood-accent/20 text-wood-light font-bold px-2 py-0.5 rounded-full border border-wood-accent/30">
                    8 Módulos
                  </span>
                </div>

                {/* Pestañas de Categorías */}
                <div className="flex xl:grid xl:grid-cols-2 gap-1.5 p-2.5 overflow-x-auto xl:overflow-visible border-b border-white/10 bg-[#001A33] scrollbar-thin">
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaSeleccionada(cat.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-sans transition-all duration-200 cursor-pointer flex-shrink-0 text-left border border-transparent ${
                        categoriaSeleccionada === cat.id
                          ? 'bg-wood-accent text-[#002345] font-extrabold shadow-md scale-[1.02]'
                          : 'bg-[#242424] text-gray-300 hover:text-white hover:bg-[#4C7AA6]/40'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {cat.id === 'alcobas' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                        )}
                        {cat.id === 'area-comun' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>
                        )}
                        {cat.id === 'bano' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                        )}
                        {cat.id === 'cocina' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><circle cx="15" cy="10" r="2"/><circle cx="12" cy="16" r="2"/></svg>
                        )}
                        {cat.id === 'columnas' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16M4 4h16M6 4v16M10 4v16M14 4v16M18 4v16"/></svg>
                        )}
                        {cat.id === 'estacionamiento' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                        )}
                        {cat.id === 'muro' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM12 3v18M3 9h9M12 15h9"/></svg>
                        )}
                        {cat.id === 'piscina' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
                        )}
                      </div>
                      <span className="truncate">{cat.nombre}</span>
                    </button>
                  ))}
                </div>

                {/* Lista de Bloques en la categoría seleccionada */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin bg-[#001A33]">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-1 px-1">
                    Selecciona para añadir al plano:
                  </div>

                  {bloquesCategoria.map(b => (
                    <div
                      key={b.id}
                      onClick={() => agregarBloqueAlLienzo(b)}
                      className="group relative bg-[#242424] hover:bg-[#4C7AA6]/30 border border-white/10 hover:border-wood-accent/60 rounded-xl p-3 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between gap-2 shadow-sm"
                    >
                      <div className="w-full h-24 bg-[#080808] rounded-lg p-2 flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={b.imagen} alt={b.nombre} className="max-w-full max-h-full object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-wood-accent text-[#111] font-bold text-xs px-3 py-1.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            + Añadir al Plano
                          </span>
                        </div>
                      </div>

                      <div className="w-full text-left">
                        <div className="font-serif font-bold text-xs text-white truncate">{b.nombre}</div>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400 font-sans">
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            {b.areaM2} m²
                          </span>
                          <span className="text-wood-light font-bold">${formatNumber(b.precioUSD / 1000, 1)}k COP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie del catálogo */}
                <div className="p-3 bg-[#002345] border-t border-white/10 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wood-accent"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span className="text-white font-medium">Tip:</span> Haz clic en un bloque para colocarlo en el centro del lienzo.
                </div>
              </div>

              {/* COLUMNA DERECHA: EL LIENZO NEGRO CAD 2D */}
              <div
                className={`flex flex-col bg-[#001A33] rounded-2xl border border-white/10 overflow-hidden shadow-2xl ${
                  isFullscreen ? 'flex-1 h-full min-w-0' : 'lg:col-span-9 h-[700px] md:h-[760px]'
                }`}
              >
                {/* BARRA SUPERIOR DE HERRAMIENTAS DEL LIENZO */}
                <div className="p-3 bg-[#002345] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                  {/* Lado Izquierdo: Historial, Cuadrícula y Limpiar */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isFullscreen && (
                      <>
                        <button
                          onClick={toggleCatalogo}
                          title={catalogoAbierto ? 'Cerrar catálogo' : 'Abrir catálogo de bloques'}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            catalogoAbierto
                              ? 'bg-wood-accent/20 text-wood-light border-wood-accent/40'
                              : 'bg-[#242424] text-gray-300 border-white/10 hover:text-white hover:bg-[#4C7AA6]/40'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                          <span>{catalogoAbierto ? 'Cerrar' : 'Catálogo'}</span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/10 mx-0.5"></div>
                      </>
                    )}

                    <button
                      onClick={deshacer}
                      disabled={historialPasos.length === 0}
                      title="Deshacer último cambio (Ctrl+Z)"
                      className={`px-2.5 py-1.5 rounded-lg bg-[#242424] border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        historialPasos.length === 0
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-[#4C7AA6]/40 text-white'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                      <span>Deshacer</span>
                    </button>

                    <button
                      onClick={rehacer}
                      disabled={historialRehacer.length === 0}
                      title="Rehacer cambio (Ctrl+Y)"
                      className={`px-2.5 py-1.5 rounded-lg bg-[#242424] border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        historialRehacer.length === 0
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-[#4C7AA6]/40 text-white'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
                      <span>Rehacer</span>
                    </button>

                    <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

                    <button
                      onClick={toggleCuadricula}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        mostrarCuadricula
                          ? 'bg-wood-accent/20 text-wood-light border-wood-accent/40'
                          : 'bg-[#242424] text-gray-300 border-white/10'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
                      <span>Cuadrícula</span>
                    </button>

                    {elementosLienzo.length > 0 && (
                      <button
                        onClick={limpiarTodoElLienzo}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        <span>Limpiar</span>
                      </button>
                    )}

                    {elementosLienzo.length > 0 && (
                      <button
                        onClick={imprimirPlano}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-[#002345] border border-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        <span>Imprimir Plano</span>
                      </button>
                    )}

                    <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>

                    <button
                      onClick={toggleFullscreen}
                      title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Ver en pantalla completa'}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isFullscreen
                          ? 'bg-wood-accent/20 text-wood-light border-wood-accent/40'
                          : 'bg-[#242424] text-gray-300 border-white/10 hover:text-white hover:bg-[#4C7AA6]/40'
                      }`}
                    >
                      {!isFullscreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>
                      )}
                      <span>{isFullscreen ? 'Comprimir' : 'Full Screen'}</span>
                    </button>
                  </div>

                  {/* Lado Derecho: Controles del Elemento Seleccionado o Guía Rápida */}
                  {bloqueSeleccionadoObj ? (
                    <div className="flex flex-wrap items-center gap-1.5 bg-[#001A33] px-3 py-1 rounded-xl border border-wood-accent/40 animate-fade">
                      <span className="text-[11px] text-wood-light font-bold truncate max-w-[130px] mr-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {bloqueSeleccionadoObj.bloque.nombre}:
                      </span>

                      <button onClick={() => rotarElemento(45)} title="Rotar 45°" className="px-2 py-1.5 rounded-lg bg-[#242424] hover:bg-wood-accent hover:text-[#002345] text-white transition-all text-xs cursor-pointer font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                        +45°
                      </button>
                      <button onClick={() => rotarElemento(90)} title="Rotar 90°" className="px-2 py-1.5 rounded-lg bg-[#242424] hover:bg-wood-accent hover:text-[#002345] text-white transition-all text-xs cursor-pointer font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                        +90°
                      </button>
                      <button onClick={() => escalarElemento(0.1)} title="Agrandar (+10%)" className="px-2 py-1.5 rounded-lg bg-[#242424] hover:bg-wood-accent hover:text-[#002345] text-white transition-all text-xs cursor-pointer font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <button onClick={() => escalarElemento(-0.1)} title="Reducir (-10%)" className="px-2 py-1.5 rounded-lg bg-[#242424] hover:bg-wood-accent hover:text-[#002345] text-white transition-all text-xs cursor-pointer font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <button onClick={duplicarElemento} title="Duplicar Bloque (Atajo: Ctrl+D o Ctrl+C y Ctrl+V)" className="px-2 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-800/80 text-blue-300 border border-blue-800/40 transition-all text-xs cursor-pointer font-bold ml-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Clonar
                      </button>
                      <button onClick={eliminarElemento} title="Eliminar del plano (Atajo: Tecla Suprimir / Backspace)" className="px-2 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-800/80 text-red-300 border border-red-800/40 transition-all text-xs cursor-pointer font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 flex items-center gap-3 font-sans">
                      <span className="hidden md:inline flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wood-accent"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Haz clic en un módulo del lienzo para ver herramientas.
                      </span>
                      <span className="bg-[#242424] px-2 py-0.5 rounded text-[10px] text-gray-300 border border-white/5"><strong>Supr</strong> Eliminar</span>
                      <span className="bg-[#242424] px-2 py-0.5 rounded text-[10px] text-gray-300 border border-white/5 hidden lg:inline"><strong>Flechas</strong> Mover Precisión</span>
                    </div>
                  )}
                </div>

                {/* EL LIENZO CAD NEGRO INTERACTIVO (Viewport) */}
                <div
                  className={`flex-1 relative bg-[#001A33] overflow-hidden select-none cursor-crosshair ${
                    mostrarCuadricula ? 'cad-grid' : ''
                  }`}
                  onMouseMove={onCanvasMouseMove}
                  onTouchMove={onCanvasMouseMove}
                  onMouseUp={onCanvasMouseUp}
                  onTouchEnd={onCanvasMouseUp}
                  onClick={onDeseleccionarLienzo}
                >
                  {/* BRÚJULA ARQUITECTÓNICA */}
                  <div className="absolute top-5 right-5 z-30 pointer-events-none flex flex-col items-center justify-center p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl">
                    <span className="font-serif font-bold text-wood-light text-base leading-none">N</span>
                    <div className="w-6 h-8 my-1 flex items-center justify-center relative">
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[24px] border-b-red-600 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"></div>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Brújula CAD</span>
                  </div>

                  {/* REGLA DE MEDIDAS ARQUITECTÓNICA */}
                  <div className="absolute bottom-5 left-5 z-30 pointer-events-none bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-2xl flex flex-col items-start gap-1">
                    <div className="flex items-center justify-between w-48 text-[9px] font-bold text-gray-300 font-mono">
                      <span>0m</span>
                      <span>5m</span>
                      <span>10m</span>
                      <span>15m</span>
                    </div>
                    <div className="w-48 h-2 bg-gradient-to-r from-white via-gray-400 to-wood-accent rounded-full relative border border-white/40">
                      <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-white border-r border-black"></div>
                      <div className="absolute top-0 left-1/3 bottom-0 w-1/3 bg-gray-600 border-r border-black"></div>
                    </div>
                    <span className="text-[9px] text-wood-light font-bold tracking-widest uppercase">Escala Referencial 1:100</span>
                  </div>

                  {/* MENSAJE DE LIENZO VACÍO */}
                  {elementosLienzo.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6 opacity-40">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><polyline points="15 3 15 9 21 9"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="12" y1="11" x2="12" y2="17"/></svg>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white">Lienzo CAD 2D en Blanco</h3>
                      <p className="text-sm text-gray-400 max-w-md mt-1">
                        Elige una alcoba, sala o piscina en el menú de la izquierda y haz clic en "+ Añadir al Plano" para comenzar a diseñar.
                      </p>
                    </div>
                  )}

                  {/* ELEMENTOS COLOCADOS EN EL LIENZO */}
                  {elementosLienzo.map(el => {
                    const isSelected = selectedElementId === el.instanceId;
                    return (
                      <div
                        key={el.instanceId}
                        style={{ left: `${el.x}px`, top: `${el.y}px`, zIndex: el.zIndex }}
                        onMouseDown={e => seleccionarElemento(e, el)}
                        onTouchStart={e => seleccionarElemento(e, el)}
                        className={`absolute cursor-move transition-shadow duration-150 p-2 rounded-lg group ${
                          isSelected ? 'border border-dashed border-wood-accent z-50' : 'border border-transparent'
                        }`}
                      >
                        <div
                          style={{ transform: `rotate(${el.rotacion}deg) scale(${el.escala})` }}
                          className="transition-transform duration-150 transform-gpu flex flex-col items-center justify-center relative"
                        >
                          <img
                            src={el.bloque.imagen}
                            alt={el.bloque.nombre}
                            className="max-w-[180px] md:max-w-[220px] max-h-[180px] md:max-h-[220px] object-contain pointer-events-none"
                          />

                          <div
                            className={`absolute -bottom-6 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-bold text-white tracking-wide shadow-md pointer-events-none ${
                              isSelected
                                ? 'opacity-100 text-wood-light border-wood-accent'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {el.bloque.nombre} ({el.rotacion}°)
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            onClick={e => {
                              e.stopPropagation();
                              rotarElemento(45);
                            }}
                            title="Clic para rotar 45°"
                            className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-wood-accent text-[#002345] font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-125 transition-transform z-50"
                          >
                            ↻
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* BARRA INFERIOR DE RESUMEN EN VIVO Y BOTÓN DE COTIZACIÓN */}
                <div className="p-4 bg-[#002345] border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-wood-accent"></span>
                      <span className="text-gray-400">Bloques:</span>
                      <strong className="text-white font-mono text-base">{elementosLienzo.length}</strong>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                      <span className="text-gray-400">Área Estimada:</span>
                      <strong className="text-white font-mono text-base">{totalAreaM2} m²</strong>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                      <span className="text-gray-400">Presupuesto Ref:</span>
                      <strong className="text-wood-light font-mono text-lg">${formatNumber(totalPrecioUSD)} COP*</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={abrirCotizacion}
                      className="w-full md:w-auto py-3 px-8 rounded-xl bg-white hover:bg-gray-200 text-[#002345] font-sans font-bold text-xs tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      <span>Formalizar este Plano en Propuesta</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN MODAL / FORMULARIO DE FORMALIZACIÓN DE PROPUESTA */}
          {modoCotizacion && !isSubmitted && (
            <div className="max-w-4xl mx-auto bg-[#001A33] rounded-2xl border border-wood-accent/40 p-6 md:p-10 shadow-2xl animate-fade mb-20">
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-wood-light bg-wood-accent/15 px-3 py-1 rounded-full border border-wood-accent/30">
                    Paso Final
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white mt-2">
                    Formalizar Solicitud con Plano 2D Personalizado
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Un arquitecto director revisará la geometría de tu distribución de {totalAreaM2} m² y se contactará contigo.
                  </p>
                </div>
                <button
                  onClick={() => setModoCotizacion(false)}
                  className="text-gray-400 hover:text-white font-bold text-lg p-2"
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#002345] p-4 rounded-xl border border-white/5 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                <div>
                  <span className="text-gray-400 block">Resumen de tu plano 2D:</span>
                  <span className="text-white font-bold">{elementosLienzo.length} módulos CAD estructurados en lienzo.</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Área construible proyectada:</span>
                  <span className="text-wood-light font-bold text-sm">{totalAreaM2} m²</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Valor referencial estimado:</span>
                  <span className="text-emerald-400 font-bold text-sm">${formatNumber(totalPrecioUSD)} COP*</span>
                </div>
              </div>

              <form onSubmit={enviarPropuesta} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5 font-serif">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      name="nombre"
                      required
                      placeholder="Ej: Carlos Alberto Rodríguez"
                      className="w-full px-4 py-3 rounded-xl bg-[#001A33] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5 font-serif">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      name="email"
                      required
                      placeholder="carlos@correo.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#001A33] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5 font-serif">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      name="telefono"
                      required
                      placeholder="+57 310 000 0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#001A33] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5 font-serif">
                      Ciudad de Construcción *
                    </label>
                    <input
                      type="text"
                      value={ciudad}
                      onChange={e => setCiudad(e.target.value)}
                      name="ciudad"
                      required
                      placeholder="Ej: Llanogrande, Medellín, Bogotá..."
                      className="w-full px-4 py-3 rounded-xl bg-[#001A33] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5 font-serif">
                    Notas Adicionales para el Arquitecto (Opcional)
                  </label>
                  <textarea
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    name="notas"
                    rows={3}
                    placeholder="Indícanos si ya cuentas con lote propio, orientación solar preferida o requerimientos especiales..."
                    className="w-full px-4 py-3 rounded-xl bg-[#001A33] border border-white/15 text-white placeholder-gray-600 focus:border-wood-accent focus:outline-none transition-colors text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-wood-accent to-[#002345] hover:brightness-110 text-[#002345] font-sans font-bold text-sm tracking-widest uppercase shadow-2xl transition-all cursor-pointer mt-4 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  <span>Enviar mi Plano 2D y Solicitar Cita con Director Arquitectónico</span>
                </button>
              </form>
            </div>
          )}

          {/* PANTALLA DE ÉXITO DE PROPUESTA */}
          {isSubmitted && (
            <div className="max-w-3xl mx-auto bg-[#001A33] rounded-2xl border border-wood-accent p-8 md:p-12 text-center shadow-2xl animate-fade my-16">
              <div className="w-16 h-16 rounded-full bg-wood-accent/15 border border-wood-accent/40 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wood-light"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                ¡Plano 2D Recibido con <span className="text-wood-light">Éxito</span>!
              </h2>
              <div className="w-24 h-0.5 bg-wood-accent mx-auto my-5"></div>

              <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
                Estimado/a <strong className="text-white">{nombre}</strong>, hemos registrado tu distribución arquitectónica de{' '}
                <strong className="text-wood-light">{totalAreaM2} m²</strong> con <strong>{elementosLienzo.length} módulos CAD</strong>.
              </p>

              <div className="bg-[#002345] border border-white/10 rounded-xl p-6 max-w-md mx-auto my-6">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Código Referencial de tu Plano:</div>
                <div className="font-serif font-bold text-2xl text-wood-light my-1">
                  CAD-{currentYear}-{totalAreaM2}M
                </div>
                <div className="text-xs text-gray-400">
                  Presupuesto estimado: <strong className="text-emerald-400">${formatNumber(totalPrecioUSD)} COP*</strong>
                </div>
              </div>

              <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">
                Hemos enviado una copia del dossier y del esquema vectorial a <strong className="text-white">{email}</strong>. Uno de nuestros arquitectos senior estudiará la viabilidad técnica y se comunicará a tu WhatsApp a la brevedad.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={reiniciarProyecto}
                  className="px-6 py-3 rounded-xl bg-[#242424] hover:bg-[#333] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span>Diseñar Otro Plano 2D</span>
                </button>
                <button
                  onClick={() => solicitarSalida('/')}
                  className="px-6 py-3 rounded-xl bg-wood-accent hover:brightness-110 text-[#002345] font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Volver al Inicio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL: ACCESO REQUERIDO — CAD 2D ===== */}
      {mostrarModalAuth && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'rgba(0, 26, 51, 0.92)', backdropFilter: 'blur(18px) saturate(0.4)' }}
        >
          <div
            className="relative w-full max-w-lg mx-4 overflow-hidden"
            style={{ background: '#001A33', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 48px 120px rgba(0,0,0,0.95)' }}
          >
            {/* Esquinas de plano arquitectónico */}
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none" style={{ borderTop: '1px solid rgba(232,213,163,0.5)', borderLeft: '1px solid rgba(232,213,163,0.5)' }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none" style={{ borderTop: '1px solid rgba(232,213,163,0.5)', borderRight: '1px solid rgba(232,213,163,0.5)' }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none" style={{ borderBottom: '1px solid rgba(232,213,163,0.5)', borderLeft: '1px solid rgba(232,213,163,0.5)' }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" style={{ borderBottom: '1px solid rgba(232,213,163,0.5)', borderRight: '1px solid rgba(232,213,163,0.5)' }}></div>

            <div className="absolute top-0 bottom-0 left-[12%] w-[1px] pointer-events-none" style={{ background: 'rgba(255,255,255,0.025)' }}></div>
            <div className="absolute top-0 bottom-0 right-[12%] w-[1px] pointer-events-none" style={{ background: 'rgba(255,255,255,0.025)' }}></div>
            <div className="absolute left-0 right-0 top-[30%] h-[1px] pointer-events-none" style={{ background: 'rgba(255,255,255,0.025)' }}></div>

            <div className="flex items-center justify-between px-6 pt-4 pb-0">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(232,213,163,0.4)' }}>
                SYS-CAD-2D / AUTH_REQUIRED
              </span>
              <span className="font-mono text-[9px] tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                REV 01
              </span>
            </div>

            <div className="mx-6 mt-3 mb-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,213,163,0.6), transparent)' }}></div>

            <div className="px-10 pt-8 pb-10">
              <div className="flex items-start gap-5 mb-7">
                <div
                  className="flex-shrink-0 w-14 h-14 flex items-center justify-center relative"
                  style={{ border: '1px solid rgba(232,213,163,0.2)', background: 'rgba(232,213,163,0.04)' }}
                >
                  <div className="absolute -top-[3px] -left-[3px] w-2 h-2" style={{ borderTop: '1px solid rgba(232,213,163,0.6)', borderLeft: '1px solid rgba(232,213,163,0.6)' }}></div>
                  <div className="absolute -top-[3px] -right-[3px] w-2 h-2" style={{ borderTop: '1px solid rgba(232,213,163,0.6)', borderRight: '1px solid rgba(232,213,163,0.6)' }}></div>
                  <div className="absolute -bottom-[3px] -left-[3px] w-2 h-2" style={{ borderBottom: '1px solid rgba(232,213,163,0.6)', borderLeft: '1px solid rgba(232,213,163,0.6)' }}></div>
                  <div className="absolute -bottom-[3px] -right-[3px] w-2 h-2" style={{ borderBottom: '1px solid rgba(232,213,163,0.6)', borderRight: '1px solid rgba(232,213,163,0.6)' }}></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" fill="#e8d5a3" stroke="none" />
                  </svg>
                </div>

                <div className="flex-1 pt-1">
                  <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ color: 'rgba(232,213,163,0.5)' }}>
                    Acceso Restringido
                  </div>
                  <h2 className="text-white font-bold leading-tight mb-1" style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
                    Necesitas una cuenta<br />para usar CAD 2D
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    El simulador de planos Sysmicon requiere registro para guardar tu trabajo y recibir una propuesta personalizada.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
                <div className="font-mono text-[8px] tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.2)' }}>BENEFICIOS</div>
                <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] w-6 text-right flex-shrink-0" style={{ color: 'rgba(232,213,163,0.4)' }}>01</span>
                  <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Guarda y exporta tus planos en PDF</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] w-6 text-right flex-shrink-0" style={{ color: 'rgba(232,213,163,0.4)' }}>02</span>
                  <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Cotización personalizada por m²</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] w-6 text-right flex-shrink-0" style={{ color: 'rgba(232,213,163,0.4)' }}>03</span>
                  <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Acceso al equipo de arquitectos Sysmicon</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={irARegistro}
                  className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer relative overflow-hidden group"
                  style={{ background: '#C2E1FF', color: '#002345', letterSpacing: '0.12em' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                  <span className="relative">Crear cuenta — Es gratis</span>
                </button>

                <button
                  onClick={cerrarModalAuth}
                  className="w-full py-3 text-xs font-mono tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.28)' }}
                >
                  Explorar sin cuenta
                </button>
              </div>
            </div>

            <div className="px-6 pb-4 flex items-center justify-between">
              <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
                SYSMICON ARQUITECTURA © {currentYear}
              </span>
              <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.12)' }}>
                CAD-2D v2.1
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreaTuDiseno;
