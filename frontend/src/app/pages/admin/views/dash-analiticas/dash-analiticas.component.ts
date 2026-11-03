import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-analiticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-10 animate-fade-in font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-ultra text-neutral-400 font-black uppercase block mb-2">
            MÉTRICAS & INTELIGENCIA DEL SISTEMA
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-[1.05]">
            ANALÍTICAS & <span class="font-light">RENDIMIENTO WEB</span>
          </h1>
          <p class="font-sans text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-3 max-w-3xl">
            Monitoreo en tiempo real de tráfico, interacción con el portafolio y embudos de conversión de clientes.
          </p>
        </div>
        
        <div class="flex items-center gap-4 shrink-0">
          <span class="text-xs sm:text-sm px-5 py-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 font-mono font-bold uppercase tracking-wider">ÚLTIMOS 30 DÍAS</span>
          <button (click)="exportarDatos()" class="admin-btn-primary py-3.5 px-7">
            <svg class="w-4.5 h-4.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            EXPORTAR (.CSV)
          </button>
        </div>
      </div>

      <!-- MÉTRICAS CLAVE (3 TARJETAS MONOCROMÁTICAS) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span class="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">TOTAL VISITAS SEMANALES</span>
          <span class="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{{ totalVisitasSemana() }}</span>
          <p class="text-sm text-neutral-600 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> TRÁFICO EN VIVO
          </p>
        </div>

        <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span class="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">COTIZACIONES REGISTRADAS</span>
          <span class="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{{ adminService.mensajes().length }}</span>
          <p class="text-sm text-neutral-700 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-neutral-950"></span> LEADS EN BASE DE DATOS
          </p>
        </div>

        <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-9 shadow-xs hover:border-neutral-400 hover:shadow-md transition-all group duration-300">
          <span class="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">TASA DE CONVERSIÓN</span>
          <span class="font-serif text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">{{ tasaConversion() }}%</span>
          <p class="text-sm text-neutral-700 mt-4 font-mono font-semibold flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> LEADS VS. SESIONES
          </p>
        </div>

      </div>

      <!-- EMBUDO DE CONVERSIÓN DINÁMICO -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
        <div class="pb-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">EMBUDO DE CONVERSIÓN DE CLIENTES</h3>
            <p class="text-sm sm:text-base text-neutral-600 font-normal mt-1">Recorrido del usuario desde la primera visita hasta la solicitud formal</p>
          </div>
          <span class="text-xs font-mono font-black text-neutral-500 uppercase tracking-widest bg-neutral-100 px-4 py-2 rounded-xl">CONVERSIÓN WEB</span>
        </div>

        <div class="space-y-7 max-w-4xl font-sans pt-2">
          
          <!-- Paso 1 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">1</span>
                <span class="uppercase tracking-wide">VISITAS TOTALES AL PORTAL</span>
              </span>
              <span class="font-mono text-neutral-600 text-sm font-semibold">100% ({{ totalVisitasSemana() }} visitas)</span>
            </div>
            <div class="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="w-full h-full bg-neutral-950 rounded-full"></div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">2</span>
                <span class="uppercase tracking-wide">EXPLORACIÓN DE PROYECTOS Y PORTAFOLIO</span>
              </span>
              <span class="font-mono text-neutral-600 text-sm font-semibold">{{ totalVisitasSemana() > 0 ? '65%' : '0%' }}</span>
            </div>
            <div class="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="h-full bg-neutral-600 rounded-full" [style.width.%]="totalVisitasSemana() > 0 ? 65 : 0"></div>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono text-xs font-black">3</span>
                <span class="uppercase tracking-wide">SOLICITUDES DE COTIZACIÓN & MENSAJES FORMALES</span>
              </span>
              <span class="font-mono text-neutral-950 font-black text-sm sm:text-base">{{ adminService.mensajes().length }} leads ({{ tasaConversion() }}%)</span>
            </div>
            <div class="w-full h-4 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div class="h-full bg-neutral-950 rounded-full" [style.width.%]="tasaConversion()"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- DISPOSITIVOS Y REGIONES -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div class="pb-5 border-b border-neutral-200">
            <h3 class="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">DISPOSITIVOS DE ACCESO</h3>
            <p class="text-sm text-neutral-600 font-normal mt-1">Distribución de tráfico por tipo de pantalla</p>
          </div>
          
          <div class="space-y-5 font-sans pt-2">
            <div *ngFor="let disp of adminService.analiticas().dispositivos" class="space-y-2.5">
              <div class="flex justify-between text-sm sm:text-base text-neutral-900 font-bold uppercase tracking-wider">
                <span>{{ disp.tipo }}</span>
                <span class="font-mono text-neutral-600 text-sm font-semibold">{{ disp.porcentaje }}%</span>
              </div>
              <div class="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <div class="h-full bg-neutral-950 rounded-full" [style.width.%]="disp.porcentaje"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div class="pb-5 border-b border-neutral-200">
            <h3 class="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">REGIONES CLAVE DE INTERÉS</h3>
            <p class="text-sm text-neutral-600 font-normal mt-1">Procedencia geográfica de los interesados</p>
          </div>

          <div class="space-y-4 text-sm sm:text-base font-sans pt-2">
            <div class="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span class="text-neutral-950 font-bold uppercase tracking-wide">ORIENTE ANTIOQUEÑO (LLANOGRANDE / EL RETIRO)</span>
              <span class="text-neutral-950 font-black font-mono text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-neutral-200">PRINCIPAL</span>
            </div>
            <div class="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span class="text-neutral-900 font-medium uppercase tracking-wide">MEDELLÍN & VALLE DE ABURRÁ</span>
              <span class="text-neutral-700 font-mono text-xs uppercase font-bold bg-white px-3 py-1.5 rounded-lg border border-neutral-200">ACTIVO</span>
            </div>
            <div class="flex justify-between items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
              <span class="text-neutral-900 font-medium uppercase tracking-wide">BOGOTÁ D.C. & INVERSIONISTAS</span>
              <span class="text-neutral-700 font-mono text-xs uppercase font-bold bg-white px-3 py-1.5 rounded-lg border border-neutral-200">NACIONAL</span>
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
