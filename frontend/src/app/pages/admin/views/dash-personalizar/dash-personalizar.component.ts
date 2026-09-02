import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsService, SiteConfig } from '../../../../services/cms.service';
import { ProyectosService } from '../../../../services/proyectos.service';
import { AdminService, ProyectoAdmin } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-personalizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10 animate-fade font-sans">
      
      <!-- =====================================================
           ENCABEZADO DE SECCIÓN ESTILO REFERENCIA / HOME
           ===================================================== -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">
            AJUSTES DEL SISTEMA & CMS
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 tracking-tight leading-[1.05]">
            Configuración & <span class="font-bold">Personalización</span>
          </h1>
          <p class="font-sans text-base sm:text-lg text-neutral-500 font-light leading-relaxed mt-3 max-w-2xl">
            Personaliza las preferencias del sistema, contenidos editoriales, canales de contacto y el portafolio de obras.
          </p>
        </div>
        
        <div class="flex items-center gap-3 shrink-0">
          <button *ngIf="tabActiva() !== 'proyectos'" (click)="guardarConfiguracion()" [disabled]="guardando()"
                  class="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] cursor-pointer disabled:opacity-50">
            <span *ngIf="!guardando()">✓ Guardar Cambios</span>
            <span *ngIf="guardando()">Guardando...</span>
          </button>
        </div>
      </div>

      <!-- ALERTA DE ÉXITO O ERROR -->
      <div *ngIf="mensajeAlerta()" 
           [class]="'p-4.5 rounded-2xl border text-sm flex items-center justify-between animate-fade font-sans ' + (tipoAlerta() === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900')">
        <div class="flex items-center gap-3 font-semibold">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" [class]="tipoAlerta() === 'exito' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'"></span>
          <span>{{ mensajeAlerta() }}</span>
        </div>
        <button (click)="mensajeAlerta.set('')" class="text-neutral-400 hover:text-black font-bold p-1 cursor-pointer">✕</button>
      </div>

      <!-- TABS DE NAVEGACIÓN MODERNA -->
      <div class="flex items-center gap-2.5 p-2 rounded-2xl bg-neutral-100 border border-neutral-200/80 overflow-x-auto scrollbar-none">
        <button (click)="tabActiva.set('proyectos')"
                [class]="'px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 ' + (tabActiva() === 'proyectos' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span>1. Proyectos & Galería</span>
          <span class="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold" [class]="tabActiva() === 'proyectos' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'">{{ proyectosService.getProyectos().length }}</span>
        </button>

        <button (click)="tabActiva.set('home')"
                [class]="'px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 ' + (tabActiva() === 'home' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>2. Textos del Home</span>
        </button>

        <button (click)="tabActiva.set('cotizador')"
                [class]="'px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 ' + (tabActiva() === 'cotizador' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
          <span>3. Cotiza con Nosotros</span>
        </button>

        <button (click)="tabActiva.set('contacto')"
                [class]="'px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 ' + (tabActiva() === 'contacto' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>4. Canales & Alerta</span>
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 1: GESTIÓN DE PROYECTOS (CLOUDINARY)                   -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'proyectos'" class="space-y-8 animate-fade">
        
        <!-- Formulario Crear Proyecto -->
        <div class="bg-white border border-neutral-200/90 rounded-3xl p-7 sm:p-9 shadow-2xs space-y-6">
          <div class="pb-4 border-b border-neutral-200/80">
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Publicar Nuevo Proyecto Arquitectónico</h3>
            <p class="font-sans text-sm text-neutral-500 font-light mt-1">La imagen se optimizará automáticamente en Cloudinary y se publicará de inmediato en el catálogo.</p>
          </div>

          <form (submit)="onCrearProyecto($event)" class="space-y-5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <!-- Título -->
              <div class="sm:col-span-2">
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Título del Proyecto *</label>
                <input type="text" [(ngModel)]="nuevoProyecto.titulo" name="p_titulo" required placeholder="Ej: CASA BOSQUE ALTO"
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

              <!-- Categoría -->
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Categoría *</label>
                <select [(ngModel)]="nuevoProyecto.categoria" name="p_cat" required
                        class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer">
                  <option value="Residencial">Residencial</option>
                  <option value="Remodelación">Remodelación</option>
                  <option value="Arquitectura interior">Arquitectura interior</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>

              <!-- Subtítulo / Tagline -->
              <div class="sm:col-span-3">
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Subtítulo Editorial *</label>
                <input type="text" [(ngModel)]="nuevoProyecto.subtitulo" name="p_subtitulo" placeholder="Ej: Volumetría pura en concreto blanco y ventanería de piso a techo."
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

              <!-- Ubicación -->
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Ubicación</label>
                <input type="text" [(ngModel)]="nuevoProyecto.ubicacion" name="p_ubi" placeholder="Ej: Llanogrande, Rionegro"
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

              <!-- Área m2 -->
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Área Construida (m²)</label>
                <input type="number" [(ngModel)]="nuevoProyecto.area" name="p_area" placeholder="480"
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-mono text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

              <!-- Año -->
              <div>
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Año de Ejecución</label>
                <input type="number" [(ngModel)]="nuevoProyecto.anio" name="p_anio" placeholder="2026"
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-mono text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

              <!-- Imagen Principal (Upload Cloudinary) -->
              <div class="sm:col-span-2">
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Fotografía Principal del Proyecto (Cloudinary) *</label>
                <input type="file" (change)="onArchivoSeleccionado($event)" accept="image/*"
                       class="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 font-sans text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer">
              </div>

              <!-- Switch Destacado -->
              <div class="flex items-center gap-3 pt-6 font-sans">
                <input type="checkbox" [(ngModel)]="nuevoProyecto.destacado" id="chkDest" name="p_dest"
                       class="w-5 h-5 rounded-md border-neutral-300 text-black focus:ring-black cursor-pointer accent-black">
                <label for="chkDest" class="text-neutral-900 font-semibold cursor-pointer select-none text-xs">Mostrar en Destacados del Home</label>
              </div>

              <!-- Descripción -->
              <div class="sm:col-span-3">
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Memoria Descriptiva del Proyecto</label>
                <textarea [(ngModel)]="nuevoProyecto.descripcion" name="p_desc" rows="3" placeholder="Describe los materiales, el concepto espacial y la relación con el entorno natural..."
                          class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"></textarea>
              </div>

              <!-- Características -->
              <div class="sm:col-span-3">
                <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Especificaciones Clave (Separadas por comas)</label>
                <input type="text" [(ngModel)]="nuevoProyecto.caracteristicasStr" name="p_caract" placeholder="Ej: Concreto a la vista, Piscina infinity, Domótica Lutron, Paneles solares"
                       class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
              </div>

            </div>

            <div class="flex justify-end pt-4 border-t border-neutral-200/80">
              <button type="submit" [disabled]="subiendoProyecto()"
                      class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] cursor-pointer disabled:opacity-50">
                <span *ngIf="!subiendoProyecto()">🚀 Subir a Cloudinary y Publicar</span>
                <span *ngIf="subiendoProyecto()" class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  Subiendo a Cloudinary...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tabla / Catálogo de Proyectos Activos -->
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-neutral-200/80">
            <div>
              <h3 class="font-serif text-xl font-bold text-neutral-900">Catálogo Actual de Obras</h3>
              <p class="font-sans text-xs text-neutral-500 mt-0.5">Total de obras publicadas: {{ proyectosService.getProyectos().length }} proyectos</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-bold text-neutral-500 font-mono">
                <tr>
                  <th class="p-3.5">Foto</th>
                  <th class="p-3.5">Título & Ubicación</th>
                  <th class="p-3.5">Categoría</th>
                  <th class="p-3.5">Área / Año</th>
                  <th class="p-3.5">Destacado</th>
                  <th class="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                <tr *ngFor="let p of proyectosService.getProyectos()" class="hover:bg-neutral-50/70 transition-colors">
                  <td class="p-3.5">
                    <img [src]="p.imagenUrl" [alt]="p.titulo" class="w-16 h-11 object-cover rounded-xl border border-neutral-200 shadow-2xs">
                  </td>
                  <td class="p-3.5">
                    <div class="font-bold text-neutral-900 text-sm">{{ p.titulo }}</div>
                    <div class="text-xs text-neutral-500">{{ p.ubicacion }}</div>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 font-mono text-[10px] font-semibold text-neutral-700">
                      {{ p.categoria }}
                    </span>
                  </td>
                  <td class="p-3.5 font-mono text-neutral-600">
                    {{ p.area ? p.area + ' m²' : '—' }} / {{ p.anio || '2026' }}
                  </td>
                  <td class="p-3.5">
                    <span *ngIf="p.destacado" class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> En Home
                    </span>
                    <span *ngIf="!p.destacado" class="text-neutral-400 font-mono text-xs">—</span>
                  </td>
                  <td class="p-3.5 text-right">
                    <button (click)="eliminarProyecto(p.id)" title="Eliminar proyecto"
                            class="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-xs font-semibold border border-transparent hover:border-red-200">
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 2: TEXTOS DEL HOME & HERO                              -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'home'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <!-- Tarjeta Hero -->
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Hero & Portada Principal
          </h3>
          
          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Tagline Superior</label>
            <input type="text" [(ngModel)]="formConfig.hero_tagline"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Título Principal</label>
            <input type="text" [(ngModel)]="formConfig.hero_title"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Subtítulo Descriptivo</label>
            <textarea [(ngModel)]="formConfig.hero_subtitle" rows="3"
                      class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Badge / Etiqueta</label>
              <input type="text" [(ngModel)]="formConfig.hero_badge"
                     class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-mono text-xs focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
            </div>
            <div>
              <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Texto Botón</label>
              <input type="text" [(ngModel)]="formConfig.hero_btn_text"
                     class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
            </div>
          </div>
        </div>

        <!-- Tarjeta Filosofía y Director -->
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Filosofía & Liderazgo Técnico
          </h3>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Cita Filosófica</label>
            <textarea [(ngModel)]="formConfig.about_quote" rows="2"
                      class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"></textarea>
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Descripción de Trayectoria</label>
            <textarea [(ngModel)]="formConfig.about_description" rows="3"
                      class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Nombre Director</label>
              <input type="text" [(ngModel)]="formConfig.director_name"
                     class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
            </div>
            <div>
              <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Cargo / Rol</label>
              <input type="text" [(ngModel)]="formConfig.director_role"
                     class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 3: COTIZA CON NOSOTROS                                 -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'cotizador'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Encabezado de Cotización
          </h3>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Título de la Página</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_title"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Subtítulo</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_subtitle"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Texto de Invitación</label>
            <textarea [(ngModel)]="formConfig.cotiza_intro_text" rows="3"
                      class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"></textarea>
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Texto Botón Enviar</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_btn_text"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>
        </div>

        <!-- Vista Previa Limpia -->
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Vista Previa en Vivo
          </h3>
          
          <div class="p-6 rounded-2xl bg-neutral-900 text-white space-y-3 shadow-sm">
            <span class="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">SYSMICON STUDIO</span>
            <h4 class="font-serif text-2xl font-bold text-white">{{ formConfig.cotiza_title }}</h4>
            <p class="text-xs text-neutral-300">{{ formConfig.cotiza_subtitle }}</p>
            <p class="text-xs text-neutral-400 pt-3 border-t border-neutral-800">{{ formConfig.cotiza_intro_text }}</p>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 4: CANALES & ALERTA GLOBAL                             -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'contacto'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Canales Directos & Ubicación
          </h3>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Teléfono de Atención</label>
            <input type="text" [(ngModel)]="formConfig.telefono_contacto"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Email de Arquitectura</label>
            <input type="email" [(ngModel)]="formConfig.email_soporte"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Cuenta de Instagram</label>
            <input type="text" [(ngModel)]="formConfig.instagram_handle"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-mono text-xs focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div>
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Dirección de Sede / Oficina</label>
            <input type="text" [(ngModel)]="formConfig.direccion_oficina"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>
        </div>

        <div class="bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 class="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200/80 uppercase tracking-tight">
            Banner Superior de Alerta
          </h3>

          <div class="flex items-center gap-3 py-1 font-sans">
            <input type="checkbox" [(ngModel)]="mostrarBannerAlertaBool" id="chkBannerGlobal"
                   class="w-5 h-5 rounded-md border-neutral-300 text-black focus:ring-black cursor-pointer accent-black">
            <label for="chkBannerGlobal" class="text-neutral-900 font-semibold cursor-pointer select-none text-xs">Mostrar Banner en Todo el Sitio</label>
          </div>

          <div *ngIf="mostrarBannerAlertaBool">
            <label class="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">Texto del Anuncio / Noticia</label>
            <input type="text" [(ngModel)]="formConfig.texto_banner_alerta"
                   class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-sans text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
          </div>

          <div *ngIf="mostrarBannerAlertaBool" class="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-mono flex items-center justify-between mt-4">
            <div class="flex items-center gap-2 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{{ formConfig.texto_banner_alerta }}</span>
            </div>
            <span class="text-[9px] font-bold bg-black text-white px-2 py-0.5 rounded-full">EN VIVO</span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashPersonalizarComponent implements OnInit {
  readonly cmsService = inject(CmsService);
  readonly proyectosService = inject(ProyectosService);
  readonly adminService = inject(AdminService);

  readonly tabActiva = signal<'proyectos' | 'home' | 'cotizador' | 'contacto'>('proyectos');
  readonly guardando = signal<boolean>(false);
  readonly subiendoProyecto = signal<boolean>(false);
  readonly mensajeAlerta = signal<string>('');
  readonly tipoAlerta = signal<'exito' | 'error'>('exito');

  formConfig: SiteConfig = { ...this.cmsService.config() };

  get mostrarBannerAlertaBool(): boolean {
    return this.formConfig.mostrar_banner_alerta === '1';
  }

  set mostrarBannerAlertaBool(val: boolean) {
    this.formConfig.mostrar_banner_alerta = val ? '1' : '0';
  }

  // Modelo del formulario de nuevo proyecto
  nuevoProyecto = {
    titulo: '',
    subtitulo: '',
    categoria: 'Residencial',
    descripcion: '',
    ubicacion: 'Llanogrande, Antioquia',
    area: 450,
    anio: 2026,
    destacado: true,
    caracteristicasStr: 'Concreto arquitectónico, Ventanería acústica, Iluminación indirecta'
  };

  archivoSeleccionado: File | null = null;

  ngOnInit(): void {
    this.formConfig = { ...this.cmsService.config() };
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  onCrearProyecto(event: Event): void {
    event.preventDefault();
    if (!this.nuevoProyecto.titulo || !this.archivoSeleccionado) {
      this.mostrarMensaje('Por favor ingresa el título del proyecto y selecciona una imagen.', 'error');
      return;
    }

    this.subiendoProyecto.set(true);
    this.mensajeAlerta.set('');

    const formData = new FormData();
    formData.append('titulo', this.nuevoProyecto.titulo);
    formData.append('subtitulo', this.nuevoProyecto.subtitulo);
    formData.append('categoria', this.nuevoProyecto.categoria);
    formData.append('descripcion', this.nuevoProyecto.descripcion);
    formData.append('ubicacion', this.nuevoProyecto.ubicacion);
    formData.append('area_m2', String(this.nuevoProyecto.area));
    formData.append('anio', String(this.nuevoProyecto.anio));
    formData.append('destacado', this.nuevoProyecto.destacado ? '1' : '0');
    formData.append('imagen', this.archivoSeleccionado);

    const caracteristicas = this.nuevoProyecto.caracteristicasStr
      .split(',')
      .map(s => s.trim())
      .filter(s => !!s);
    formData.append('caracteristicas', JSON.stringify(caracteristicas));

    this.proyectosService.crearProyectoApi(formData).subscribe({
      next: () => {
        this.subiendoProyecto.set(false);
        this.mostrarMensaje('¡Proyecto subido a Cloudinary y publicado exitosamente en la galería!', 'exito');
        this.nuevoProyecto.titulo = '';
        this.nuevoProyecto.subtitulo = '';
        this.nuevoProyecto.descripcion = '';
        this.archivoSeleccionado = null;
      },
      error: (err) => {
        this.subiendoProyecto.set(false);
        const errDesc = err?.error?.message || 'Error al conectar con el backend o Cloudinary.';
        this.mostrarMensaje(errDesc, 'error');
      }
    });
  }

  eliminarProyecto(id: string | number): void {
    if (confirm('¿Estás seguro de eliminar este proyecto del catálogo?')) {
      this.proyectosService.eliminarProyectoApi(id).subscribe({
        next: () => this.mostrarMensaje('Proyecto eliminado del portafolio.', 'exito'),
        error: () => this.mostrarMensaje('Error al eliminar proyecto.', 'error')
      });
    }
  }

  guardarConfiguracion(): void {
    this.guardando.set(true);
    this.mensajeAlerta.set('');

    this.cmsService.saveConfig(this.formConfig).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarMensaje('¡Configuración y textos del sitio guardados exitosamente en la base de datos!', 'exito');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarMensaje('Error al guardar la configuración en la base de datos.', 'error');
      }
    });
  }

  private mostrarMensaje(msg: string, tipo: 'exito' | 'error'): void {
    this.mensajeAlerta.set(msg);
    this.tipoAlerta.set(tipo);
    setTimeout(() => {
      if (this.mensajeAlerta() === msg) {
        this.mensajeAlerta.set('');
      }
    }, 6000);
  }
}
