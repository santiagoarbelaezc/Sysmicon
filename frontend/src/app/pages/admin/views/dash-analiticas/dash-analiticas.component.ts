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
          <p class="text-xs text-gray-400 mt-1">Monitoreo de interacción en tiempo real y embudos de conversión del cotizador por bloques.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs px-3 py-1.5 rounded-xl bg-[#161616] border border-white/10 text-gray-300">📅 Últimos 30 días</span>
          <button class="px-3 py-1.5 rounded-xl bg-wood-accent text-[#111] font-bold text-xs hover:bg-wood-light transition-colors">Exportar Datos (.CSV)</button>
        </div>
      </div>

      <!-- Métricas Clave (3 Tarjetas) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Tiempo en Simulador CAD</span>
          <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.analiticas().tiempoPromedioCAD }}</span>
          <p class="text-[11px] text-emerald-400 mt-2">↑ +3.2 mins vs. mes anterior</p>
        </div>
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Tasa de Rebote (Bounce Rate)</span>
          <span class="font-serif text-3xl font-extrabold text-white">{{ adminService.analiticas().tasaRebote }}</span>
          <p class="text-[11px] text-emerald-400 mt-2">↓ -4.1% optimización móvil</p>
        </div>
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Conversión (Cotización Formal)</span>
          <span class="font-serif text-3xl font-extrabold text-white">24.8%</span>
          <p class="text-[11px] text-wood-light mt-2">★ 1 de cada 4 usuarios cotiza</p>
        </div>
      </div>

      <!-- Embudo de Conversión (Funnel) -->
      <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 class="font-serif text-lg font-bold text-white mb-2">Embudo de Conversión del Usuario Residencial</h3>
        <p class="text-xs text-gray-400 mb-6">Paso a paso desde la llegada al Home hasta la reunión arquitectónica</p>

        <div class="space-y-4 max-w-4xl">
          
          <!-- Paso 1 -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>1. Visita al Sitio Web (Home / Hero)</span>
              <span>100% (11,960 visitantes)</span>
            </div>
            <div class="w-full h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="w-full h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>2. Ingreso al Simulador Studio CAD 2</span>
              <span>64.2% (7,678 usuarios)</span>
            </div>
            <div class="w-full h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="w-[64.2%] h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
            </div>
          </div>

          <!-- Paso 3 -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>3. Bloques Arrastrados y Diseño Guardado</span>
              <span>38.5% (4,604 usuarios)</span>
            </div>
            <div class="w-full h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="w-[38.5%] h-full bg-gradient-to-r from-wood-accent to-wood-light rounded-full"></div>
            </div>
          </div>

          <!-- Paso 4 -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span>4. Solicitud de Presupuesto y Contacto Senior</span>
              <span>24.8% (2,966 leads)</span>
            </div>
            <div class="w-full h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="w-[24.8%] h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Dispositivos y Origen -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 class="font-serif text-lg font-bold text-white mb-4">Dispositivos de Uso</h3>
          <div class="space-y-4">
            <div *ngFor="let disp of adminService.analiticas().dispositivos" class="space-y-1.5">
              <div class="flex justify-between text-xs text-gray-300 font-bold">
                <span>{{ disp.tipo }}</span>
                <span>{{ disp.porcentaje }}%</span>
              </div>
              <div class="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-wood-accent rounded-full" [style.width.%]="disp.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 class="font-serif text-lg font-bold text-white mb-4">Top Ciudades & Regiones</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-center p-2.5 rounded-xl bg-[#161616] border border-white/5">
              <span class="text-white font-bold">📍 Oriente Antioqueño (Llanogrande / Retiro)</span>
              <span class="text-wood-light font-bold">54%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-xl bg-[#161616] border border-white/5">
              <span class="text-white font-bold">📍 Medellín (Poblado / Envigado)</span>
              <span class="text-gray-300">26%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-xl bg-[#161616] border border-white/5">
              <span class="text-white font-bold">📍 Bogotá D.C. & Sabana Norte</span>
              <span class="text-gray-300">12%</span>
            </div>
            <div class="flex justify-between items-center p-2.5 rounded-xl bg-[#161616] border border-white/5">
              <span class="text-white font-bold">✈️ Internacional (Inversionistas Miami / Madrid)</span>
              <span class="text-gray-300">8%</span>
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
