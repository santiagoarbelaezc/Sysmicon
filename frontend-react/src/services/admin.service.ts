import { createSignal, useSignal } from '../core/signal';
import { httpClient, tap } from '../core/apiClient';
import { environment } from '../core/env';

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

class AdminService {
  private readonly apiUrl = environment.apiUrl;

  readonly kpis = createSignal({
    totalCotizaciones: 0,
    disenosCADGuardados: 0,
    usuariosRegistrados: 0,
    ingresoEstimadoUSD: 0,
    crecimientoMensual: '0%'
  });

  readonly analiticas = createSignal({
    visitasDiarias: [] as { dia: string; visitas: number; conversiones: number }[],
    tiempoPromedioCAD: '0 mins',
    tasaRebote: '0%',
    dispositivos: [
      { tipo: 'Desktop / Laptop (CAD Pro)', porcentaje: 70 },
      { tipo: 'Móvil / Tablet (Exploración)', porcentaje: 30 }
    ]
  });

  readonly bloquesCAD = createSignal<BloqueAdmin[]>([]);

  readonly estadisticas = createSignal({
    categoriasPopulares: [] as { categoria: string; porcentaje: number; totalDisenos: number }[],
    presupuestosPromedio: [] as { rango: string; porcentaje: number }[]
  });

  readonly cmsConfig = createSignal<CmsConfig>({
    heroTagline: 'DISEÑO Y CONSTRUCCIÓN EN ORIENTE ANTIOQUEÑO',
    heroSubtagline: 'Versatilidad y excelencia en cada detalle residencial',
    telefonoContacto: '+57 (300) 987-6543',
    emailSoporte: 'arquitectura@sysmicon.com',
    instagramHandle: '@sysmicon',
    mostrarBannerAlerta: false,
    textoBannerAlerta: ''
  });

  readonly usuarios = createSignal<UsuarioAdmin[]>([]);
  readonly mensajes = createSignal<MensajeAdmin[]>([]);
  readonly reportes = createSignal<ReporteAdmin[]>([]);
  readonly mensajesNoLeidos = createSignal<number>(0);
  readonly isLiveBackend = createSignal<boolean>(false);
  readonly cargandoDatos = createSignal<boolean>(false);

  cargarDatosReales(): void {
    this.cargandoDatos.set(true);

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

  toggleEstadoUsuario(id: string | number): void {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.toggleEstadoUsuarioApi(numericId).subscribe({
        next: (res: any) => {
          const nuevoEstado = res?.data?.estado;
          this.usuarios.update(list =>
            list.map(u => {
              if (u.id === id || Number(u.id) === numericId) {
                return { ...u, estado: nuevoEstado || (u.estado === 'activo' ? 'suspendido' : 'activo') };
              }
              return u;
            })
          );
        },
        error: (err) => {
          const msg = err?.error?.error || 'No fue posible cambiar el estado del usuario.';
          alert(msg);
        }
      });
    } else {
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
  }

  eliminarUsuario(id: string | number): void {
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      this.eliminarUsuarioApi(numericId).subscribe({
        next: () => {
          this.usuarios.update(list => list.filter(u => u.id !== id && Number(u.id) !== numericId));
        },
        error: (err) => {
          const msg = err?.error?.error || 'No fue posible retirar al usuario.';
          alert(msg);
        }
      });
    } else {
      this.usuarios.update(list => list.filter(u => u.id !== id));
    }
  }

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

  actualizarCms(nuevaConfig: Partial<CmsConfig>): void {
    this.cmsConfig.update(actual => ({ ...actual, ...nuevaConfig }));
  }

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

  getDashboard() {
    return httpClient.get<ApiResponse<{ kpis: DashboardKpis; ultimos_mensajes: MensajeAdmin[]; top_paginas: any[] }>>(`${this.apiUrl}/admin/dashboard`);
  }

  getProyectos(page = 1, perPage = 20) {
    return httpClient.get<PaginatedResponse<ProyectoAdmin>>(`${this.apiUrl}/admin/proyectos`, {
      params: { page, per_page: perPage }
    });
  }

  crearProyecto(formData: FormData) {
    return httpClient.post<ApiResponse<{ id: number }>>(`${this.apiUrl}/admin/proyectos`, formData);
  }

  editarProyecto(id: number, datos: Partial<ProyectoAdmin>) {
    return httpClient.put<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}`, datos);
  }

  toggleProyecto(id: number) {
    return httpClient.patch<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}/toggle`, {});
  }

  eliminarProyectoApi(id: number) {
    return httpClient.delete<ApiResponse<null>>(`${this.apiUrl}/admin/proyectos/${id}`);
  }

  subirImagenProyecto(proyectoId: number, file: File) {
    const fd = new FormData();
    fd.append('imagen', file);
    return httpClient.post<ApiResponse<{ id: number; url: string }>>(
      `${this.apiUrl}/admin/proyectos/${proyectoId}/imagenes`, fd
    );
  }

  eliminarImagenProyecto(proyectoId: number, imgId: number) {
    return httpClient.delete<ApiResponse<null>>(
      `${this.apiUrl}/admin/proyectos/${proyectoId}/imagenes/${imgId}`
    );
  }

  getMensajesApi(
    page = 1,
    perPage = 20,
    filtros: { tipo?: string; leido?: number; archivado?: number } = {}
  ) {
    return httpClient.get<PaginatedResponse<MensajeAdmin>>(`${this.apiUrl}/admin/mensajes`, {
      params: { page, per_page: perPage, ...filtros }
    });
  }

  getMensajeApi(id: number) {
    return httpClient.get<ApiResponse<MensajeAdmin>>(`${this.apiUrl}/admin/mensajes/${id}`);
  }

  marcarMensajeLeidoApi(id: number) {
    return httpClient.patch<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}/leer`, {}).pipe(
      tap(() => this.mensajesNoLeidos.update(n => Math.max(0, n - 1)))
    );
  }

  archivarMensaje(id: number) {
    return httpClient.patch<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}/archivar`, {});
  }

  eliminarMensajeApi(id: number) {
    return httpClient.delete<ApiResponse<null>>(`${this.apiUrl}/admin/mensajes/${id}`);
  }

  getResumenAnaliticas(dias = 30) {
    return httpClient.get<ApiResponse<any>>(`${this.apiUrl}/admin/analytics/resumen`, { params: { dias } });
  }

  getVisitasPorDia(dias = 30) {
    return httpClient.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/visitas`, { params: { dias } });
  }

  getPaginasMasVisitadas(dias = 30, limit = 10) {
    return httpClient.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/paginas`, { params: { dias, limit } });
  }

  getDispositivos(dias = 30) {
    return httpClient.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/analytics/dispositivos`, { params: { dias } });
  }

  getUsuariosApi(page = 1, perPage = 20) {
    return httpClient.get<PaginatedResponse<UsuarioAdmin>>(`${this.apiUrl}/admin/usuarios`, {
      params: { page, per_page: perPage }
    });
  }

  toggleEstadoUsuarioApi(id: number) {
    return httpClient.patch<ApiResponse<{ estado: string }>>(`${this.apiUrl}/admin/usuarios/${id}/estado`, {});
  }

  eliminarUsuarioApi(id: number) {
    return httpClient.delete<ApiResponse<null>>(`${this.apiUrl}/admin/usuarios/${id}`);
  }
}

export const adminService = new AdminService();

export function useAdminService() {
  const kpis = useSignal(adminService.kpis);
  const analiticas = useSignal(adminService.analiticas);
  const bloquesCAD = useSignal(adminService.bloquesCAD);
  const estadisticas = useSignal(adminService.estadisticas);
  const cmsConfig = useSignal(adminService.cmsConfig);
  const usuarios = useSignal(adminService.usuarios);
  const mensajes = useSignal(adminService.mensajes);
  const reportes = useSignal(adminService.reportes);
  const mensajesNoLeidos = useSignal(adminService.mensajesNoLeidos);
  const isLiveBackend = useSignal(adminService.isLiveBackend);
  const cargandoDatos = useSignal(adminService.cargandoDatos);

  return {
    kpis,
    analiticas,
    bloquesCAD,
    estadisticas,
    cmsConfig,
    usuarios,
    mensajes,
    reportes,
    mensajesNoLeidos,
    isLiveBackend,
    cargandoDatos,
    service: adminService,
  };
}
