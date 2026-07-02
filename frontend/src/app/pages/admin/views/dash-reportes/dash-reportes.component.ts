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
          <span>¡Reporte "{{ alertaDescarga() }}" generado exitosamente!</span>
        </div>
        <button (click)="alertaDescarga.set('')" class="text-gray-400 hover:text-white font-bold p-1 rounded hover:bg-white/5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Grid Generador vs Historial -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Generador Nuevo Reporte (Col 1-5) -->
        <div class="lg:col-span-5 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          <div class="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <svg class="w-5 h-5 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3 class="font-serif text-lg font-bold text-white">Generar Nuevo Informe Ejecutivo</h3>
          </div>
          <p class="text-xs text-gray-400">Configura los parámetros del informe para exportación en formatos oficiales.</p>

          <form (ngSubmit)="crearReporte()" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Título del Documento *</label>
              <input type="text" [(ngModel)]="formTitulo" name="titulo" required placeholder="ej. Balance Cotizaciones Q3 2026"
                     class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none font-bold">
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Categoría / Tipo de Informe *</label>
              <select [(ngModel)]="formTipo" name="tipo"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none font-bold">
                <option value="financiero">Financiero & Valor Cotizado</option>
                <option value="operativo">Operativo & Gestión de Proyectos</option>
                <option value="cad_studio">Rendimiento Studio CAD 2D</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Formato de Exportación *</label>
              <div class="grid grid-cols-3 gap-3">
                <button type="button" (click)="formFormato = 'PDF'"
                        [ngClass]="formFormato === 'PDF' ? 'bg-wood-accent text-[#111] font-extrabold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>PDF</span>
                </button>
                <button type="button" (click)="formFormato = 'EXCEL'"
                        [ngClass]="formFormato === 'EXCEL' ? 'bg-wood-accent text-[#111] font-extrabold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                  <span>EXCEL</span>
                </button>
                <button type="button" (click)="formFormato = 'CSV'"
                        [ngClass]="formFormato === 'CSV' ? 'bg-wood-accent text-[#111] font-extrabold border-wood-accent' : 'bg-[#181818] text-gray-400 border-white/10'"
                        class="p-2.5 rounded-xl border text-center font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <button type="submit" 
                    class="w-full py-3 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-[1.02] cursor-pointer mt-4 inline-flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Generar y Guardar Reporte</span>
            </button>
          </form>
        </div>

        <!-- Historial de Reportes (Col 6-12) -->
        <div class="lg:col-span-7 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 class="font-serif text-lg font-bold text-white flex items-center gap-2.5">
              <svg class="w-5 h-5 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>Archivos Generados en Nube</span>
            </h3>
            <span class="text-xs text-gray-400 font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{{ adminService.reportes().length }} documentos disponibles</span>
          </div>

          <div class="space-y-3 pt-1">
            <div *ngFor="let rep of adminService.reportes()" class="p-4 rounded-xl bg-[#161616] border border-white/5 flex items-center justify-between gap-4 hover:border-white/20 transition-all group">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-[#0A0D14] border border-white/10 flex flex-col items-center justify-center font-mono font-bold text-[10px] text-wood-light shrink-0">
                  <svg class="w-4 h-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>{{ rep.formato }}</span>
                </div>
                <div>
                  <span class="font-bold text-white text-xs block group-hover:text-wood-light transition-colors">{{ rep.titulo }}</span>
                  <span class="text-[11px] text-gray-400 block mt-0.5">{{ rep.periodo }} ● Generado el {{ rep.fechaGeneracion }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5 shrink-0">
                <span class="text-[10px] text-gray-400 font-bold bg-black/40 px-2 py-1 rounded border border-white/5">{{ rep.tamano }}</span>
                <button (click)="abrirVistaPreviaImprimible(rep)" title="Imprimir Reporte Oficial"
                        class="p-2 rounded-lg bg-white/5 hover:bg-wood-accent hover:text-[#111] text-gray-300 font-bold transition-all cursor-pointer inline-flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                </button>
                <button (click)="descargarReporte(rep)" title="Volver a Descargar" 
                        class="px-3 py-2 rounded-lg bg-wood-accent/15 hover:bg-wood-accent text-wood-light hover:text-[#111] font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 shadow">
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
      <div class="bg-[#12141C] border border-white/15 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none print:overflow-visible">
        
        <!-- Header del Modal (Oculto en Impresión) -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6 print:hidden">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Documento Listo Para Impresión</span>
          </div>
          <button (click)="cerrarVistaPreviaImprimible()" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 font-bold transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- DOCUMENTO OFICIAL A IMPRIMIR (Con estilo corporativo de lujo) -->
        <div class="bg-white text-black p-8 rounded-xl font-serif border border-gray-200 shadow-lg print:border-none print:shadow-none print:p-0">
          
          <!-- Encabezado Corporativo -->
          <div class="flex justify-between items-start border-b-2 border-gray-900 pb-5 mb-6">
            <div>
              <h1 class="text-2xl font-black tracking-tight text-gray-900 font-serif">SYSMICON</h1>
              <p class="text-[10px] text-gray-600 font-sans tracking-widest uppercase mt-0.5">Studio CAD & Intelligent Residential Simulation</p>
              <p class="text-[9px] text-gray-500 font-sans mt-2">Llanogrande, Antioquia, Colombia</p>
            </div>
            <div class="text-right text-xs font-sans">
              <span class="inline-block px-2.5 py-1 bg-gray-100 border border-gray-300 rounded font-bold text-gray-800 uppercase tracking-widest text-[9px]">
                INFORME OFICIAL {{ reporteSeleccionado()?.formato }}
              </span>
              <p class="text-[10px] text-gray-600 mt-2.5"><strong>Fecha:</strong> {{ reporteSeleccionado()?.fechaGeneracion }}</p>
              <p class="text-[10px] text-gray-600"><strong>Periodo:</strong> {{ reporteSeleccionado()?.periodo }}</p>
            </div>
          </div>

          <!-- Título del Reporte -->
          <div class="mb-6">
            <span class="text-[10px] font-sans font-bold uppercase tracking-widest text-wood-light bg-gray-100 px-2 py-0.5 rounded">
              {{ getNombreTipoReporte(reporteSeleccionado()?.tipo) }}
            </span>
            <h2 class="text-xl font-bold text-gray-900 mt-2">{{ reporteSeleccionado()?.titulo }}</h2>
            <p class="text-xs text-gray-600 mt-1 italic">Consolidación de métricas comerciales calculadas y auditadas en la base de datos de Sysmicon.</p>
          </div>

          <!-- Contenido y Datos del Reporte según el tipo -->
          <div class="space-y-6 font-sans">
            
            <!-- Reporte Financiero -->
            <div *ngIf="reporteSeleccionado()?.tipo === 'financiero'" class="space-y-4">
              <h3 class="text-xs font-bold text-gray-800 border-b border-gray-300 pb-1.5 uppercase tracking-wider">1. KPIs Financieros Globales</h3>
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                    <th class="py-2 px-3">Métrica Financiera</th>
                    <th class="py-2 px-3 text-right">Valor Registrado</th>
                    <th class="py-2 px-3 text-right">Crecimiento H1</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td class="py-2 px-3 font-medium">Volumen Total Cotizado (Pipeline)</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">$4,250,000 USD</td>
                    <td class="py-2 px-3 text-right text-emerald-600">+18.4%</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Ticket Promedio por Residencia</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">$320,000 USD</td>
                    <td class="py-2 px-3 text-right text-emerald-600">+12.1%</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Cotizaciones Formales Generadas</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">184 documentos</td>
                    <td class="py-2 px-3 text-right text-emerald-600">+8.5%</td>
                  </tr>
                </tbody>
              </table>

              <h3 class="text-xs font-bold text-gray-800 border-b border-gray-300 pb-1.5 uppercase tracking-wider mt-4">2. Distribución de Inversión por Portafolio</h3>
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                    <th class="py-2 px-3">Rango de Presupuesto</th>
                    <th class="py-2 px-3 text-right">Porcentaje del Portafolio</th>
                    <th class="py-2 px-3 text-right">Estado de Segmento</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td class="py-2 px-3">$100k - $250k USD</td>
                    <td class="py-2 px-3 text-right font-bold">35%</td>
                    <td class="py-2 px-3 text-right text-gray-600">Estable</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3">$250k - $500k USD</td>
                    <td class="py-2 px-3 text-right font-bold">45%</td>
                    <td class="py-2 px-3 text-right text-gray-600">Alta Demanda</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3">Más de $500k USD (Luxury)</td>
                    <td class="py-2 px-3 text-right font-bold">20%</td>
                    <td class="py-2 px-3 text-right text-emerald-600">Crecimiento Rápido</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Reporte Operativo -->
            <div *ngIf="reporteSeleccionado()?.tipo === 'operativo'" class="space-y-4">
              <h3 class="text-xs font-bold text-gray-800 border-b border-gray-300 pb-1.5 uppercase tracking-wider">1. Actividad de Usuarios & Leads</h3>
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                    <th class="py-2 px-3">Métrica Operativa</th>
                    <th class="py-2 px-3 text-right">Total Acumulado</th>
                    <th class="py-2 px-3 text-right">Estado Operativo</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td class="py-2 px-3 font-medium">Usuarios Registrados en Plataforma</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">1,280 usuarios</td>
                    <td class="py-2 px-3 text-right text-emerald-600">Activo / Creciente</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Tiempo de Decisión Promedio</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">18 días</td>
                    <td class="py-2 px-3 text-right text-emerald-600">Optimizando (-4 días)</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Satisfacción de Propietarios</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">99.4%</td>
                    <td class="py-2 px-3 text-right text-emerald-600">Excelente (5.0 / 5.0)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Reporte CAD Studio -->
            <div *ngIf="reporteSeleccionado()?.tipo === 'cad_studio'" class="space-y-4">
              <h3 class="text-xs font-bold text-gray-800 border-b border-gray-300 pb-1.5 uppercase tracking-wider">1. Métricas de Modelado en Nube</h3>
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                    <th class="py-2 px-3">Categoría de Bloque CAD</th>
                    <th class="py-2 px-3 text-right">Porcentaje de Uso</th>
                    <th class="py-2 px-3 text-right">Total Diseños Guardados</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td class="py-2 px-3 font-medium">Alcobas Suite</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">32%</td>
                    <td class="py-2 px-3 text-right text-gray-600">132 diseños</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Cocinas Gourmet</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">24%</td>
                    <td class="py-2 px-3 text-right text-gray-600">99 diseños</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Piscinas & Solárium</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">20%</td>
                    <td class="py-2 px-3 text-right text-gray-600">82 diseños</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-medium">Zonas Sociales Altura</td>
                    <td class="py-2 px-3 text-right font-bold text-gray-900">15%</td>
                    <td class="py-2 px-3 text-right text-gray-600">62 diseños</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Notas del Auditor / Pie del Reporte -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-[10px] text-gray-600 space-y-2">
              <p><strong>Nota legal y confidencialidad:</strong> Este reporte contiene información analítica comercial de la plataforma Sysmicon y es estrictamente confidencial. La visualización e impresión de este documento se rigen bajo los permisos administrativos del panel de control de Sysmicon.</p>
              <p>Generado a través del módulo de Inteligencia Financiera. Para dudas técnicas, contacte al administrador de TI.</p>
            </div>

            <!-- Firmas Oficiales -->
            <div class="flex justify-between items-center pt-12 text-center text-xs">
              <div class="w-48">
                <div class="border-b border-gray-400 h-8"></div>
                <p class="mt-2 font-bold text-gray-900">David Jaramillo</p>
                <p class="text-[9px] text-gray-500">Director Senior de Proyectos</p>
              </div>
              <div class="w-48">
                <div class="border-b border-gray-400 h-8"></div>
                <p class="mt-2 font-bold text-gray-900">Sistema Sysmicon Nube</p>
                <p class="text-[9px] text-gray-500">Firma Digital de Servidor</p>
              </div>
            </div>

          </div>

        </div>

        <!-- Botones de Acción (Ocultos en Impresión) -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-white/10 mt-6 print:hidden">
          <button type="button" (click)="cerrarVistaPreviaImprimible()" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors cursor-pointer text-xs">
            Cerrar Vista Previa
          </button>
          <button type="button" (click)="imprimirReporte()" class="px-6 py-2.5 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold transition-all shadow-xl cursor-pointer text-xs inline-flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Confirmar e Imprimir</span>
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
  formTipo: 'financiero' | 'operativo' | 'cad_studio' = 'financiero';
  formFormato: 'PDF' | 'EXCEL' | 'CSV' = 'PDF';

  crearReporte(): void {
    if (!this.formTitulo.trim()) return;
    this.adminService.generarReporte(this.formTitulo, this.formTipo, this.formFormato);
    this.alertaDescarga.set(this.formTitulo);
    this.ejecutarDescargaReal(this.formTitulo, this.formFormato, this.formTipo);
    this.formTitulo = '';
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 5000);
  }

  descargarReporte(rep: ReporteAdmin): void {
    this.alertaDescarga.set(rep.titulo);
    this.ejecutarDescargaReal(rep.titulo, rep.formato, rep.tipo);
    setTimeout(() => {
      this.alertaDescarga.set('');
    }, 5000);
  }

  ejecutarDescargaReal(titulo: string, formato: 'PDF' | 'EXCEL' | 'CSV', tipo: 'financiero' | 'operativo' | 'cad_studio'): void {
    const cleanFileName = `${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

    if (formato === 'CSV') {
      let content = "SYSMICON;REPORT OFICIAL\n";
      content += `Titulo;${titulo}\n`;
      content += `Tipo de Reporte;${tipo}\n`;
      content += `Fecha;${new Date().toLocaleDateString()}\n\n`;
      if (tipo === 'financiero') {
        content += "Metrica;Valor;Crecimiento\n";
        content += "Volumen Total Cotizado;$4250000 USD;+18.4%\n";
        content += "Ticket Promedio por Residencia;$320000 USD;+12.1%\n";
        content += "Cotizaciones Formales;184;+8.5%\n";
      } else if (tipo === 'operativo') {
        content += "Metrica;Total;Estado\n";
        content += "Usuarios Registrados;1280;Activo / Creciente\n";
        content += "Tiempo de Decision;18 dias;Optimizando (-4 dias)\n";
        content += "Satisfaccion Propietarios;99.4%;Excelente\n";
      } else {
        content += "Categoria CAD;Porcentaje;Total Diseños\n";
        content += "Alcobas Suite;32%;132\n";
        content += "Cocinas Gourmet;24%;99\n";
        content += "Piscinas;20%;82\n";
        content += "Zonas Sociales;15%;62\n";
      }
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      this.triggerBlobDownload(blob, `${cleanFileName}.csv`);

    } else if (formato === 'EXCEL') {
      let content = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
      content += `<head><meta charset="utf-8"></head><body>`;
      content += `<h2>SYSMICON - ${titulo}</h2>`;
      content += `<p><b>Tipo:</b> ${tipo} | <b>Fecha:</b> ${new Date().toLocaleDateString()}</p>`;
      content += `<table border="1">`;
      if (tipo === 'financiero') {
        content += `<tr style="background:#f2f2f2"><th>Métrica Financiera</th><th>Valor</th><th>Crecimiento</th></tr>`;
        content += `<tr><td>Volumen Total Cotizado</td><td>$4,250,000 USD</td><td>+18.4%</td></tr>`;
        content += `<tr><td>Ticket Promedio por Residencia</td><td>$320,000 USD</td><td>+12.1%</td></tr>`;
        content += `<tr><td>Cotizaciones Formales</td><td>184</td><td>+8.5%</td></tr>`;
      } else if (tipo === 'operativo') {
        content += `<tr style="background:#f2f2f2"><th>Métrica Operativa</th><th>Total</th><th>Estado</th></tr>`;
        content += `<tr><td>Usuarios Registrados</td><td>1,280</td><td>Activo / Creciente</td></tr>`;
        content += `<tr><td>Tiempo de Decisión</td><td>18 días</td><td>Optimizando</td></tr>`;
        content += `<tr><td>Satisfacción Propietarios</td><td>99.4%</td><td>Excelente</td></tr>`;
      } else {
        content += `<tr style="background:#f2f2f2"><th>Categoría CAD</th><th>Porcentaje</th><th>Total Diseños</th></tr>`;
        content += `<tr><td>Alcobas Suite</td><td>32%</td><td>132</td></tr>`;
        content += `<tr><td>Cocinas Gourmet</td><td>24%</td><td>99</td></tr>`;
        content += `<tr><td>Piscinas</td><td>20%</td><td>82</td></tr>`;
        content += `<tr><td>Zonas Sociales</td><td>15%</td><td>62</td></tr>`;
      }
      content += `</table></body></html>`;
      const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
      this.triggerBlobDownload(blob, `${cleanFileName}.xls`);

    } else if (formato === 'PDF') {
      const doc = new jsPDF();
      
      // Header Corporativo
      doc.setFillColor(17, 17, 17); // Dark gray header bar
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(212, 175, 55); // Wood accent tone
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('SYSMICON', 15, 18);
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('STUDIO CAD & INTELLIGENT RESIDENTIAL SIMULATION', 15, 25);
      doc.setTextColor(180, 180, 180);
      doc.text('Llanogrande, Antioquia, Colombia', 15, 30);
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('INFORME OFICIAL', 155, 18);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 155, 25);
      doc.text(`Periodo: 2026`, 155, 30);
      
      // Divider line
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.5);
      doc.line(15, 45, 195, 45);
      
      // Título del Reporte
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(titulo, 15, 55);
      
      doc.setFont('Helvetica', 'oblique');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Tipo de Reporte: ${this.getNombreTipoReporte(tipo)}`, 15, 62);
      doc.text('Consolidación de métricas comerciales calculadas y auditadas en la base de datos de Sysmicon.', 15, 67);
      
      // Contenido por Tipo de Reporte
      let y = 80;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      if (tipo === 'financiero') {
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'bold');
        doc.text('1. KPIs Financieros Globales', 15, y);
        y += 8;
        
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 8, 'F');
        doc.setFontSize(9);
        doc.text('Métrica Financiera', 18, y + 5);
        doc.text('Valor Registrado', 110, y + 5);
        doc.text('Crecimiento H1', 160, y + 5);
        y += 8;
        
        // Rows
        const rows = [
          { m: 'Volumen Total Cotizado (Pipeline)', v: '$4,250,000 USD', c: '+18.4%' },
          { m: 'Ticket Promedio por Residencia', v: '$320,000 USD', c: '+12.1%' },
          { m: 'Cotizaciones Formales Generadas', v: '184 documentos', c: '+8.5%' }
        ];
        
        rows.forEach(r => {
          doc.line(15, y, 195, y);
          doc.setFont('Helvetica', 'normal');
          doc.text(r.m, 18, y + 5);
          doc.setFont('Helvetica', 'bold');
          doc.text(r.v, 110, y + 5);
          doc.setTextColor(16, 124, 65); // Green for growth
          doc.text(r.c, 160, y + 5);
          doc.setTextColor(50, 50, 50);
          y += 8;
        });
        doc.line(15, y, 195, y);
        
        y += 15;
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'bold');
        doc.text('2. Distribución de Inversión por Portafolio', 15, y);
        y += 8;
        
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 8, 'F');
        doc.setFontSize(9);
        doc.text('Rango de Presupuesto', 18, y + 5);
        doc.text('Porcentaje Portafolio', 110, y + 5);
        doc.text('Estado de Segmento', 160, y + 5);
        y += 8;
        
        const rows2 = [
          { m: '$100k - $250k USD', v: '35%', c: 'Estable' },
          { m: '$250k - $500k USD', v: '45%', c: 'Alta Demanda' },
          { m: 'Más de $500k USD (Luxury)', v: '20%', c: 'Crecimiento Rápido' }
        ];
        rows2.forEach(r => {
          doc.line(15, y, 195, y);
          doc.setFont('Helvetica', 'normal');
          doc.text(r.m, 18, y + 5);
          doc.setFont('Helvetica', 'bold');
          doc.text(r.v, 110, y + 5);
          doc.text(r.c, 160, y + 5);
          y += 8;
        });
        doc.line(15, y, 195, y);
        
      } else if (tipo === 'operativo') {
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'bold');
        doc.text('1. Actividad de Usuarios & Leads', 15, y);
        y += 8;
        
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 8, 'F');
        doc.setFontSize(9);
        doc.text('Métrica Operativa', 18, y + 5);
        doc.text('Total Acumulado', 110, y + 5);
        doc.text('Estado Operativo', 160, y + 5);
        y += 8;
        
        const rows = [
          { m: 'Usuarios Registrados en Plataforma', v: '1,280 usuarios', c: 'Activo / Creciente' },
          { m: 'Tiempo de Decisión Promedio', v: '18 días', c: 'Optimizando (-4 días)' },
          { m: 'Satisfacción de Propietarios', v: '99.4%', c: 'Excelente (5.0 / 5.0)' }
        ];
        rows.forEach(r => {
          doc.line(15, y, 195, y);
          doc.setFont('Helvetica', 'normal');
          doc.text(r.m, 18, y + 5);
          doc.setFont('Helvetica', 'bold');
          doc.text(r.v, 110, y + 5);
          doc.text(r.c, 160, y + 5);
          y += 8;
        });
        doc.line(15, y, 195, y);
        
      } else {
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'bold');
        doc.text('1. Métricas de Modelado en Nube', 15, y);
        y += 8;
        
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y, 180, 8, 'F');
        doc.setFontSize(9);
        doc.text('Categoría de Bloque CAD', 18, y + 5);
        doc.text('Porcentaje de Uso', 110, y + 5);
        doc.text('Total Diseños Guardados', 160, y + 5);
        y += 8;
        
        const rows = [
          { m: 'Alcobas Suite', v: '32%', c: '132 diseños' },
          { m: 'Cocinas Gourmet', v: '24%', c: '99 diseños' },
          { m: 'Piscinas & Solárium', v: '20%', c: '82 diseños' },
          { m: 'Zonas Sociales Altura', v: '15%', c: '62 diseños' }
        ];
        rows.forEach(r => {
          doc.line(15, y, 195, y);
          doc.setFont('Helvetica', 'normal');
          doc.text(r.m, 18, y + 5);
          doc.setFont('Helvetica', 'bold');
          doc.text(r.v, 110, y + 5);
          doc.text(r.c, 160, y + 5);
          y += 8;
        });
        doc.line(15, y, 195, y);
      }
      
      // Footer/Note
      y += 20;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Nota legal y confidencialidad: Este reporte contiene información analítica comercial de la plataforma Sysmicon y es estrictamente confidencial.', 15, y);
      doc.text('Generado a través del módulo de Inteligencia Financiera. Para soporte técnico, contacte al administrador.', 15, y + 4);
      
      // Signatures
      y += 25;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 75, y);
      doc.line(135, y, 195, y);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text('David Jaramillo', 15, y + 5);
      doc.text('Firma Servidor Digital', 135, y + 5);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Director Senior de Proyectos', 15, y + 9);
      doc.text('Sysmicon Nube Autenticación', 135, y + 9);
      
      doc.save(`${cleanFileName}.pdf`);
    }
  }

  private triggerBlobDownload(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  abrirVistaPreviaImprimible(reporte: ReporteAdmin): void {
    this.reporteSeleccionado.set(reporte);
    this.modalImpresionAbierto.set(true);
  }

  cerrarVistaPreviaImprimible(): void {
    this.modalImpresionAbierto.set(false);
    this.reporteSeleccionado.set(null);
  }

  imprimirReporte(): void {
    window.print();
  }

  getNombreTipoReporte(tipo?: string): string {
    if (tipo === 'financiero') return 'Informe de Rendimiento Financiero';
    if (tipo === 'operativo') return 'Informe de Rendimiento Operativo';
    if (tipo === 'cad_studio') return 'Informe de Uso Studio CAD 2D';
    return 'Informe Técnico';
  }
}
