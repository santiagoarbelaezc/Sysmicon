import { createSignal, useSignal } from '../core/signal';
import { httpClient } from '../core/apiClient';
import { environment } from '../core/env';

export type EtapaOportunidad = 'contacto' | 'visita' | 'propuesta' | 'negociacion' | 'ganado' | 'perdido';
export type FaseProyecto = 'diseno' | 'licencias' | 'obra' | 'entregado';
export type EstadoProyecto = 'activo' | 'pausado' | 'terminado';
export type TipoCliente = 'persona' | 'empresa';
export type OrigenCliente = 'referido' | 'web' | 'redes' | 'otro';
export type TipoActividad = 'llamada' | 'reunion' | 'email' | 'nota' | 'visita';
export type TipoPqr = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
export type EstadoPqr = 'radicado' | 'en_tramite' | 'respondido' | 'cerrado';
export type EstadoPropuesta = 'borrador' | 'enviada' | 'aceptada' | 'rechazada';

export interface CrmKpis {
  clientes_totales: number;
  leads_ultimos_30_dias: number;
  pipeline_valor_estimado: number;
  pipeline_oportunidades_activas: number;
  tasa_conversion_ganadas: number;
  proyectos_activos: number;
}

export interface ClienteCrm {
  id: number;
  tipo: TipoCliente;
  nombre: string;
  documento?: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  direccion?: string;
  origen: OrigenCliente;
  notas?: string;
  responsable_id?: number;
  responsable?: { id: number; nombre: string };
  contactos?: ContactoCrm[];
  oportunidades?: OportunidadCrm[];
  proyectos?: ProyectoCrm[];
  created_at?: string;
}

export interface ContactoCrm {
  id: number;
  cliente_id: number;
  nombre: string;
  cargo?: string;
  email?: string;
  telefono?: string;
  es_principal: boolean;
}

export interface OportunidadCrm {
  id: number;
  cliente_id: number;
  cliente?: { id: number; nombre: string; telefono?: string };
  titulo: string;
  tipo_servicio: string;
  etapa: EtapaOportunidad;
  probabilidad: number;
  valor_estimado: number;
  fecha_cierre_estimada?: string;
  responsable_id?: number;
  responsable?: { id: number; nombre: string };
  motivo_perdida?: string;
  orden?: number;
  created_at?: string;
}

export interface KanbanColumna {
  etapa: EtapaOportunidad;
  total_items: number;
  valor_acumulado: number;
  oportunidades: OportunidadCrm[];
}

export interface PropuestaCrm {
  id: number;
  oportunidad_id: number;
  consecutivo: string;
  titulo: string;
  alcance?: string;
  valor_total: number;
  moneda: string;
  estado: EstadoPropuesta;
  version: number;
  archivo_url?: string;
  created_at?: string;
}

export interface HitoCrm {
  id: number;
  proyecto_id: number;
  nombre: string;
  descripcion?: string;
  fecha_estimada?: string;
  fecha_real?: string;
  completado: boolean;
  orden: number;
}

export interface ProyectoCrm {
  id: number;
  cliente_id: number;
  cliente?: { id: number; nombre: string };
  oportunidad_id?: number;
  nombre: string;
  tipo: string;
  fase: FaseProyecto;
  estado: EstadoProyecto;
  direccion_obra?: string;
  fecha_inicio?: string;
  fecha_estimada_fin?: string;
  presupuesto: number;
  responsable_id?: number;
  responsable?: { id: number; nombre: string };
  hitos?: HitoCrm[];
  progreso_porcentaje?: number;
  created_at?: string;
}

export interface TareaCrm {
  id: number;
  titulo: string;
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta';
  fecha_vencimiento?: string;
  completada: boolean;
  asignado_a?: number;
  asignado?: { id: number; nombre: string };
  cliente_id?: number;
  cliente?: { id: number; nombre: string };
  proyecto_id?: number;
  proyecto?: { id: number; nombre: string };
  created_at?: string;
}

export interface ActividadCrm {
  id: number;
  usuario_id: number;
  usuario?: { id: number; nombre: string };
  cliente_id?: number;
  cliente?: { id: number; nombre: string };
  proyecto_id?: number;
  proyecto?: { id: number; nombre: string };
  tipo: TipoActividad;
  descripcion: string;
  fecha: string;
}

export interface PqrCrm {
  id: number;
  radicado: string;
  tipo: TipoPqr;
  nombre_completo: string;
  correo: string;
  telefono?: string;
  asunto: string;
  descripcion: string;
  estado: EstadoPqr;
  respuesta?: string;
  respondido_por?: number;
  respondido_at?: string;
  fecha_limite_respuesta?: string;
  created_at?: string;
}

export interface CalendarioEvento {
  id: string;
  tipo: string;
  titulo: string;
  fecha: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class CrmService {
  private readonly apiUrl = environment.apiUrl;

  readonly kpis = createSignal<CrmKpis>({
    clientes_totales: 0,
    leads_ultimos_30_dias: 0,
    pipeline_valor_estimado: 0,
    pipeline_oportunidades_activas: 0,
    tasa_conversion_ganadas: 0,
    proyectos_activos: 0,
  });

  readonly pipelineKanban = createSignal<Record<string, KanbanColumna>>({});
  readonly clientes = createSignal<ClienteCrm[]>([]);
  readonly proyectos = createSignal<ProyectoCrm[]>([]);
  readonly tareas = createSignal<TareaCrm[]>([]);
  readonly actividades = createSignal<ActividadCrm[]>([]);
  readonly pqrs = createSignal<PqrCrm[]>([]);
  readonly calendario = createSignal<CalendarioEvento[]>([]);
  readonly cargando = createSignal<boolean>(false);

  async cargarTodo(): Promise<void> {
    this.cargando.set(true);
    try {
      await Promise.allSettled([
        this.cargarKpis(),
        this.cargarPipelineKanban(),
        this.cargarClientes(),
        this.cargarProyectos(),
        this.cargarTareas(),
        this.cargarActividades(),
        this.cargarPqrs(),
        this.cargarCalendario(),
      ]);
    } finally {
      this.cargando.set(false);
    }
  }

  async cargarKpis(): Promise<void> {
    try {
      const res = await httpClient.get<ApiResponse<CrmKpis>>(`${this.apiUrl}/admin/dashboard/kpis`).toPromise();
      if (res?.success && res.data) {
        this.kpis.set(res.data);
      }
    } catch (err) {
      console.warn('Error cargando KPIs CRM:', err);
    }
  }

  async cargarPipelineKanban(): Promise<void> {
    try {
      const res = await httpClient.get<ApiResponse<Record<string, KanbanColumna>>>(`${this.apiUrl}/admin/dashboard/pipeline`).toPromise();
      if (res?.success && res.data) {
        this.pipelineKanban.set(res.data);
      }
    } catch (err) {
      console.warn('Error cargando Pipeline Kanban:', err);
    }
  }

  async cargarClientes(busqueda?: string): Promise<ClienteCrm[]> {
    try {
      const url = busqueda 
        ? `${this.apiUrl}/admin/clientes?q=${encodeURIComponent(busqueda)}`
        : `${this.apiUrl}/admin/clientes`;
      const res = await httpClient.get<ApiResponse<ClienteCrm[]>>(url).toPromise();
      if (res?.success && res.data) {
        this.clientes.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando clientes:', err);
      return [];
    }
  }

  async crearCliente(data: Partial<ClienteCrm>): Promise<ClienteCrm | null> {
    const res = await httpClient.post<ApiResponse<ClienteCrm>>(`${this.apiUrl}/admin/clientes`, data).toPromise();
    if (res?.success && res.data) {
      this.clientes.update((prev) => [res.data, ...prev]);
      this.cargarKpis();
      return res.data;
    }
    return null;
  }

  async actualizarCliente(id: number, data: Partial<ClienteCrm>): Promise<ClienteCrm | null> {
    const res = await httpClient.put<ApiResponse<ClienteCrm>>(`${this.apiUrl}/admin/clientes/${id}`, data).toPromise();
    if (res?.success && res.data) {
      this.clientes.update((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      return res.data;
    }
    return null;
  }

  async eliminarCliente(id: number): Promise<boolean> {
    const res = await httpClient.delete<ApiResponse<null>>(`${this.apiUrl}/admin/clientes/${id}`).toPromise();
    if (res?.success) {
      this.clientes.update((prev) => prev.filter((c) => c.id !== id));
      this.cargarKpis();
      return true;
    }
    return false;
  }

  async cambiarEtapaOportunidad(id: number, etapa: EtapaOportunidad, motivoPerdida?: string): Promise<boolean> {
    const body: Record<string, any> = { etapa };
    if (motivoPerdida) body.motivo_perdida = motivoPerdida;

    const res = await httpClient.patch<ApiResponse<OportunidadCrm>>(`${this.apiUrl}/admin/oportunidades/${id}/etapa`, body).toPromise();
    if (res?.success) {
      await this.cargarPipelineKanban();
      await this.cargarKpis();
      await this.cargarProyectos();
      return true;
    }
    return false;
  }

  async crearOportunidad(data: Partial<OportunidadCrm>): Promise<OportunidadCrm | null> {
    const res = await httpClient.post<ApiResponse<OportunidadCrm>>(`${this.apiUrl}/admin/oportunidades`, data).toPromise();
    if (res?.success && res.data) {
      await this.cargarPipelineKanban();
      await this.cargarKpis();
      return res.data;
    }
    return null;
  }

  async cargarProyectos(): Promise<ProyectoCrm[]> {
    try {
      const res = await httpClient.get<ApiResponse<ProyectoCrm[]>>(`${this.apiUrl}/admin/dashboard/proyectos`).toPromise();
      if (res?.success && res.data) {
        this.proyectos.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando proyectos en curso:', err);
      return [];
    }
  }

  async crearProyecto(data: Partial<ProyectoCrm>): Promise<ProyectoCrm | null> {
    const res = await httpClient.post<ApiResponse<ProyectoCrm>>(`${this.apiUrl}/admin/crm/proyectos`, data).toPromise();
    if (res?.success && res.data) {
      this.proyectos.update((prev) => [res.data, ...prev]);
      await this.cargarKpis();
      return res.data;
    }
    return null;
  }

  async toggleHito(id: number): Promise<boolean> {
    const res = await httpClient.patch<ApiResponse<HitoCrm>>(`${this.apiUrl}/admin/hitos/${id}/completar`, {}).toPromise();
    if (res?.success) {
      await this.cargarProyectos();
      return true;
    }
    return false;
  }

  async crearHito(data: { proyecto_id: number; nombre: string; fecha_estimada?: string }): Promise<HitoCrm | null> {
    const res = await httpClient.post<ApiResponse<HitoCrm>>(`${this.apiUrl}/admin/hitos`, data).toPromise();
    if (res?.success && res.data) {
      await this.cargarProyectos();
      return res.data;
    }
    return null;
  }

  async cargarTareas(): Promise<TareaCrm[]> {
    try {
      const res = await httpClient.get<ApiResponse<TareaCrm[]>>(`${this.apiUrl}/admin/dashboard/tareas`).toPromise();
      if (res?.success && res.data) {
        this.tareas.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando tareas pendientes:', err);
      return [];
    }
  }

  async crearTarea(data: Partial<TareaCrm>): Promise<TareaCrm | null> {
    const res = await httpClient.post<ApiResponse<TareaCrm>>(`${this.apiUrl}/admin/tareas`, data).toPromise();
    if (res?.success && res.data) {
      this.tareas.update((prev) => [res.data, ...prev]);
      return res.data;
    }
    return null;
  }

  async toggleTarea(id: number): Promise<boolean> {
    const res = await httpClient.patch<ApiResponse<TareaCrm>>(`${this.apiUrl}/admin/tareas/${id}/completar`, {}).toPromise();
    if (res?.success) {
      this.tareas.update((prev) => prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)));
      return true;
    }
    return false;
  }

  async eliminarTarea(id: number): Promise<boolean> {
    const res = await httpClient.delete<ApiResponse<null>>(`${this.apiUrl}/admin/tareas/${id}`).toPromise();
    if (res?.success) {
      this.tareas.update((prev) => prev.filter((t) => t.id !== id));
      return true;
    }
    return false;
  }

  async cargarActividades(): Promise<ActividadCrm[]> {
    try {
      const res = await httpClient.get<ApiResponse<ActividadCrm[]>>(`${this.apiUrl}/admin/dashboard/actividad`).toPromise();
      if (res?.success && res.data) {
        this.actividades.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando actividades:', err);
      return [];
    }
  }

  async registrarActividad(data: Partial<ActividadCrm>): Promise<ActividadCrm | null> {
    const res = await httpClient.post<ApiResponse<ActividadCrm>>(`${this.apiUrl}/admin/actividades`, data).toPromise();
    if (res?.success && res.data) {
      this.actividades.update((prev) => [res.data, ...prev]);
      return res.data;
    }
    return null;
  }

  async cargarPqrs(): Promise<PqrCrm[]> {
    try {
      const res = await httpClient.get<ApiResponse<PqrCrm[]>>(`${this.apiUrl}/admin/pqr`).toPromise();
      if (res?.success && res.data) {
        this.pqrs.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando PQRs:', err);
      return [];
    }
  }

  async responderPqr(id: number, respuesta: string): Promise<boolean> {
    const res = await httpClient.post<ApiResponse<PqrCrm>>(`${this.apiUrl}/admin/pqr/${id}/responder`, { respuesta }).toPromise();
    if (res?.success) {
      await this.cargarPqrs();
      return true;
    }
    return false;
  }

  async cambiarEstadoPqr(id: number, estado: EstadoPqr): Promise<boolean> {
    const res = await httpClient.patch<ApiResponse<PqrCrm>>(`${this.apiUrl}/admin/pqr/${id}/estado`, { estado }).toPromise();
    if (res?.success) {
      await this.cargarPqrs();
      return true;
    }
    return false;
  }

  async convertirMensajeEnLead(mensajeId: number | string): Promise<boolean> {
    const res = await httpClient.post<ApiResponse<{ cliente: ClienteCrm; oportunidad: OportunidadCrm }>>(`${this.apiUrl}/admin/mensajes/${mensajeId}/convertir-en-lead`, {}).toPromise();
    if (res?.success) {
      await this.cargarTodo();
      return true;
    }
    return false;
  }

  async cargarCalendario(): Promise<CalendarioEvento[]> {
    try {
      const res = await httpClient.get<ApiResponse<CalendarioEvento[]>>(`${this.apiUrl}/admin/calendario`).toPromise();
      if (res?.success && res.data) {
        this.calendario.set(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('Error cargando calendario:', err);
      return [];
    }
  }
}

export const crmService = new CrmService();

export function useCrmService() {
  const kpis = useSignal(crmService.kpis);
  const pipelineKanban = useSignal(crmService.pipelineKanban);
  const clientes = useSignal(crmService.clientes);
  const proyectos = useSignal(crmService.proyectos);
  const tareas = useSignal(crmService.tareas);
  const actividades = useSignal(crmService.actividades);
  const pqrs = useSignal(crmService.pqrs);
  const calendario = useSignal(crmService.calendario);
  const cargando = useSignal(crmService.cargando);

  return {
    kpis,
    pipelineKanban,
    clientes,
    proyectos,
    tareas,
    actividades,
    pqrs,
    calendario,
    cargando,
  };
}
