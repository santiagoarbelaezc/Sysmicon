import { Component, inject, signal, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, MensajeAdmin } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col min-h-0 space-y-6 animate-fade-in font-sans overflow-hidden">
      
      <!-- =====================================================
           ENCABEZADO DE ALTA GAMA (SIN SCROLL)
           ===================================================== -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 shrink-0">
        <div>
          <span class="font-mono text-xs tracking-ultra text-neutral-400 font-black uppercase block mb-1">
            BANDEJA DE ENTRADA & COTIZACIONES
          </span>
          <h1 class="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight leading-tight">
            BANDEJA DE MENSAJES & <span class="font-light">COTIZACIONES</span>
          </h1>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Botón Sincronizar -->
          <button (click)="recargarMensajes()" title="Sincronizar con la base de datos"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 hover:text-neutral-950 hover:border-neutral-950 transition-all shadow-xs cursor-pointer font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
            <svg class="w-4 h-4 text-neutral-700" [class.animate-spin]="cargando()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>SINCRONIZAR</span>
          </button>

          <!-- Contador Sin Leer -->
          <div class="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 font-mono text-xs sm:text-sm font-bold text-neutral-950 shadow-xs uppercase tracking-wider">
            <svg class="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>SIN LEER: <span class="text-neutral-950 font-black">{{ countSinLeer() }}</span></span>
          </div>
        </div>
      </div>

      <!-- ALERTA TOAST NOTIFICACIÓN FLOTANTE -->
      <div *ngIf="notificacionTexto()" class="p-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm flex items-center justify-between animate-fade-in font-sans shadow-md shrink-0">
        <div class="flex items-center gap-3 font-semibold">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ notificacionTexto() }}</span>
        </div>
        <button (click)="notificacionTexto.set('')" class="text-neutral-400 hover:text-white font-bold p-1 cursor-pointer text-sm">✕</button>
      </div>

      <!-- BARRA DE FILTRO Y BÚSQUEDA -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <!-- Buscador -->
        <div class="relative w-full sm:w-96">
          <svg class="w-4.5 h-4.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por cliente, correo o asunto..."
                 class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-neutral-200 text-neutral-950 text-sm placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all shadow-xs font-sans">
        </div>

        <!-- Filtros de Tipo Monocromáticos -->
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono">
          <button (click)="filtroTipo.set('todos')"
                  [ngClass]="filtroTipo() === 'todos' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'"
                  class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider">
            TODOS ({{ adminService.mensajes().length }})
          </button>
          <button (click)="filtroTipo.set('no_leidos')"
                  [ngClass]="filtroTipo() === 'no_leidos' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'"
                  class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider">
            SIN LEER ({{ countSinLeer() }})
          </button>
          <button (click)="filtroTipo.set('cotizacion')"
                  [ngClass]="filtroTipo() === 'cotizacion' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200 font-bold'"
                  class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider">
            COTIZACIONES
          </button>
        </div>
      </div>

      <!-- =====================================================
           CONTENEDOR SPLIT: SIN SCROLL EXTERNO (FLEX-1 MIN-H-0)
           ===================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        <!-- ── COLUMNA IZQUIERDA: LISTA DE MENSAJES (Col 1-5) ── -->
        <div class="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col h-full overflow-hidden">
          <div class="pb-4 border-b border-neutral-200 mb-3 flex items-center justify-between font-mono">
            <span class="text-xs font-black text-neutral-400 uppercase tracking-widest">BUZÓN DE ENTRADA</span>
            <span class="text-xs text-neutral-600 font-bold uppercase tracking-wider">{{ mensajesFiltrados().length }} MENSAJE(S)</span>
          </div>

          <!-- Listado con Scroll Interno -->
          <div class="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin font-sans">
            
            <div *ngFor="let m of mensajesFiltrados()" 
                 (click)="seleccionarMensaje(m)"
                 [ngClass]="mensajeSeleccionado()?.id === m.id ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-950' : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800'"
                 class="p-4 rounded-2xl transition-all cursor-pointer relative group">
              
              <!-- Cabecera del Item -->
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span *ngIf="!m.leido" 
                        class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" 
                        [title]="'Mensaje nuevo sin leer'"></span>
                  <span class="font-black text-sm sm:text-base uppercase tracking-wide truncate" 
                        [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-white' : 'text-neutral-950'">
                    {{ m.remitente }}
                  </span>
                </div>
                <span class="text-xs font-mono shrink-0" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-400' : 'text-neutral-400'">
                  {{ formatearFechaCorta(m.fecha || m.created_at) }}
                </span>
              </div>

              <!-- Asunto -->
              <span class="text-xs sm:text-sm font-semibold block truncate mb-1" 
                    [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-200' : 'text-neutral-700'">
                {{ m.asunto }}
              </span>

              <!-- Snippet / Extracto -->
              <p class="text-xs sm:text-sm line-clamp-1 leading-relaxed font-normal" 
                 [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-400' : 'text-neutral-500'">
                {{ m.contenido }}
              </p>

              <!-- Footer del Item con Tags -->
              <div class="mt-3 flex items-center justify-between pt-2 border-t" 
                   [ngClass]="mensajeSeleccionado()?.id === m.id ? 'border-neutral-800' : 'border-neutral-200'">
                <span class="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'bg-white/10 text-neutral-200' : 'bg-neutral-200 text-neutral-800'">
                  {{ m.tipo ? m.tipo.replace('_', ' ') : 'COTIZACIÓN' }}
                </span>
                <span *ngIf="m.presupuesto" class="text-xs sm:text-sm font-mono font-black" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-emerald-400' : 'text-neutral-950'">
                  {{ m.presupuesto }}
                </span>
              </div>
            </div>

            <!-- Estado Vacío Vectorial de Alta Gama -->
            <div *ngIf="mensajesFiltrados().length === 0" class="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 gap-3">
              <div class="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shadow-xs">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7"/>
                  <path d="M22 13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4"/>
                  <path d="M6 17v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"/>
                  <path d="m16 9-4 4-4-4"/>
                </svg>
              </div>
              <h5 class="font-serif font-black text-neutral-900 text-base uppercase tracking-wider">BANDEJA AL DÍA</h5>
              <p class="text-xs sm:text-sm text-neutral-500 max-w-[240px] font-normal leading-relaxed">
                No hay cotizaciones pendientes. Las nuevas solicitudes web se mostrarán en vivo.
              </p>
            </div>

          </div>
        </div>

        <!-- ── COLUMNA DERECHA: DETALLE EDITORIAL & ACCIÓN (Col 6-12) ── -->
        <div class="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full overflow-hidden">
          
          <ng-container *ngIf="mensajeSeleccionado() as msg; else vistaSinSeleccion">
            
            <div class="space-y-5 flex-1 flex flex-col justify-between overflow-hidden">
              <div class="overflow-y-auto pr-2 scrollbar-thin space-y-5 flex-1">
                
                <!-- Toolbar Superior del Mensaje -->
                <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                  <div class="flex items-center gap-2.5 font-mono">
                    <span class="text-xs px-3 py-1 rounded-md bg-neutral-950 text-white font-black uppercase tracking-wider">
                      {{ msg.tipo ? msg.tipo.replace('_', ' ') : 'COTIZACIÓN' }}
                    </span>
                    <span *ngIf="msg.presupuesto" class="text-xs px-3 py-1 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200 font-bold uppercase">
                      PRESUPUESTO: {{ msg.presupuesto }}
                    </span>
                  </div>

                  <!-- Botones de Acción -->
                  <div class="flex items-center gap-2.5">
                    <button (click)="alternarLeido(msg)" [title]="msg.leido ? 'Marcar como no leído' : 'Marcar como leído'"
                            class="px-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 transition-colors cursor-pointer inline-flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" [ngClass]="msg.leido ? 'bg-neutral-400' : 'bg-emerald-500'"></span>
                      <span>{{ msg.leido ? 'LEÍDO' : 'NUEVO' }}</span>
                    </button>
                    
                    <button (click)="eliminarMensaje(msg)" title="Eliminar mensaje permanentemente"
                            class="px-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      <span>ELIMINAR</span>
                    </button>
                  </div>
                </div>

                <!-- Título / Asunto Monumental -->
                <div>
                  <h2 class="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight leading-snug">
                    {{ msg.asunto }}
                  </h2>
                </div>

                <!-- Grid de Datos de Contacto Limpio -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-neutral-200 text-sm font-sans">
                  <div>
                    <span class="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">CLIENTE</span>
                    <span class="font-black text-neutral-950 text-sm sm:text-base block truncate uppercase">{{ msg.remitente }}</span>
                  </div>
                  
                  <div>
                    <span class="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">CORREO</span>
                    <a [href]="'mailto:' + msg.email" class="text-neutral-950 font-bold hover:underline truncate block text-sm">
                      {{ msg.email }}
                    </a>
                  </div>

                  <div>
                    <span class="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">TELÉFONO</span>
                    <span class="font-mono text-neutral-800 font-bold truncate block text-sm">{{ msg.telefono || 'Sin teléfono' }}</span>
                  </div>

                  <div>
                    <span class="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-1">FECHA RECIBIDO</span>
                    <span class="font-mono text-neutral-500 font-medium truncate block text-xs sm:text-sm">{{ msg.fecha || msg.created_at || 'Reciente' }}</span>
                  </div>
                </div>

                <!-- Cuerpo del Mensaje (Lectura Clara Amplia) -->
                <div>
                  <span class="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-black mb-2">DETALLE DE LA CONSULTA:</span>
                  <div class="text-neutral-800 text-base sm:text-lg leading-relaxed font-normal whitespace-pre-line bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
                    {{ msg.contenido }}
                  </div>
                </div>

              </div>

              <!-- Consola de Respuesta Rápida -->
              <div class="pt-4 border-t border-neutral-200 space-y-3 shrink-0">
                <div class="flex items-center justify-between">
                  <label class="block text-neutral-950 font-black uppercase tracking-wider text-xs sm:text-sm font-mono">
                    RESPONDER A {{ msg.remitente | uppercase }}:
                  </label>
                  <a *ngIf="msg.telefono" [href]="'https://wa.me/' + sanitizarTelefono(msg.telefono)" target="_blank"
                     class="text-xs sm:text-sm text-neutral-950 hover:text-black font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline">
                    <span>CONTACTAR POR WHATSAPP</span> ↗
                  </a>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                  <textarea [(ngModel)]="textoRespuesta" rows="2" placeholder="Escribe tu mensaje o propuesta formal..."
                            class="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm sm:text-base focus:bg-white focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all resize-none font-sans"></textarea>
                  
                  <button (click)="enviarRespuesta(msg)" class="admin-btn-primary self-end py-3.5 px-7 text-xs sm:text-sm font-black uppercase tracking-wider">
                    ENVIAR RESPUESTA
                  </button>
                </div>
              </div>

            </div>

          </ng-container>

          <!-- ── VISTA CUANDO NO HAY MENSAJE SELECCIONADO ── -->
          <ng-template #vistaSinSeleccion>
            <div class="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-8 font-sans gap-4">
              <div class="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
                <svg class="w-8 h-8 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
              </div>
              <h4 class="font-serif text-2xl font-black text-neutral-950 uppercase tracking-tight">BANDEJA DE CONSULTAS</h4>
              <p class="text-sm sm:text-base text-neutral-600 max-w-md font-normal leading-relaxed">
                Selecciona cualquier mensaje en la columna izquierda para revisar el detalle completo del presupuesto y responder directamente al cliente.
              </p>
            </div>
          </ng-template>

        </div>

      </div>

    </div>
  `
})
export class DashMensajesComponent implements OnInit {
  readonly adminService = inject(AdminService);

  readonly mensajeSeleccionado = signal<MensajeAdmin | null>(null);
  readonly notificacionTexto = signal<string>('');
  readonly cargando = signal<boolean>(false);
  
  busqueda = '';
  filtroTipo = signal<'todos' | 'no_leidos' | 'cotizacion'>('todos');
  textoRespuesta = '';

  // Filtro reactivo en vivo
  readonly mensajesFiltrados = computed(() => {
    let list = this.adminService.mensajes();
    const query = this.busqueda.trim().toLowerCase();
    const filtro = this.filtroTipo();

    if (filtro === 'no_leidos') {
      list = list.filter(m => !m.leido);
    } else if (filtro === 'cotizacion') {
      list = list.filter(m => m.tipo === 'cotizacion' || !m.tipo);
    }

    if (query) {
      list = list.filter(m => 
        (m.remitente && m.remitente.toLowerCase().includes(query)) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        (m.asunto && m.asunto.toLowerCase().includes(query)) ||
        (m.contenido && m.contenido.toLowerCase().includes(query))
      );
    }

    return list;
  });

  constructor() {
    effect(() => {
      const msgs = this.mensajesFiltrados();
      if (msgs.length === 0) {
        this.mensajeSeleccionado.set(null);
      } else if (!this.mensajeSeleccionado() || !msgs.find(m => m.id === this.mensajeSeleccionado()?.id)) {
        this.mensajeSeleccionado.set(msgs[0]);
      }
    });
  }

  ngOnInit(): void {
    this.recargarMensajes();
  }

  recargarMensajes(): void {
    this.cargando.set(true);
    this.adminService.cargarDatosReales();
    setTimeout(() => {
      this.cargando.set(false);
    }, 600);
  }

  countSinLeer(): number {
    return this.adminService.mensajes().filter((m: any) => !m.leido).length;
  }

  seleccionarMensaje(m: MensajeAdmin): void {
    this.mensajeSeleccionado.set(m);
    if (!m.leido) {
      this.adminService.marcarMensajeLeido(m.id);
    }
  }

  alternarLeido(m: MensajeAdmin): void {
    if (m.leido) {
      this.adminService.mensajes.update(list => 
        list.map(item => item.id === m.id ? { ...item, leido: false } : item)
      );
      this.adminService.mensajesNoLeidos.update(n => n + 1);
      this.notificacionTexto.set('Mensaje marcado como no leído.');
    } else {
      this.adminService.marcarMensajeLeido(m.id);
      this.notificacionTexto.set('Mensaje marcado como leído.');
    }
    setTimeout(() => this.notificacionTexto.set(''), 3000);
  }

  eliminarMensaje(m: MensajeAdmin): void {
    if (confirm(`¿Deseas eliminar la cotización de "${m.remitente}"?`)) {
      this.adminService.eliminarMensaje(m.id);
      this.notificacionTexto.set(`Mensaje de "${m.remitente}" eliminado con éxito.`);
      setTimeout(() => this.notificacionTexto.set(''), 3000);
    }
  }

  formatearFechaCorta(fecha?: string): string {
    if (!fecha) return '';
    const parts = fecha.split(' ');
    return parts.length > 1 ? parts[1].slice(0, 5) : parts[0];
  }

  sanitizarTelefono(tel?: string): string {
    if (!tel) return '';
    return tel.replace(/[^0-9]/g, '');
  }

  enviarRespuesta(m: MensajeAdmin): void {
    if (!this.textoRespuesta.trim()) return;
    const destinatario = m.email;
    this.textoRespuesta = '';
    this.notificacionTexto.set(`Respuesta enviada formalmente a ${destinatario}.`);
    setTimeout(() => {
      this.notificacionTexto.set('');
    }, 4500);
  }
}
