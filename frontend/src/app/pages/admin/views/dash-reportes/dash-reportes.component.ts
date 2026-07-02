import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade font-sans">
      
      <!-- Encabezado de Sección -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Reportes & Inteligencia Financiera</h2>
          <p class="text-xs text-gray-400 mt-1">Generación, consolidación y exportación de informes ejecutivos sobre proyectos y cotizaciones.</p>
        </div>
      </div>

      <!-- Alerta de Descarga Similada -->
      <div *ngIf="alertaDescarga()" class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between animate-fade">
        <div class="flex items-center gap-2 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>¡Reporte "{{ alertaDescarga() }}" generado y descargado exitosamente!</span>
        </div>
        <button (click)="alertaDescarga.set('')" class="text-gray-400 hover:text-white font-bold">✕</button>
      </div>

      <!-- Grid Generador vs Historial -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Generador Nuevo Reporte (Col 1-5) -->
        <div class="lg:col-span-5 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Generar Nuevo Informe Ejecutivo</h3>
          <p class="text-xs text-gray-400">Configura los parámetros del informe para exportación en formatos oficiales.</p>

          <form (ngSubmit)="crearReporte()" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Título del Documento *</label>
              <input type="text" [(ngModel)]="formTitulo" name="titulo" required placeholder="ej. Balance Cotizaciones Q3 2026"
                     class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Categoría / Tipo de Informe *</label>
              <select [(ngModel)]="formTipo" name="tipo"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
                <option value="financiero">Financiero & Valor Cotizado</option>
                <option value="operativo">Operativo & Gestión de Proyectos</option>
                <option value="cad_studio">Rendimiento Studio CAD 2D</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Formato de Exportación *</label>
              <div class="grid grid-cols-3 gap-3">
                <button type="button" (click)="formFormato = 'PDF'"
                        [ngClass]="formFormato === 'PDF' ? 'bg-wood-accent text-[#111] font-bold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all">
                  📄 PDF
                </button>
                <button type="button" (click)="formFormato = 'EXCEL'"
                        [ngClass]="formFormato === 'EXCEL' ? 'bg-wood-accent text-[#111] font-bold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all">
                  📊 EXCEL
                </button>
                <button type="button" (click)="formFormato = 'CSV'"
                        [ngClass]="formFormato === 'CSV' ? 'bg-wood-accent text-[#111] font-bold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all">
                  📑 CSV
                </button>
              </div>
            </div>

            <button type="submit" 
                    class="w-full py-3 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-[1.02] cursor-pointer mt-4">
              ⚡ Generar y Descargar Reporte
            </button>
          </form>
        </div>

        <!-- Historial de Reportes (Col 6-12) -->
        <div class="lg:col-span-7 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 class="font-serif text-lg font-bold text-white">Archivos Generados en Nube</h3>
            <span class="text-xs text-gray-400">{{ adminService.reportes().length }} documentos disponibles</span>
          </div>

          <div class="space-y-3 pt-1">
            <div *ngFor="let rep of adminService.reportes()" class="p-4 rounded-xl bg-[#161616] border border-white/5 flex items-center justify-between gap-4 hover:border-white/20 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0A0D14] border border-white/10 flex items-center justify-center font-serif font-extrabold text-wood-light text-sm shrink-0">
                  {{ rep.formato }}
                </div>
                <div>
                  <span class="font-bold text-white text-xs block">{{ rep.titulo }}</span>
                  <span class="text-[11px] text-gray-400 block mt-0.5">{{ rep.periodo }} ● Generado el {{ rep.fechaGeneracion }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <span class="text-[11px] text-gray-500 font-bold bg-black/40 px-2 py-1 rounded">{{ rep.tamano }}</span>
                <button (click)="descargarReporte(rep.titulo)" title="Volver a Descargar" 
                        class="px-3 py-1.5 rounded-lg bg-wood-accent/15 hover:bg-wood-accent text-wood-light hover:text-[#111] font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1">
                  ⬇️ Descargar
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashReportesComponent {
  readonly adminService = inject(AdminService);

  readonly alertaDescarga = signal<string>('');
  formTitulo = '';
  formTipo: 'financiero' | 'operativo' | 'cad_studio' = 'financiero';
  formFormato: 'PDF' | 'EXCEL' | 'CSV' = 'PDF';

  crearReporte(): void {
    if (!this.formTitulo.trim()) return;
    this.adminService.generarReporte(this.formTitulo, this.formTipo, this.formFormato);
    this.alertaDescarga.set(this.formTitulo);
    this.formTitulo = '';
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 5000);
  }

  descargarReporte(titulo: string): void {
    this.alertaDescarga.set(titulo);
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 5000);
  }
}
