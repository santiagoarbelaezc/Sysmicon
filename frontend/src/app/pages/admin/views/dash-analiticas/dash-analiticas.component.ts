import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-analiticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">
            MÉTRICAS & INTELIGENCIA DEL SISTEMA
          </span>
          <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight leading-[1.05]">
            Analíticas & <span class="font-bold">Rendimiento Web</span>
          </h1>
          <p class="font-sans text-sm sm:text-base text-neutral-500 font-light leading-relaxed mt-2.5 max-w-2xl">
            Monitoreo en tiempo real de tráfico, interacción con el portafolio y embudos de conversión de clientes.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-xs px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 font-mono font-semibold">Últimos 30 días</span>
          <button (click)="exportarDatos()" class="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] cursor-pointer">
            Exportar (.CSV)
          </button>
        </div>
      </div>

      <!-- MÉTRICAS CLAVE (3 TARJETAS BLANCAS CON NÚMEROS REALES) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs">
          <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-2.5">Total Visitas Semanales</span>
          <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ totalVisitasSemana() }}</span>
          <p class="text-xs text-neutral-500 mt-3 font-mono font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Tráfico en vivo
          </p>
        </div>

        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs">
          <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-2.5">Cotizaciones Registradas</span>
          <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ adminService.mensajes().length }}</span>
          <p class="text-xs text-emerald-700 mt-3 font-mono font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Leads en base de datos
          </p>
        </div>

        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs">
          <span class="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-2.5">Tasa de Conversión</span>
          <span class="font-serif text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{{ tasaConversion() }}%</span>
          <p class="text-xs text-emerald-700 mt-3 font-mono font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Leads vs. Sesiones
          </p>
        </div>

      </div>

      <!-- EMBUDO DE CONVERSIÓN DINÁMICO -->
      <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div class="pb-3.5 border-b border-neutral-200/80">
          <h3 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Embudo de Conversión de Clientes</h3>
          <p class="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">Recorrido del usuario desde la primera visita hasta la solicitud formal</p>
        </div>

        <div class="space-y-5 max-w-4xl font-sans pt-1">
          
          <!-- Paso 1 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-900">
              <span>1. Visitas Totales al Portal</span>
              <span class="font-mono text-neutral-600">100% ({{ totalVisitasSemana() }} visitas)</span>
            </div>
            <div class="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="w-full h-full bg-black rounded-full"></div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-900">
              <span>2. Exploración de Proyectos y Portafolio</span>
              <span class="font-mono text-neutral-600">{{ totalVisitasSemana() > 0 ? '65%' : '0%' }}</span>
            </div>
            <div class="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="h-full bg-neutral-800 rounded-full" [style.width.%]="totalVisitasSemana() > 0 ? 65 : 0"></div>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-900">
              <span>3. Solicitudes de Cotización & Mensajes Formales</span>
              <span class="font-mono text-emerald-800 font-bold">{{ adminService.mensajes().length }} leads</span>
            </div>
            <div class="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="h-full bg-emerald-600 rounded-full" [style.width.%]="tasaConversion()"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- DISPOSITIVOS Y REGIONES -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div class="pb-3 border-b border-neutral-200/80">
            <h3 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Dispositivos de Acceso</h3>
            <p class="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">Distribución de tráfico por tipo de pantalla</p>
          </div>
          
          <div class="space-y-3.5 font-sans pt-1">
            <div *ngFor="let disp of adminService.analiticas().dispositivos" class="space-y-1.5">
              <div class="flex justify-between text-xs sm:text-sm text-neutral-800 font-bold">
                <span>{{ disp.tipo }}</span>
                <span class="font-mono text-neutral-500">{{ disp.porcentaje }}%</span>
              </div>
              <div class="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <div class="h-full bg-black rounded-full" [style.width.%]="disp.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div class="pb-3 border-b border-neutral-200/80">
            <h3 class="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Regiones Clave de Interés</h3>
            <p class="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">Procedencia geográfica de los interesados</p>
          </div>

          <div class="space-y-2.5 text-xs sm:text-sm font-sans pt-1">
            <div class="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span class="text-neutral-900 font-semibold">Oriente Antioqueño (Llanogrande / El Retiro)</span>
              <span class="text-neutral-900 font-bold font-mono">Principal</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span class="text-neutral-900 font-semibold">Medellín & Valle de Aburrá</span>
              <span class="text-neutral-600 font-mono">Activo</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <span class="text-neutral-900 font-semibold">Bogotá D.C. & Inversionistas</span>
              <span class="text-neutral-600 font-mono">Nacional</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashAnaliticasComponent implements OnInit {
  readonly adminService = inject(AdminService);

  ngOnInit(): void {
    this.adminService.cargarDatosReales();
  }

  totalVisitasSemana = computed(() => {
    const list = this.adminService.analiticas().visitasDiarias;
    if (list.length === 0) return 0;
    return list.reduce((acc, curr) => acc + curr.visitas, 0);
  });

  tasaConversion = computed(() => {
    const total = this.totalVisitasSemana();
    const leads = this.adminService.mensajes().length;
    if (total === 0) return leads > 0 ? 100 : 0;
    const rate = (leads / total) * 100;
    return Math.min(Math.round(rate * 10) / 10, 100);
  });

  exportarDatos(): void {
    const mensajes = this.adminService.mensajes();
    let csv = 'ID,Remitente,Email,Telefono,Asunto,Presupuesto,Fecha\n';
    mensajes.forEach(m => {
      csv += `"${m.id}","${m.remitente}","${m.email}","${m.telefono}","${m.asunto}","${m.presupuesto || ''}","${m.fecha || m.created_at || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysmicon_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
