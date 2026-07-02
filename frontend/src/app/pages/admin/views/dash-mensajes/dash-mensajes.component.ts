import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, MensajeAdmin } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de Sección -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Bandeja de Cotizaciones y Contacto</h2>
          <p class="text-xs text-gray-400 mt-1">Gestión de consultas formales, solicitudes de cita y dudas técnicas de Studio CAD 2.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
            ✉️ Sin leer: {{ countSinLeer() }}
          </span>
        </div>
      </div>

      <!-- Alerta de Respuesta Enviada -->
      <div *ngIf="respuestaEnviada()" class="p-4 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs flex items-center justify-between animate-fade">
        <div class="flex items-center gap-2 font-bold">
          <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>¡Respuesta formal de arquitectura enviada con éxito al correo del cliente!</span>
        </div>
        <button (click)="respuestaEnviada.set(false)" class="text-gray-400 hover:text-white font-bold">✕</button>
      </div>

      <!-- Contenedor Dividido (Bandeja izquierda / Detalle derecha) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        
        <!-- Lista de Mensajes (Col 1-5) -->
        <div class="lg:col-span-5 bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col h-full overflow-hidden">
          <div class="pb-3 border-b border-white/10 mb-3 flex items-center justify-between">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Buzón Recibidos</span>
            <span class="text-[11px] text-gray-500">{{ adminService.mensajes().length }} mensajes</span>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin font-sans">
            <div *ngFor="let m of adminService.mensajes()" 
                 (click)="seleccionarMensaje(m)"
                 [ngClass]="mensajeSeleccionado()?.id === m.id ? 'bg-wood-accent/20 border-wood-accent text-white' : 'bg-[#161616] hover:bg-[#1C1C1C] border-white/5 text-gray-300'"
                 class="p-3.5 rounded-xl border transition-all cursor-pointer relative group">
              
              <div class="flex items-start justify-between gap-2 mb-1">
                <span class="font-bold text-xs truncate max-w-[180px] flex items-center gap-1.5">
                  <span *ngIf="!m.leido" class="w-2 h-2 rounded-full bg-wood-accent inline-block shrink-0" title="Mensaje Nuevo"></span>
                  {{ m.remitente }}
                </span>
                <span class="text-[10px] text-gray-500 whitespace-nowrap">{{ m.fecha.split(' ')[1] }}</span>
              </div>

              <span class="text-[11px] font-bold text-gray-400 block truncate mb-1">{{ m.asunto }}</span>
              <p class="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{{ m.contenido }}</p>

              <div class="mt-2.5 flex items-center justify-between">
                <span [ngClass]="{
                        'bg-emerald-950/60 text-emerald-300 border-emerald-800/40': m.tipo === 'cotizacion',
                        'bg-blue-950/60 text-blue-300 border-blue-800/40': m.tipo === 'contacto_general',
                        'bg-purple-950/60 text-purple-300 border-purple-800/40': m.tipo === 'asistencia_cad'
                      }"
                      class="px-2 py-0.5 rounded text-[9px] font-bold uppercase border">
                  {{ m.tipo.replace('_', ' ') }}
                </span>
                <span *ngIf="m.presupuesto" class="text-[10px] font-serif font-extrabold text-emerald-400">{{ m.presupuesto }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Detalle y Lectura (Col 6-12) -->
        <div class="lg:col-span-7 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full overflow-y-auto">
          
          <div *ngIf="mensajeSeleccionado() as msg; else sinSeleccion" class="space-y-6 flex-1 flex flex-col justify-between font-sans">
            <div>
              <!-- Encabezado del Mensaje -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs px-2 py-0.5 rounded bg-wood-accent text-[#111] font-bold uppercase">{{ msg.tipo.replace('_', ' ') }}</span>
                    <span *ngIf="msg.presupuesto" class="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-serif font-extrabold">{{ msg.presupuesto }}</span>
                  </div>
                  <h3 class="font-serif text-xl font-extrabold text-white">{{ msg.asunto }}</h3>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="adminService.eliminarMensaje(msg.id)" title="Eliminar Mensaje" class="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/80 text-red-400 text-xs font-bold transition-colors">
                    🗑️ Borrar
                  </button>
                </div>
              </div>

              <!-- Info Remitente -->
              <div class="p-3.5 rounded-xl bg-[#161616] border border-white/5 my-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Cliente / Remitente:</span>
                  <span class="text-white font-bold text-sm">{{ msg.remitente }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Correo Electrónico:</span>
                  <a [href]="'mailto:' + msg.email" class="text-wood-light font-bold hover:underline">{{ msg.email }}</a>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Teléfono Directo:</span>
                  <a [href]="'tel:' + msg.telefono" class="text-gray-300 font-bold hover:text-white">{{ msg.telefono }}</a>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Fecha / Hora:</span>
                  <span class="text-gray-400">{{ msg.fecha }}</span>
                </div>
              </div>

              <!-- Contenido del Mensaje -->
              <div class="p-5 rounded-2xl bg-[#0A0D14] border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {{ msg.contenido }}
              </div>
            </div>

            <!-- Caja de Respuesta -->
            <div class="pt-4 border-t border-white/10 mt-6">
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-2">Responder de forma oficial desde Sysmicon Arquitectura:</label>
              <div class="flex gap-3">
                <textarea [(ngModel)]="textoRespuesta" rows="2" placeholder="Escribe tu respuesta formal para agendar cita o enviar presupuesto..."
                          class="flex-1 px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:border-wood-accent focus:outline-none"></textarea>
                <button (click)="enviarRespuesta(msg)" 
                        class="px-5 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold text-xs transition-all shadow-lg self-end py-3 cursor-pointer">
                  📤 Enviar
                </button>
              </div>
            </div>

          </div>

          <!-- Template Sin Selección -->
          <ng-template #sinSeleccion>
            <div class="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
              <span class="text-5xl block mb-3">📬</span>
              <h4 class="font-serif text-lg font-bold text-white mb-1">Selecciona una cotización del buzón</h4>
              <p class="text-xs max-w-sm">Haz clic en cualquiera de los mensajes de la columna izquierda para leer los detalles arquitectónicos y responder formalmente.</p>
            </div>
          </ng-template>

        </div>

      </div>

    </div>
  `
})
export class DashMensajesComponent {
  readonly adminService = inject(AdminService);

  readonly mensajeSeleccionado = signal<MensajeAdmin | null>(this.adminService.mensajes()[0] || null);
  readonly respuestaEnviada = signal<boolean>(false);
  textoRespuesta = '';

  countSinLeer(): number {
    return this.adminService.mensajes().filter((m: any) => !m.leido).length;
  }

  seleccionarMensaje(m: MensajeAdmin): void {
    this.mensajeSeleccionado.set(m);
    if (!m.leido) {
      this.adminService.marcarMensajeLeido(m.id);
    }
  }

  enviarRespuesta(m: MensajeAdmin): void {
    if (!this.textoRespuesta.trim()) return;
    this.textoRespuesta = '';
    this.respuestaEnviada.set(true);
    setTimeout(() => {
      this.respuestaEnviada.set(false);
    }, 4000);
  }
}
