import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ReporteAdmin } from '../../../../services/admin.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-dash-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade font-sans print:hidden">
      
      <!-- Encabezado de Sección (Estilo CAD) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Reportes & Inteligencia Financiera</h2>
          <p class="text-sm text-gray-400 mt-1">Generación, consolidación y exportación de informes ejecutivos sobre proyectos y cotizaciones.</p>
        </div>
      </div>

      <!-- Alerta de Descarga Similada -->
      <div *ngIf="alertaDescarga()" class="p-4 rounded-xl bg-white/5 border border-white/20 text-white text-xs flex items-center justify-between animate-fade font-mono">
        <div class="flex items-center gap-2 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>¡Reporte "{{ alertaDescarga() }}" generado exitosamente!</span>
        </div>
        <button (click)="alertaDescarga.set('')" class="text-gray-400 hover:text-white font-bold p-1 rounded hover:bg-white/5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Grid Generador vs Historial -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Generador Nuevo Reporte (Col 1-5) -->
        <div class="relative lg:col-span-5 bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-5 overflow-hidden">
          <!-- Trazos esquineros de plano -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>

          <div class="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3 class="font-serif text-lg font-bold text-white">Generar Nuevo Informe</h3>
          </div>
          <p class="text-xs text-gray-400">Configura los parámetros del informe para exportación en formatos oficiales.</p>

          <form (ngSubmit)="crearReporte()" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5 font-mono">Título del Documento *</label>
              <input type="text" [(ngModel)]="formTitulo" name="titulo" required placeholder="ej. Balance Cotizaciones Q3 2026"
                     class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-bold">
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5 font-mono">Categoría / Tipo de Informe *</label>
              <select [(ngModel)]="formTipo" name="tipo"
                      class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-bold">
                <option value="financiero">Financiero & Valor Cotizado</option>
                <option value="operativo">Operativo & Gestión de Proyectos</option>
                <option value="cad_studio">Rendimiento Studio CAD 2D</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5 font-mono">Formato de Exportación *</label>
              <div class="grid grid-cols-3 gap-3 font-mono">
                <button type="button" (click)="formFormato = 'PDF'"
                        [ngClass]="formFormato === 'PDF' ? 'bg-white text-black font-extrabold border-white' : 'bg-[#090909] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-lg border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>PDF</span>
                </button>
                <button type="button" (click)="formFormato = 'EXCEL'"
                        [ngClass]="formFormato === 'EXCEL' ? 'bg-white text-black font-extrabold border-white' : 'bg-[#090909] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-lg border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                  <span>EXCEL</span>
                </button>
                <button type="button" (click)="formFormato = 'CSV'"
                        [ngClass]="formFormato === 'CSV' ? 'bg-white text-black font-extrabold border-white' : 'bg-[#090909] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-lg border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <button type="submit" 
                    class="w-full py-3 rounded-lg bg-white hover:bg-gray-200 text-black border border-white font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-[1.02] cursor-pointer mt-4 inline-flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Generar y Guardar Reporte</span>
            </button>
          </form>
        </div>

        <!-- Historial de Reportes (Col 6-12) -->
        <div class="relative lg:col-span-7 bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <!-- Trazos esquineros de plano -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>

          <div class="flex items-center justify-between pb-2 border-b border-white/10 font-mono">
            <h3 class="font-serif text-lg font-bold text-white flex items-center gap-2.5">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>Archivos Generados en Nube</span>
            </h3>
            <span class="text-[10px] text-gray-500 font-bold bg-white/5 px-2.5 py-1 rounded border border-white/5">{{ adminService.reportes().length }} documentos</span>
          </div>

          <div class="space-y-3 pt-1">
            <div *ngFor="let rep of adminService.reportes()" class="p-4 rounded-lg bg-[#0C0C0C] border border-white/5 flex items-center justify-between gap-4 hover:border-white/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-[#030303] border border-white/10 flex flex-col items-center justify-center font-mono font-bold text-[10px] text-white shrink-0">
                  <svg class="w-4 h-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>{{ rep.formato }}</span>
                </div>
                <div>
                  <span class="font-bold text-white text-sm block group-hover:text-gray-300 transition-colors">{{ rep.titulo }}</span>
                  <span class="text-xs text-gray-400 block mt-0.5 font-mono">{{ rep.periodo }} ● {{ rep.fechaGeneracion }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5 shrink-0">
                <span class="text-[9px] text-gray-400 font-mono font-bold bg-black/40 px-2 py-1 rounded border border-white/5">{{ rep.tamano }}</span>
                <button (click)="abrirVistaPreviaImprimible(rep)" title="Imprimir Reporte Oficial"
                        class="p-2.5 rounded-lg border border-white/10 bg-[#161616] hover:bg-white hover:text-black text-gray-300 font-bold transition-all cursor-pointer inline-flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                </button>
                <button (click)="descargarReporte(rep)" title="Volver a Descargar" 
                        class="px-3.5 py-2.5 rounded-lg bg-white hover:bg-gray-200 text-black border border-white font-extrabold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 shadow">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- MODAL DE VISTA PREVIA IMPRIMIBLE -->
    <div *ngIf="modalImpresionAbierto() && reporteSeleccionado()" class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade print:p-0 print:bg-white print:relative print:z-0">
      <div class="relative bg-[#030303] border border-white/10 rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none print:overflow-visible">
        
        <!-- Trazos esquineros de plano -->
        <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none print:hidden"></div>
        <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none print:hidden"></div>

        <!-- Header del Modal (Oculto en Impresión) -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6 print:hidden">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span class="text-xs text-gray-400 font-mono font-bold uppercase tracking-widest">Documento Listo Para Impresión</span>
          </div>
          <button (click)="cerrarVistaPreviaImprimible()" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 font-bold transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- Vista Imprimible A4/Letter -->
        <div id="print-area" class="bg-[#080808] border border-white/10 p-8 sm:p-10 rounded-xl space-y-6 print:border-none print:bg-white print:text-black print:p-0">
          
          <!-- Encabezado corporativo de reporte -->
          <div class="flex justify-between items-start border-b-2 border-white/20 pb-4 print:border-black/20">
            <div>
              <span class="font-serif font-extrabold text-xl text-white tracking-wider print:text-black">SYSMICON</span>
              <span class="block text-[9px] font-mono text-gray-500 uppercase tracking-widest">Estudios de Prefabricados Residenciales</span>
            </div>
            <div class="text-right font-mono text-[10px] text-gray-400 print:text-black/80">
              <span class="block">Código: RPT-{{ reporteSeleccionado()?.id }}</span>
              <span class="block">Generación: {{ reporteSeleccionado()?.fechaGeneracion }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-[10px] font-mono text-white/50 uppercase tracking-wider print:text-black/50">Reporte Ejecutivo</span>
            <h2 class="font-serif text-2xl font-bold text-white print:text-black">{{ reporteSeleccionado()?.titulo }}</h2>
            <p class="text-xs text-gray-400 font-sans print:text-black/75">Periodo evaluado: <strong>{{ reporteSeleccionado()?.periodo }}</strong>. Consolida la analítica de ventas y el pipeline cotizado.</p>
          </div>

          <!-- Métricas del Reporte -->
          <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/10 print:border-black/15 font-mono">
            <div class="p-3 bg-white/5 rounded border border-white/5 print:bg-black/5 print:text-black">
              <span class="block text-[9px] text-gray-500 uppercase tracking-wider">Cotizaciones</span>
              <span class="font-serif text-xl font-bold text-white print:text-black">{{ getMetricasReporte().cotizaciones }}</span>
            </div>
            <div class="p-3 bg-white/5 rounded border border-white/5 print:bg-black/5 print:text-black">
              <span class="block text-[9px] text-gray-500 uppercase tracking-wider">CADs</span>
              <span class="font-serif text-xl font-bold text-white print:text-black">{{ getMetricasReporte().cads }}</span>
            </div>
            <div class="p-3 bg-white/5 rounded border border-white/5 print:bg-black/5 print:text-black">
              <span class="block text-[9px] text-gray-500 uppercase tracking-wider">Ingreso Estimado</span>
              <span class="font-serif text-xl font-bold text-white print:text-black">{{ getMetricasReporte().monto }}</span>
            </div>
          </div>

          <!-- Detalles del reporte o tabla representativa -->
          <div class="space-y-3 font-sans">
            <h4 class="font-serif text-sm font-bold text-white print:text-black uppercase tracking-wider">Desglose de Diseños Recientes por Propietario</h4>
            
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-white/15 text-[10px] text-gray-400 uppercase font-bold print:border-black/20 print:text-black/80">
                  <th class="py-2">Usuario</th>
                  <th class="py-2">Proyectos Guardados</th>
                  <th class="py-2">Rol</th>
                  <th class="py-2 text-right">Estado Cuenta</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-[11px] print:divide-black/10 print:text-black">
                <tr *ngFor="let u of adminService.usuarios().slice(0, 5)">
                  <td class="py-2 font-bold">{{ u.nombre }}</td>
                  <td class="py-2 font-mono">{{ u.proyectosGuardados }} diseños CAD</td>
                  <td class="py-2 uppercase font-mono text-[9px]">{{ u.rol }}</td>
                  <td class="py-2 text-right font-mono capitalize">{{ u.estado }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Firmas y Pie de página técnico -->
          <div class="pt-8 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-gray-500 print:border-black/15 print:text-black/60">
            <span>Generado digitalmente por Directiva Sysmicon en la nube</span>
            <span>Página 1 de 1</span>
          </div>

        </div>

        <!-- Acciones del Modal (Oculto en Impresión) -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-white/10 mt-6 print:hidden">
          <button (click)="cerrarVistaPreviaImprimible()" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors cursor-pointer text-xs">Cerrar</button>
          <button (click)="imprimirReporte()" class="px-6 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black border border-white font-extrabold transition-all shadow-xl cursor-pointer text-xs inline-flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Imprimir Documento</span>
          </button>
        </div>

      </div>
    </div>
  `
})
export class DashReportesComponent {
  readonly adminService = inject(AdminService);

  readonly alertaDescarga = signal<string>('');
  readonly modalImpresionAbierto = signal<boolean>(false);
  readonly reporteSeleccionado = signal<ReporteAdmin | null>(null);

  formTitulo = '';
  formTipo = 'financiero';
  formFormato = 'PDF';

  crearReporte(): void {
    if (!this.formTitulo.trim()) return;

    this.adminService.generarReporte(
      this.formTitulo,
      this.formTipo as 'financiero' | 'operativo' | 'cad_studio',
      this.formFormato as 'PDF' | 'EXCEL' | 'CSV'
    );

    this.alertaDescarga.set(this.formTitulo);
    this.formTitulo = '';
    
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 4000);
  }

  descargarReporte(rep: ReporteAdmin): void {
    if (rep.formato === 'PDF') {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SYSMICON - REPORTE EJECUTIVO", 20, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`ID del Reporte: RPT-${rep.id}`, 20, 42);
      doc.text(`Título: ${rep.titulo}`, 20, 50);
      doc.text(`Periodo: ${rep.periodo}`, 20, 58);
      doc.text(`Fecha Generación: ${rep.fechaGeneracion}`, 20, 66);
      doc.text(`Formato: ${rep.formato}`, 20, 74);
      
      doc.line(20, 85, 190, 85);
      doc.text("Resumen de Métricas Financieras y CAD 2D:", 20, 95);
      
      const metrics = this.getMetricasReporte();
      doc.text(`- Solicitudes de Cotización Formales: ${metrics.cotizaciones}`, 25, 105);
      doc.text(`- Diseños CAD Registrados en Nube: ${metrics.cads}`, 25, 113);
      doc.text(`- Pipeline de Ventas Estimado: ${metrics.monto}`, 25, 121);
      
      doc.text("Medellín - Colombia, 2026", 20, 150);
      doc.save(`${rep.titulo.toLowerCase().replace(/\\s+/g, '_')}.pdf`);
    } else {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Titulo,Periodo,Fecha,Formato\\n"
        + `${rep.id},${rep.titulo},${rep.periodo},${rep.fechaGeneracion},${rep.formato}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${rep.titulo.toLowerCase().replace(/\\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    this.alertaDescarga.set(rep.titulo);
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 4000);
  }

  abrirVistaPreviaImprimible(rep: ReporteAdmin): void {
    this.reporteSeleccionado.set(rep);
    this.modalImpresionAbierto.set(true);
  }

  cerrarVistaPreviaImprimible(): void {
    this.modalImpresionAbierto.set(false);
  }

  imprimirReporte(): void {
    window.print();
  }

  getMetricasReporte(): { cotizaciones: string; cads: string; monto: string } {
    const kpis = this.adminService.kpis();
    return {
      cotizaciones: kpis.totalCotizaciones.toString(),
      cads: kpis.disenosCADGuardados.toString(),
      monto: `$` + (kpis.ingresoEstimadoUSD / 1000000).toFixed(2) + `M USD`
    };
  }
}
