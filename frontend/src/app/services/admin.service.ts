import { Injectable, signal, computed } from '@angular/core';

export interface BloqueAdmin {
  id: string;
  nombre: string;
  categoria: 'alcobas' | 'cocina' | 'area-comun' | 'muro' | 'columnas' | 'estacionamiento' | 'piscina';
  imagen: string;
  areaM2: number;
  precioUSD: number;
  activo: boolean;
  fechaCreacion: string;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'propietario' | 'arquitecto' | 'inversionista' | 'admin';
  estado: 'activo' | 'suspendido' | 'pendiente';
  fechaRegistro: string;
  proyectosGuardados: number;
}

export interface MensajeAdmin {
  id: string;
  remitente: string;
  email: string;
  telefono: string;
  asunto: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  tipo: 'cotizacion' | 'contacto_general' | 'asistencia_cad';
  presupuesto?: string;
}

export interface ReporteAdmin {
  id: string;
  titulo: string;
  tipo: 'financiero' | 'operativo' | 'cad_studio';
  periodo: string;
  fechaGeneracion: string;
  formato: 'PDF' | 'EXCEL' | 'CSV';
  tamano: string;
}

export interface CmsConfig {
  heroTagline: string;
  heroSubtagline: string;
  telefonoContacto: string;
  emailSoporte: string;
  instagramHandle: string;
  mostrarBannerAlerta: boolean;
  textoBannerAlerta: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // 1. KPIs Generales del Dash Inicio
  readonly kpis = signal({
    totalCotizaciones: 184,
    disenosCADGuardados: 412,
    usuariosRegistrados: 1280,
    ingresoEstimadoUSD: 4250000,
    crecimientoMensual: '+18.4%'
  });

  // 2. Analíticas Detalladas
  readonly analiticas = signal({
    visitasDiarias: [
      { dia: 'Lun', visitas: 1240, conversiones: 45 },
      { dia: 'Mar', visitas: 1480, conversiones: 52 },
      { dia: 'Mié', visitas: 1820, conversiones: 68 },
      { dia: 'Jue', visitas: 1650, conversiones: 58 },
      { dia: 'Vie', visitas: 2100, conversiones: 84 },
      { dia: 'Sáb', visitas: 1950, conversiones: 72 },
      { dia: 'Dom', visitas: 1720, conversiones: 61 }
    ],
    tiempoPromedioCAD: '14 mins 32 segs',
    tasaRebote: '22.4%',
    dispositivos: [
      { tipo: 'Desktop / Laptop (CAD Pro)', porcentaje: 68 },
      { tipo: 'Móvil / Tablet (Exploración)', porcentaje: 32 }
    ]
  });

  // 3. Catálogo CAD 2D
  readonly bloquesCAD = signal<BloqueAdmin[]>([
    { id: 'alc-1', nombre: 'Master Suite & Vestier Privado', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba1.png', areaM2: 45, precioUSD: 65000, activo: true, fechaCreacion: '2026-01-15' },
    { id: 'alc-2', nombre: 'Suite Secundaria Doble con Terraza', categoria: 'alcobas', imagen: 'assets/images/arquitectura/alcobas/alcoba2.png', areaM2: 28, precioUSD: 38000, activo: true, fechaCreacion: '2026-01-18' },
    { id: 'coc-1', nombre: 'Cocina Integral con Isla Gourmet', categoria: 'cocina', imagen: 'assets/images/arquitectura/cocina/cocina1.png', areaM2: 35, precioUSD: 58000, activo: true, fechaCreacion: '2026-02-01' },
    { id: 'com-1', nombre: 'Sala de Estar Doble Altura con Chimenea', categoria: 'area-comun', imagen: 'assets/images/arquitectura/area-comun/comun1.png', areaM2: 50, precioUSD: 72000, activo: true, fechaCreacion: '2026-02-10' },
    { id: 'est-1', nombre: 'Garaje Doble Cubierto', categoria: 'estacionamiento', imagen: 'assets/images/arquitectura/estacionamiento/congarage.png', areaM2: 40, precioUSD: 38000, activo: true, fechaCreacion: '2026-02-14' },
    { id: 'pis-2', nombre: 'Piscina Infinity & Solárium', categoria: 'piscina', imagen: 'assets/images/arquitectura/piscina/piscina.png', areaM2: 55, precioUSD: 75000, activo: true, fechaCreacion: '2026-03-01' }
  ]);

  // 4. Estadísticas
  readonly estadisticas = signal({
    categoriasPopulares: [
      { categoria: 'Alcobas Suite', porcentaje: 32, totalDisenos: 132 },
      { categoria: 'Cocinas Gourmet', porcentaje: 24, totalDisenos: 99 },
      { categoria: 'Piscinas & Solárium', porcentaje: 20, totalDisenos: 82 },
      { categoria: 'Zonas Sociales Altura', porcentaje: 15, totalDisenos: 62 },
      { categoria: 'Garajes Cubiertos', porcentaje: 9, totalDisenos: 37 }
    ],
    presupuestosPromedio: [
      { rango: '$100k - $250k USD', porcentaje: 35 },
      { rango: '$250k - $500k USD', porcentaje: 45 },
      { rango: 'Más de $500k USD (Luxury)', porcentaje: 20 }
    ]
  });

  // 5. CMS Personalizar Sitio
  readonly cmsConfig = signal<CmsConfig>({
    heroTagline: 'DISEÑO Y CONSTRUCCIÓN EN ORIENTE ANTIOQUEÑO',
    heroSubtagline: 'Versatilidad y excelencia en cada detalle residencial',
    telefonoContacto: '+57 (300) 987-6543',
    emailSoporte: 'arquitectura@sysmicon.com',
    instagramHandle: '@sysmicon',
    mostrarBannerAlerta: true,
    textoBannerAlerta: '⚡ Nuevos bloques CAD 2D disponibles para Llanogrande y Retiro. ¡Pruébalos en el configurador!'
  });

  // 6. Usuarios Registrados
  readonly usuarios = signal<UsuarioAdmin[]>([
    { id: 'usr-1', nombre: 'Carlos Restrepo', email: 'carlos.r@gmail.com', telefono: '+57 310 456 7890', rol: 'propietario', estado: 'activo', fechaRegistro: '2026-06-15', proyectosGuardados: 4 },
    { id: 'usr-2', nombre: 'Arq. Mariana Vélez', email: 'mvelez@estudio-mv.com', telefono: '+57 312 888 9900', rol: 'arquitecto', estado: 'activo', fechaRegistro: '2026-06-18', proyectosGuardados: 12 },
    { id: 'usr-3', nombre: 'Alejandro Gómez', email: 'agomez.inv@capital.co', telefono: '+57 300 111 2233', rol: 'inversionista', estado: 'activo', fechaRegistro: '2026-06-20', proyectosGuardados: 2 },
    { id: 'usr-4', nombre: 'Sofia Londoño', email: 'sofi.londo@hotmail.com', telefono: '+57 315 666 7788', rol: 'propietario', estado: 'pendiente', fechaRegistro: '2026-06-28', proyectosGuardados: 1 },
    { id: 'usr-5', nombre: 'David Jaramillo', email: 'djaramillo@sysmicon.com', telefono: '+57 311 000 1122', rol: 'admin', estado: 'activo', fechaRegistro: '2026-01-01', proyectosGuardados: 25 }
  ]);

  // 7. Mensajes & Cotizaciones
  readonly mensajes = signal<MensajeAdmin[]>([
    {
      id: 'msg-1',
      remitente: 'Dr. Fernando Hoyos',
      email: 'fhoyos@clinica.com',
      telefono: '+57 314 555 1234',
      asunto: 'Cotización Casa Campestre Llanogrande (Lote 2,500m2)',
      contenido: 'Cordial saludo. He utilizado el simulador Studio CAD 2 para diseñar una residencia con 3 alcobas y piscina infinity. Me gustaría agendar una cita presencial con un arquitecto senior para revisar viabilidad estructural y cotización formal.',
      fecha: '2026-07-01 14:30',
      leido: false,
      tipo: 'cotizacion',
      presupuesto: '$450,000 USD'
    },
    {
      id: 'msg-2',
      remitente: 'Andrea Mejía',
      email: 'amejia@gmail.com',
      telefono: '+57 318 222 3344',
      asunto: 'Consulta sobre materiales y concreto blanco',
      contenido: 'Hola Sysmicon. Estoy interesada en remodelar la fachada de mi casa en El Retiro usando concreto blanco expuesto y madera teca. ¿Ustedes realizan proyectos de remodelación arquitectónica o solo obra nueva desde cero?',
      fecha: '2026-07-01 10:15',
      leido: false,
      tipo: 'contacto_general'
    },
    {
      id: 'msg-3',
      remitente: 'Arq. Mateo Echavarría',
      email: 'mechavarria@arq-estudio.co',
      telefono: '+57 310 999 0000',
      asunto: 'Exportación de planos DWG desde Studio CAD 2',
      contenido: 'Excelente herramienta el nuevo Studio CAD 2. Queremos saber si existe la posibilidad de exportar los arreglos de bloques directamente a formato DWG o DXF para integrarlos a nuestros flujos en AutoCAD y Revit.',
      fecha: '2026-06-30 18:45',
      leido: true,
      tipo: 'asistencia_cad'
    }
  ]);

  // 8. Reportes
  readonly reportes = signal<ReporteAdmin[]>([
    { id: 'rep-1', titulo: 'Balance Comercial & Cotizaciones H1 2026', tipo: 'financiero', periodo: 'Enero - Junio 2026', fechaGeneracion: '2026-07-01', formato: 'PDF', tamano: '4.2 MB' },
    { id: 'rep-2', titulo: 'Rendimiento y Uso del Simulador Studio CAD 2', tipo: 'cad_studio', periodo: 'Junio 2026', fechaGeneracion: '2026-06-30', formato: 'EXCEL', tamano: '1.8 MB' },
    { id: 'rep-3', titulo: 'Auditoría Operativa de Proyectos Residenciales', tipo: 'operativo', periodo: 'Q2 2026', fechaGeneracion: '2026-06-28', formato: 'PDF', tamano: '6.5 MB' }
  ]);

  constructor() {}

  // --- MÉTODOS CRUD CAD 2 ---
  agregarBloque(nuevo: Omit<BloqueAdmin, 'id' | 'fechaCreacion'>): void {
    const id = 'blk-' + Date.now().toString().slice(-4);
    const bloqueCompleto: BloqueAdmin = {
      ...nuevo,
      id,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    this.bloquesCAD.update(list => [bloqueCompleto, ...list]);
  }

  editarBloque(id: string, datos: Partial<BloqueAdmin>): void {
    this.bloquesCAD.update(list =>
      list.map(b => b.id === id ? { ...b, ...datos } : b)
    );
  }

  toggleActivoBloque(id: string): void {
    this.bloquesCAD.update(list =>
      list.map(b => b.id === id ? { ...b, activo: !b.activo } : b)
    );
  }

  eliminarBloque(id: string): void {
    this.bloquesCAD.update(list => list.filter(b => b.id !== id));
  }

  // --- MÉTODOS USUARIOS ---
  toggleEstadoUsuario(id: string): void {
    this.usuarios.update(list =>
      list.map(u => {
        if (u.id === id) {
          const nuevoEstado = u.estado === 'activo' ? 'suspendido' : 'activo';
          return { ...u, estado: nuevoEstado };
        }
        return u;
      })
    );
  }

  eliminarUsuario(id: string): void {
    this.usuarios.update(list => list.filter(u => u.id !== id));
  }

  // --- MÉTODOS MENSAJES ---
  marcarMensajeLeido(id: string): void {
    this.mensajes.update(list =>
      list.map(m => m.id === id ? { ...m, leido: true } : m)
    );
  }

  eliminarMensaje(id: string): void {
    this.mensajes.update(list => list.filter(m => m.id !== id));
  }

  // --- MÉTODOS CMS ---
  actualizarCms(nuevaConfig: Partial<CmsConfig>): void {
    this.cmsConfig.update(actual => ({ ...actual, ...nuevaConfig }));
  }

  // --- MÉTODOS REPORTES ---
  generarReporte(titulo: string, tipo: 'financiero' | 'operativo' | 'cad_studio', formato: 'PDF' | 'EXCEL' | 'CSV'): void {
    const nuevoReporte: ReporteAdmin = {
      id: 'rep-' + Date.now().toString().slice(-4),
      titulo,
      tipo,
      periodo: 'Julio 2026',
      fechaGeneracion: new Date().toISOString().split('T')[0],
      formato,
      tamano: (Math.random() * 5 + 1).toFixed(1) + ' MB'
    };
    this.reportes.update(list => [nuevoReporte, ...list]);
  }
}
