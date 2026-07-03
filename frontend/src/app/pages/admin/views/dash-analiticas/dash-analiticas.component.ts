import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-analiticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Analíticas y Comportamiento CAD 2</h2>
          <p class="text-xs text-gray-400 mt-1 font-sans">Monitoreo de interacción en tiempo real y embudos de conversión del cotizador por bloques.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs px-3 py-1.5 rounded-xl bg-[#0D0D0D] border border-white/10 text-gray-300 font-mono">📅 Últimos 30 días</span>
          <button class="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-xs transition-all cursor-pointer">Exportar Datos (.CSV)</button>
        </div>
      </div>

      <!-- Métricas Clave (3 Tarjetas con trazos técnicos) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1 font-sans">Tiempo en Simulador CAD</span>
          <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.analiticas().tiempoPromedioCAD }}</span>
          <p class="text-[11px] text-gray-400 mt-2 font-mono">● Desempeño estable vs. mes anterior</p>
        </div>
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1 font-sans">Tasa de Rebote (Bounce Rate)</span>
          <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.analiticas().tasaRebote }}</span>
          <p class="text-[11px] text-gray-400 mt-2 font-mono">● Medición de carga optimizada</p>
        </div>
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-5 shadow-lg overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1 font-sans">Conversión (Cotización Formal)</span>
          <span class="font-serif text-3xl font-extrabold text-white">24.8%</span>
          <p class="text-[11px] text-gray-400 mt-2 font-mono">● Promedio de 1 de cada 4 usuarios</p>
        </div>
      </div>

      <!-- Embudo de Conversión (Funnel en Escala de Grises) -->
      <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden">
        <!-- Trazos de plano -->
        <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
        
        <h3 class="font-serif text-lg font-bold text-white mb-2">Embudo de Conversión del Usuario Residencial</h3>
        <p class="text-xs text-gray-400 mb-6 font-sans">Paso a paso desde la llegada al Home hasta la reunión arquitectónica</p>

        <div class="space-y-5 max-w-4xl font-sans">
          
          <!-- Paso 1 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs font-bold text-white">
              <span>1. Visita al Sitio Web (Home / Hero)</span>
              <span class="font-mono">100% (11,960 visitantes)</span>
            </div>
            <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
              <div class="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs font-bold text-white">
              <span>2. Ingreso al Simulador Studio CAD 2</span>
              <span class="font-mono">64.2% (7,678 usuarios)</span>
            </div>
            <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
              <div class="w-[64.2%] h-full bg-white/70 rounded-full"></div>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs font-bold text-white">
              <span>3. Bloques Arrastrados y Diseño Guardado</span>
              <span class="font-mono">38.5% (4,604 usuarios)</span>
            </div>
            <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
              <div class="w-[38.5%] h-full bg-white/45 rounded-full"></div>
            </div>
          </div>

          <!-- Paso 4 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs font-bold text-white">
              <span>4. Solicitud de Presupuesto y Contacto Senior</span>
              <span class="font-mono">24.8% (2,966 leads)</span>
            </div>
            <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
              <div class="w-[24.8%] h-full bg-white/20 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Dispositivos y Origen -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <h3 class="font-serif text-lg font-bold text-white mb-4">Dispositivos de Uso</h3>
          <div class="space-y-4 font-sans">
            <div *ngFor="let disp of adminService.analiticas().dispositivos" class="space-y-1.5">
              <div class="flex justify-between text-xs text-gray-300 font-bold">
                <span>{{ disp.tipo }}</span>
                <span class="font-mono">{{ disp.porcentaje }}%</span>
              </div>
              <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full" [style.width.%]="disp.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden">
          <!-- Trazos de plano -->
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
          <h3 class="font-serif text-lg font-bold text-white mb-4">Top Ciudades & Regiones</h3>
          <div class="space-y-3 text-xs font-sans">
            <div class="flex justify-between items-center p-2.5 rounded-lg bg-[#0C0C0C] border border-white/5">
              <span class="text-white font-bold">📍 Oriente Antioqueño (Llanogrande / Retiro)</span>
              <span class="text-white font-bold font-mono">54%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-lg bg-[#0C0C0C] border border-white/5">
              <span class="text-white font-bold">📍 Medellín (Poblado / Envigado)</span>
              <span class="text-gray-300 font-mono">26%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-lg bg-[#0C0C0C] border border-white/5">
              <span class="text-white font-bold">📍 Bogotá D.C. & Sabana Norte</span>
              <span class="text-gray-300 font-mono">12%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-lg bg-[#0C0C0C] border border-white/5">
              <span class="text-white font-bold">✈️ Internacional (Inversionistas Miami / Madrid)</span>
              <span class="text-gray-300 font-mono">8%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashAnaliticasComponent {
  readonly adminService = inject(AdminService);
}
