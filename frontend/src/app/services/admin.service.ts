import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Modelos e Interfaces del Panel Administrativo ───────────────────────────

export interface BloqueAdmin {
  id: string;
  nombre: string;
  categoria: 'alcobas' | 'cocina' | 'area-comun' | 'muro' | 'columnas' | 'estacionamiento' | 'piscina' | 'bano';
  imagen: string;
  areaM2: number;
  precioUSD: number;
  activo: boolean;
  fechaCreacion: string;
}

export interface UsuarioAdmin {
  id: string | number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'propietario' | 'arquitecto' | 'inversionista' | 'admin' | 'usuario';
  estado: 'activo' | 'suspendido' | 'pendiente';
  fechaRegistro?: string;
  created_at?: string;
  avatar_url?: string;
  proyectosGuardados?: number;
}

export interface MensajeAdmin {
  id: string | number;
  remitente: string;
  email: string;
  telefono?: string;
  asunto: string;
  contenido: string;
  fecha?: string;
  created_at?: string;
  leido: boolean;
  archivado?: boolean;
  tipo: 'cotizacion' | 'contacto_general' | 'asistencia_cad' | 'agendar_cita';
  presupuesto?: string;
  tipo_servicio?: string;
  ubicacion_proyecto?: string;
  fecha_cita_solicitada?: string;
  hora_preferida?: string;
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

export interface DashboardKpis {
  visitas_totales: number;
  visitas_hoy: number;
  visitas_ayer: number;
  sesiones_unicas: number;
  mensajes_no_leidos: number;
  mensajes_este_mes: number;
  proyectos_activos: number;
  proyectos_total: number;
  usuarios_activos: number;
  crecimiento_24h_pct: number | null;
}

export interface ProyectoAdmin {
  id: number;
  titulo: string;
  subtitulo?: string;
  categoria: string;
  descripcion?: string;
  imagen_url?: string;
  area_m2?: number;
  anio?: number;
  ubicacion?: string;
  destacado: boolean;
  activo: boolean;
  caracteristicas?: string[];
  editorial_title?: string;
  editorial_subtitle?: string;
  editorial_slogan?: string;
  editorial_badge?: string;
  editorial_style?: string;
  barcode?: string;
  imagenes_adicionales?: { id: number; url: string; orden: number }[];
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Servicio AdminService ───────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // 1. KPIs Generales del Dashboard
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
    { id: 'alc-1', nombre: 'Master Suite & Vestier Privado', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba1.png', areaM2: 45, precioUSD: 65000, activo: true, fechaCreacion: '2026-01-15' },
    { id: 'alc-2', nombre: 'Suite Secundaria Doble con Terraza', categoria: 'alcobas', imagen: '/assets/images/arquitectura/alcobas/alcoba2.png', areaM2: 28, precioUSD: 38000, activo: true, fechaCreacion: '2026-01-18' },
    { id: 'coc-1', nombre: 'Cocina Integral con Isla Gourmet', categoria: 'cocina', imagen: '/assets/images/arquitectura/cocina/cocina1.png', areaM2: 35, precioUSD: 58000, activo: true, fechaCreacion: '2026-02-01' },
    { id: 'com-1', nombre: 'Sala de Estar Doble Altura con Chimenea', categoria: 'area-comun', imagen: '/assets/images/arquitectura/area-comun/comun1.png', areaM2: 50, precioUSD: 72000, activo: true, fechaCreacion: '2026-02-10' },
    { id: 'est-1', nombre: 'Garaje Doble Cubierto', categoria: 'estacionamiento', imagen: '/assets/images/arquitectura/estacionamiento/congarage.png', areaM2: 40, precioUSD: 38000, activo: true, fechaCreacion: '2026-02-14' },
    { id: 'pis-2', nombre: 'Piscina Infinity & Solárium', categoria: 'piscina', imagen: '/assets/images/arquitectura/piscina/piscina.png', areaM2: 55, precioUSD: 75000, activo: true, fechaCreacion: '2026-03-01' },
    { id: 'ban-1', nombre: 'Baño Principal con Jacuzzi & Ducha', categoria: 'bano', imagen: '/assets/images/arquitectura/bano/bano1.png', areaM2: 12, precioUSD: 18000, activo: true, fechaCreacion: '2026-03-05' },
    { id: 'mur-1', nombre: 'Muro de Contención Estructural 10m', categoria: 'muro', imagen: '/assets/images/arquitectura/muro/muro-contencion.png', areaM2: 15, precioUSD: 8500, activo: true, fechaCreacion: '2026-03-10' },
    { id: 'col-1', nombre: 'Columna Cuadrada Concreto Arquitectónico', categoria: 'columnas', imagen: '/assets/images/arquitectura/columnas/cuadrada.png', areaM2: 5, precioUSD: 3500, activo: true, fechaCreacion: '2026-03-12' }
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

  readonly mensajesNoLeidos = signal<number>(0);

  constructor() {}

  // ── MÉTODOS CRUD CAD 2 (Signals) ─────────────────────────────────────────

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

  // ── MÉTODOS USUARIOS (Signals) ───────────────────────────────────────────

  toggleEstadoUsuario(id: string | number): void {
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

  eliminarUsuario(id: string | number): void {
    this.usuarios.update(list => list.filter(u => u.id !== id));
  }

  // ── MÉTODOS MENSAJES (Signals) ───────────────────────────────────────────

  marcarMensajeLeido(id: string | number): void {
    this.mensajes.update(list =>
      list.map(m => m.id === id ? { ...m, leido: true } : m)
    );
    this.mensajesNoLeidos.update(n => Math.max(0, n - 1));
  }

  eliminarMensaje(id: string | number): void {
    this.mensajes.update(list => list.filter(m => m.id !== id));
  }

  // ── MÉTODOS CMS (Signals) ────────────────────────────────────────────────

  actualizarCms(nuevaConfig: Partial<CmsConfig>): void {
    this.cmsConfig.update(actual => ({ ...actual, ...nuevaConfig }));
  }

  // ── MÉTODOS REPORTES (Signals) ───────────────────────────────────────────

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

  // =========================================================================
  // MÉTODOS HTTP CON EL BACKEND PHP REST API
  // =========================================================================

  // ── Dashboard ────────────────────────────────────────────────────────────
  getDashboard(): Observable<ApiResponse<{ kpis: DashboardKpis; ultimos_mensajes: MensajeAdmin[]; top_paginas: any[] }>> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard`);
  }

  // ── Proyectos ────────────────────────────────────────────────────────────
  getProyectos(page = 1, perPage = 20): Observable<PaginatedResponse<ProyectoAdmin>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);
    return this.http.get<PaginatedResponse<ProyectoAdmin>>(`${this.apiUrl}/admin/proyectos`, { params });
  }

  crearProyecto(formData: FormData): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(`${this.apiUrl}/admin/proyectos`, formData);
  }

  editarProyecto(id: number, datos: Partial<ProyectoAdmin>): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}`, datos);
  }

  toggleProyecto(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}/toggle`, {});
  }

  eliminarProyectoApi(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}`);
  }

  subirImagenProyecto(proyectoId: number, file: File): Observable<ApiResponse<{ id: number; url: string }>> {
    const fd = new FormData();
    fd.append('imagen', file);
    return this.http.post<ApiResponse<{ id: number; url: string }>>(
      `${this.apiUrl}/admin/proyectos/${proyectoId}/imagenes`, fd
    );
  }

  eliminarImagenProyecto(proyectoId: number, imgId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/admin/proyectos/${proyectoId}/imagenes/${imgId}`
    );
  }

  // ── Mensajes HTTP ────────────────────────────────────────────────────────
  getMensajesApi(
    page = 1,
    perPage = 20,
    filtros: { tipo?: string; leido?: number; archivado?: number } = {}
  ): Observable<PaginatedResponse<MensajeAdmin>> {
    let params = new HttpParams().set('page', page).set('per_page', perPage);
    if (filtros.tipo !== undefined) params = params.set('tipo', filtros.tipo);
    if (filtros.leido !== undefined) params = params.set('leido', filtros.leido);
    if (filtros.archivado !== undefined) params = params.set('archivado', filtros.archivado);
    return this.http.get<PaginatedResponse<MensajeAdmin>>(`${this.apiUrl}/admin/mensajes`, { params });
  }

  getMensajeApi(id: number): Observable<ApiResponse<MensajeAdmin>> {
    return this.http.get<ApiResponse<MensajeAdmin>>(`${this.apiUrl}/admin/mensajes/${id}`);
  }

  marcarMensajeLeidoApi(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}/leer`, {}).pipe(
      tap(() => this.mensajesNoLeidos.update(n => Math.max(0, n - 1)))
    );
  }

  archivarMensaje(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}/archivar`, {});
  }

  eliminarMensajeApi(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}`);
  }

  // ── Analytics HTTP ───────────────────────────────────────────────────────
  getResumenAnaliticas(dias = 30): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('dias', dias);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/analytics/resumen`, { params });
  }

  getVisitasPorDia(dias = 30): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('dias', dias);
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/visitas`, { params });
  }

  getPaginasMasVisitadas(dias = 30, limit = 10): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('dias', dias).set('limit', limit);
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/paginas`, { params });
  }

  getDispositivos(dias = 30): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('dias', dias);
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/dispositivos`, { params });
  }

  // ── Usuarios HTTP ────────────────────────────────────────────────────────
  getUsuariosApi(page = 1, perPage = 20): Observable<PaginatedResponse<UsuarioAdmin>> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);
    return this.http.get<PaginatedResponse<UsuarioAdmin>>(`${this.apiUrl}/admin/usuarios`, { params });
  }

  toggleEstadoUsuarioApi(id: number): Observable<ApiResponse<{ estado: string }>> {
    return this.http.patch<ApiResponse<{ estado: string }>>(`${this.apiUrl}/admin/usuarios/${id}/estado`, {});
  }

  eliminarUsuarioApi(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/usuarios/${id}`);
  }
}
