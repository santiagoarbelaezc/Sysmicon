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

  // 1. KPIs Generales del Dashboard (Valores iniciales en cero, sincronizados con la BD)
  readonly kpis = signal({
    totalCotizaciones: 0,
    disenosCADGuardados: 0,
    usuariosRegistrados: 0,
    ingresoEstimadoUSD: 0,
    crecimientoMensual: '0%'
  });

  // 2. Analíticas Detalladas (Cargadas desde el backend)
  readonly analiticas = signal({
    visitasDiarias: [] as { dia: string; visitas: number; conversiones: number }[],
    tiempoPromedioCAD: '0 mins',
    tasaRebote: '0%',
    dispositivos: [
      { tipo: 'Desktop / Laptop (CAD Pro)', porcentaje: 70 },
      { tipo: 'Móvil / Tablet (Exploración)', porcentaje: 30 }
    ]
  });

  // 3. Catálogo CAD 2D
  readonly bloquesCAD = signal<BloqueAdmin[]>([]);

  // 4. Estadísticas
  readonly estadisticas = signal({
    categoriasPopulares: [] as { categoria: string; porcentaje: number; totalDisenos: number }[],
    presupuestosPromedio: [] as { rango: string; porcentaje: number }[]
  });

  // 5. CMS Personalizar Sitio
  readonly cmsConfig = signal<CmsConfig>({
    heroTagline: 'DISEÑO Y CONSTRUCCIÓN EN ORIENTE ANTIOQUEÑO',
    heroSubtagline: 'Versatilidad y excelencia en cada detalle residencial',
    telefonoContacto: '+57 (300) 987-6543',
    emailSoporte: 'arquitectura@sysmicon.com',
    instagramHandle: '@sysmicon',
    mostrarBannerAlerta: false,
    textoBannerAlerta: ''
  });

  // 6. Usuarios Registrados (Sincronizados en vivo con la tabla usuarios)
  readonly usuarios = signal<UsuarioAdmin[]>([]);

  // 7. Mensajes & Cotizaciones (Sincronizados en vivo con la tabla mensajes)
  readonly mensajes = signal<MensajeAdmin[]>([]);

  // 8. Reportes
  readonly reportes = signal<ReporteAdmin[]>([]);

  readonly mensajesNoLeidos = signal<number>(0);
  readonly isLiveBackend = signal<boolean>(false);
  readonly cargandoDatos = signal<boolean>(false);

  constructor() {}

  // ── CARGA AUTOMÁTICA DE DATOS REALES DEL BACKEND ─────────────────────────
  cargarDatosReales(): void {
    this.cargandoDatos.set(true);

    // 1. Cargar Dashboard & KPIs
    this.getDashboard().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.isLiveBackend.set(true);
          const d = res.data;
          if (d.kpis) {
            this.kpis.update(prev => ({
              ...prev,
              totalCotizaciones: d.kpis.mensajes_este_mes || d.kpis.mensajes_no_leidos || prev.totalCotizaciones,
              usuariosRegistrados: d.kpis.usuarios_activos || prev.usuariosRegistrados,
              crecimientoMensual: d.kpis.crecimiento_24h_pct !== null ? `${d.kpis.crecimiento_24h_pct > 0 ? '+' : ''}${d.kpis.crecimiento_24h_pct}%` : prev.crecimientoMensual
            }));
            this.mensajesNoLeidos.set(d.kpis.mensajes_no_leidos || 0);
          }
          if (d.ultimos_mensajes && Array.isArray(d.ultimos_mensajes)) {
            this.isLiveBackend.set(true);
            if (d.ultimos_mensajes.length > 0) {
              this.mensajes.set(d.ultimos_mensajes.map((m: any) => ({
                id: m.id,
                remitente: m.remitente || m.nombre || 'Contacto Web',
                email: m.email || '',
                telefono: m.telefono || '',
                asunto: m.asunto || 'Cotización Arquitectónica',
                contenido: m.contenido || m.mensaje || '',
                fecha: m.created_at || m.fecha || '',
                created_at: m.created_at,
                leido: Boolean(Number(m.leido)),
                tipo: m.tipo || 'cotizacion',
                presupuesto: m.presupuesto || m.presupuesto_estimado || ''
              })));
            }
          }
        }
        this.cargandoDatos.set(false);
      },
      error: () => {
        this.cargandoDatos.set(false);
      }
    });

    // 2. Cargar Mensajes Completos desde MySQL
    this.getMensajesApi(1, 100).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.isLiveBackend.set(true);
          this.mensajes.set(res.data.map((m: any) => ({
            id: m.id,
            remitente: m.remitente || m.nombre || 'Contacto Web',
            email: m.email || '',
            telefono: m.telefono || '',
            asunto: m.asunto || 'Cotización Arquitectónica',
            contenido: m.contenido || m.mensaje || '',
            fecha: m.created_at || m.fecha || '',
            created_at: m.created_at,
            leido: Boolean(Number(m.leido)),
            tipo: m.tipo || 'cotizacion',
            presupuesto: m.presupuesto || m.presupuesto_estimado || ''
          })));
        }
      },
      error: () => {}
    });

    // 3. Cargar Usuarios Reales
    this.getUsuariosApi(1, 50).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.usuarios.set(res.data.map((u: any) => ({
            id: u.id,
            nombre: u.nombre || u.email.split('@')[0],
            email: u.email || '',
            telefono: u.telefono || '+57 300 000 0000',
            rol: u.rol || 'propietario',
            estado: u.estado || 'activo',
            fechaRegistro: u.created_at ? u.created_at.split(' ')[0] : '2026-06-01',
            proyectosGuardados: u.proyectos_count || 1
          })));
        }
      },
      error: () => {}
    });

    // 4. Cargar Analíticas de Visitas
    this.getVisitasPorDia(7).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.analiticas.update(prev => ({
            ...prev,
            visitasDiarias: res.data.map((v: any) => ({
              dia: v.dia || v.fecha || 'Hoy',
              visitas: v.total_vistas || v.visitas || 100,
              conversiones: v.sesiones_unicas || v.conversiones || 10
            }))
          }));
        }
      },
      error: () => {}
    });
  }

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

  // ── MÉTODOS USUARIOS (Signals + API Real) ──────────────────────────────────

  toggleEstadoUsuario(id: string | number): void {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.toggleEstadoUsuarioApi(numericId).subscribe({
        next: () => {},
        error: () => {}
      });
    }
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
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.eliminarUsuarioApi(numericId).subscribe({
        next: () => {},
        error: () => {}
      });
    }
    this.usuarios.update(list => list.filter(u => u.id !== id));
  }

  // ── MÉTODOS MENSAJES (Signals + API Real) ──────────────────────────────────

  marcarMensajeLeido(id: string | number): void {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.marcarMensajeLeidoApi(numericId).subscribe({
        next: () => {},
        error: () => {}
      });
    }
    this.mensajes.update(list =>
      list.map(m => m.id === id ? { ...m, leido: true } : m)
    );
    this.mensajesNoLeidos.update(n => Math.max(0, n - 1));
  }

  eliminarMensaje(id: string | number): void {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.eliminarMensajeApi(numericId).subscribe({
        next: () => {},
        error: () => {}
      });
    }
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
