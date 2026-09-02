import { Component, inject, signal, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, MensajeAdmin } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col min-h-0 space-y-3 animate-fade font-sans overflow-hidden">
      
      <!-- =====================================================
           ENCABEZADO COMPACTO DE ALTA GAMA (SIN SCROLL)
           ===================================================== -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-neutral-200/80 shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-[11px] tracking-[0.25em] text-neutral-400 font-bold uppercase">
              BANDEJA DE ENTRADA & COTIZACIONES
            </span>
          </div>
          <h1 class="font-serif text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight leading-tight mt-0.5">
            Bandeja & <span class="font-bold">Cotizaciones</span>
          </h1>
        </div>
        
        <div class="flex items-center gap-2.5">
          <!-- Botón Sincronizar -->
          <button (click)="recargarMensajes()" title="Sincronizar con la base de datos"
                  class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-all shadow-2xs cursor-pointer font-mono text-xs font-bold">
            <svg class="w-3.5 h-3.5 text-neutral-600" [class.animate-spin]="cargando()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Sincronizar</span>
          </button>

          <!-- Contador Sin Leer -->
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 font-mono text-xs font-bold text-neutral-800 shadow-2xs">
            <svg class="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>Sin leer: <span class="text-neutral-900 font-black">{{ countSinLeer() }}</span></span>
          </div>
        </div>
      </div>

      <!-- ALERTA TOAST NOTIFICACIÓN FLOTANTE -->
      <div *ngIf="notificacionTexto()" class="p-2.5 rounded-xl bg-neutral-900 text-white text-xs flex items-center justify-between animate-fade font-sans shadow-md shrink-0">
        <div class="flex items-center gap-2.5 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ notificacionTexto() }}</span>
        </div>
        <button (click)="notificacionTexto.set('')" class="text-neutral-400 hover:text-white font-bold p-1 cursor-pointer text-xs">✕</button>
      </div>

      <!-- BARRA DE FILTRO Y BÚSQUEDA COMPACTA -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <!-- Buscador -->
        <div class="relative w-full sm:w-72">
          <svg class="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por cliente, correo o asunto..."
                 class="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 text-xs placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-2xs">
        </div>

        <!-- Filtros de Tipo -->
        <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none font-mono">
          <button (click)="filtroTipo.set('todos')"
                  [class]="filtroTipo() === 'todos' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'"
                  class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shadow-2xs">
            Todos ({{ adminService.mensajes().length }})
          </button>
          <button (click)="filtroTipo.set('no_leidos')"
                  [class]="filtroTipo() === 'no_leidos' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'"
                  class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shadow-2xs">
            Sin leer ({{ countSinLeer() }})
          </button>
          <button (click)="filtroTipo.set('cotizacion')"
                  [class]="filtroTipo() === 'cotizacion' ? 'bg-black text-white font-bold' : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'"
                  class="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shadow-2xs">
            Cotizaciones
          </button>
        </div>
      </div>

      <!-- =====================================================
           CONTENEDOR SPLIT: SIN SCROLL EXTERNO (FLEX-1 MIN-H-0)
           ===================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
        
        <!-- ── COLUMNA IZQUIERDA: LISTA DE MENSAJES (Col 1-5) ── -->
        <div class="lg:col-span-5 bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col h-full overflow-hidden">
          <div class="pb-2.5 border-b border-neutral-100 mb-2.5 flex items-center justify-between font-mono">
            <span class="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Buzón de Entrada</span>
            <span class="text-[11px] text-neutral-500 font-bold">{{ mensajesFiltrados().length }} mensaje(s)</span>
          </div>

          <!-- Listado con Scroll Interno -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin font-sans">
            
            <div *ngFor="let m of mensajesFiltrados()" 
                 (click)="seleccionarMensaje(m)"
                 [ngClass]="mensajeSeleccionado()?.id === m.id ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-black' : 'bg-neutral-50/70 hover:bg-neutral-100/80 border border-neutral-200/70 text-neutral-800'"
                 class="p-3.5 rounded-xl transition-all cursor-pointer relative group">
              
              <!-- Cabecera del Item -->
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="flex items-center gap-2 min-w-0">
                  <span *ngIf="!m.leido" 
                        class="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" 
                        [title]="'Mensaje nuevo sin leer'"></span>
                  <span class="font-bold text-xs sm:text-sm truncate" 
                        [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-white' : 'text-neutral-900'">
                    {{ m.remitente }}
                  </span>
                </div>
                <span class="text-[10px] font-mono shrink-0" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-400' : 'text-neutral-400'">
                  {{ formatearFechaCorta(m.fecha || m.created_at) }}
                </span>
              </div>

              <!-- Asunto -->
              <span class="text-xs font-semibold block truncate mb-1" 
                    [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-200' : 'text-neutral-700'">
                {{ m.asunto }}
              </span>

              <!-- Snippet / Extracto -->
              <p class="text-[11px] line-clamp-1 leading-relaxed font-light" 
                 [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-neutral-400' : 'text-neutral-500'">
                {{ m.contenido }}
              </p>

              <!-- Footer del Item con Tags -->
              <div class="mt-2.5 flex items-center justify-between pt-1.5 border-t" 
                   [ngClass]="mensajeSeleccionado()?.id === m.id ? 'border-neutral-800' : 'border-neutral-200/60'">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'bg-white/10 text-neutral-200' : 'bg-neutral-200/80 text-neutral-700'">
                  {{ m.tipo ? m.tipo.replace('_', ' ') : 'COTIZACIÓN' }}
                </span>
                <span *ngIf="m.presupuesto" class="text-[11px] font-mono font-bold" 
                      [ngClass]="mensajeSeleccionado()?.id === m.id ? 'text-emerald-400' : 'text-neutral-900'">
                  {{ m.presupuesto }}
                </span>
              </div>
            </div>

            <!-- Estado Vacío Vectorial de Alta Gama -->
            <div *ngIf="mensajesFiltrados().length === 0" class="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 gap-2.5">
              <div class="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/70 flex items-center justify-center text-neutral-600 shadow-2xs">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7"/>
                  <path d="M22 13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4"/>
                  <path d="M6 17v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"/>
                  <path d="m16 9-4 4-4-4"/>
                </svg>
              </div>
              <h5 class="font-serif font-bold text-neutral-800 text-sm">Bandeja al día</h5>
              <p class="text-xs text-neutral-500 max-w-[200px] font-light leading-snug">
                No hay cotizaciones pendientes. Las nuevas solicitudes web se mostrarán en vivo.
              </p>
            </div>

          </div>
        </div>

        <!-- ── COLUMNA DERECHA: DETALLE EDITORIAL & ACCIÓN (Col 6-12) ── -->
        <div class="lg:col-span-7 bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xs flex flex-col justify-between h-full overflow-hidden">
          
          <ng-container *ngIf="mensajeSeleccionado() as msg; else vistaSinSeleccion">
            
            <div class="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
              <div class="overflow-y-auto pr-1 scrollbar-thin space-y-4 flex-1">
                
                <!-- Toolbar Superior del Mensaje -->
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
                  <div class="flex items-center gap-2 font-mono">
                    <span class="text-[10px] px-2.5 py-0.5 rounded-md bg-black text-white font-bold uppercase tracking-wider">
                      {{ msg.tipo ? msg.tipo.replace('_', ' ') : 'COTIZACIÓN' }}
                    </span>
                    <span *ngIf="msg.presupuesto" class="text-[10px] px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold">
                      Presupuesto: {{ msg.presupuesto }}
                    </span>
                  </div>

                  <!-- Botones de Acción -->
                  <div class="flex items-center gap-2">
                    <button (click)="alternarLeido(msg)" [title]="msg.leido ? 'Marcar como no leído' : 'Marcar como leído'"
                            class="px-3 py-1 rounded-lg border border-neutral-200 text-xs font-mono font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="msg.leido ? 'bg-neutral-400' : 'bg-emerald-500'"></span>
                      <span>{{ msg.leido ? 'Leído' : 'Nuevo' }}</span>
                    </button>
                    
                    <button (click)="eliminarMensaje(msg)" title="Eliminar mensaje permanentemente"
                            class="px-3 py-1 rounded-lg border border-neutral-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>

                <!-- Título / Asunto Monumental -->
                <div>
                  <h2 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                    {{ msg.asunto }}
                  </h2>
                </div>

                <!-- Grid de Datos de Contacto Limpio (Compacto) -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-neutral-100 text-xs font-sans">
                  <div>
                    <span class="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Cliente</span>
                    <span class="font-bold text-neutral-900 text-xs sm:text-sm block truncate">{{ msg.remitente }}</span>
                  </div>
                  
                  <div>
                    <span class="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Correo</span>
                    <a [href]="'mailto:' + msg.email" class="text-neutral-900 font-semibold hover:underline truncate block">
                      {{ msg.email }}
                    </a>
                  </div>

                  <div>
                    <span class="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Teléfono</span>
                    <span class="font-mono text-neutral-800 truncate block">{{ msg.telefono || 'Sin teléfono' }}</span>
                  </div>

                  <div>
                    <span class="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Fecha Recibido</span>
                    <span class="font-mono text-neutral-500 truncate block">{{ msg.fecha || msg.created_at || 'Reciente' }}</span>
                  </div>
                </div>

                <!-- Cuerpo del Mensaje (Lectura Clara) -->
                <div>
                  <span class="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Mensaje / Detalle de la Consulta:</span>
                  <div class="text-neutral-800 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                    {{ msg.contenido }}
                  </div>
                </div>

              </div>

              <!-- Consola de Respuesta Rápida Compacta -->
              <div class="pt-3 border-t border-neutral-200/80 space-y-2 shrink-0">
                <div class="flex items-center justify-between">
                  <label class="block text-neutral-700 font-bold uppercase tracking-wider text-[11px] font-mono">
                    Responder a {{ msg.remitente }}:
                  </label>
                  <a *ngIf="msg.telefono" [href]="'https://wa.me/' + sanitizarTelefono(msg.telefono)" target="_blank"
                     class="text-xs text-emerald-700 hover:text-emerald-900 font-mono font-bold inline-flex items-center gap-1">
                    <span>Contactar por WhatsApp</span> ↗
                  </a>
                </div>

                <div class="flex flex-col sm:flex-row gap-2.5">
                  <textarea [(ngModel)]="textoRespuesta" rows="2" placeholder="Escribe tu mensaje o propuesta de cita..."
                            class="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs sm:text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none font-sans"></textarea>
                  
                  <button (click)="enviarRespuesta(msg)" 
                          class="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] self-end cursor-pointer whitespace-nowrap">
                    Enviar Respuesta
                  </button>
                </div>
              </div>

            </div>

          </ng-container>

          <!-- ── VISTA CUANDO NO HAY MENSAJE SELECCIONADO O BANDEJA VACÍA ── -->
          <ng-template #vistaSinSeleccion>
            <div class="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-6 font-sans gap-3">
              <div class="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-600 shadow-2xs">
                <svg class="w-7 h-7 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
              </div>
              <h4 class="font-serif text-lg font-bold text-neutral-900">Bandeja de Consultas</h4>
              <p class="text-xs sm:text-sm text-neutral-500 max-w-sm font-light leading-relaxed">
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
