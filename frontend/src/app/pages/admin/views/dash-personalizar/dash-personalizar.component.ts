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
    <div class="space-y-6 animate-fade font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CMS & Control Editorial en Tiempo Real</span>
          </div>
          <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Personalizar Sitio & Portafolio</h2>
          <p class="text-xs text-gray-400 mt-1">Crea y administra proyectos residenciales con Cloudinary y edita todos los textos públicos del portal.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button *ngIf="tabActiva() !== 'proyectos'" (click)="guardarConfiguracion()" [disabled]="guardando()"
                  class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black border border-white font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-105 cursor-pointer disabled:opacity-50">
            <span *ngIf="!guardando()">✓ Publicar Cambios en Vivo</span>
            <span *ngIf="guardando()">Guardando...</span>
          </button>
        </div>
      </div>

      <!-- ALERTA DE ÉXITO O ERROR -->
      <div *ngIf="mensajeAlerta()" 
           [class]="'p-4 rounded-xl border text-xs flex items-center justify-between animate-fade font-mono ' + (tipoAlerta() === 'exito' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-red-950/40 border-red-500/30 text-red-300')">
        <div class="flex items-center gap-2 font-bold">
          <span class="w-2 h-2 rounded-full" [class]="tipoAlerta() === 'exito' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
          <span>{{ mensajeAlerta() }}</span>
        </div>
        <button (click)="mensajeAlerta.set('')" class="text-gray-400 hover:text-white font-bold p-1">✕</button>
      </div>

      <!-- TABS DE NAVEGACIÓN DE PERSONALIZAR -->
      <div class="flex items-center gap-2 p-1.5 rounded-xl bg-[#080808] border border-white/10 overflow-x-auto scrollbar-none">
        <button (click)="tabActiva.set('proyectos')"
                [class]="'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ' + (tabActiva() === 'proyectos' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span>1. Proyectos & Galería</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded font-mono" [class]="tabActiva() === 'proyectos' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'">{{ proyectosService.getProyectos().length }}</span>
        </button>

        <button (click)="tabActiva.set('home')"
                [class]="'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ' + (tabActiva() === 'home' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>2. Textos del Home</span>
        </button>

        <button (click)="tabActiva.set('cotizador')"
                [class]="'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ' + (tabActiva() === 'cotizador' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
          <span>3. Cotiza con Nosotros</span>
        </button>

        <button (click)="tabActiva.set('contacto')"
                [class]="'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ' + (tabActiva() === 'contacto' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5')">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>4. Contacto & Alerta</span>
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 1: GESTIÓN DE PROYECTOS                                -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'proyectos'" class="space-y-8 animate-fade">
        
        <!-- Formulario Crear Proyecto -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl overflow-hidden">
          <!-- Trazos esquineros -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>

          <div class="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div>
              <h3 class="font-serif text-xl font-bold text-white flex items-center gap-2">
                <span>➕ Publicar Nuevo Proyecto Arquitectónico</span>
              </h3>
              <p class="text-xs text-gray-400 mt-1">La imagen se optimizará automáticamente en Cloudinary y se publicará en /proyectos y en el Home.</p>
            </div>
          </div>

          <form (submit)="onCrearProyecto($event)" class="space-y-5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <!-- Título -->
              <div class="sm:col-span-2">
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Título del Proyecto *</label>
                <input type="text" [(ngModel)]="nuevoProyecto.titulo" name="p_titulo" required placeholder="Ej: CASA BOSQUE ALTO"
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Categoría *</label>
                <select [(ngModel)]="nuevoProyecto.categoria" name="p_cat" required
                        class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none cursor-pointer">
                  <option value="Residencial">Residencial</option>
                  <option value="Remodelación">Remodelación</option>
                  <option value="Arquitectura interior">Arquitectura interior</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>

              <!-- Subtítulo / Tagline -->
              <div class="sm:col-span-3">
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Subtítulo Editorial *</label>
                <input type="text" [(ngModel)]="nuevoProyecto.subtitulo" name="p_subtitulo" placeholder="Ej: Volumetría pura en concreto blanco y ventanería de piso a techo."
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
              </div>

              <!-- Ubicación -->
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Ubicación</label>
                <input type="text" [(ngModel)]="nuevoProyecto.ubicacion" name="p_ubi" placeholder="Ej: Llanogrande, Rionegro"
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
              </div>

              <!-- Área m2 -->
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Área Construida (m²)</label>
                <input type="number" [(ngModel)]="nuevoProyecto.area" name="p_area" placeholder="Ej: 480"
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-mono">
              </div>

              <!-- Año -->
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Año de Ejecución</label>
                <input type="number" [(ngModel)]="nuevoProyecto.anio" name="p_anio" placeholder="2026"
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-mono">
              </div>

              <!-- Imagen Principal (Upload Cloudinary) -->
              <div class="sm:col-span-2">
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Fotografía Principal del Proyecto (Cloudinary) *</label>
                <input type="file" (change)="onArchivoSeleccionado($event)" accept="image/*"
                       class="w-full px-3.5 py-2 rounded-lg bg-[#090909] border border-white/10 text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer">
              </div>

              <!-- Switch Destacado -->
              <div class="flex items-center gap-3 pt-6 font-sans">
                <input type="checkbox" [(ngModel)]="nuevoProyecto.destacado" id="chkDest" name="p_dest"
                       class="w-4 h-4 rounded bg-[#222] border-white/20 text-white focus:ring-0 cursor-pointer">
                <label for="chkDest" class="text-white font-bold cursor-pointer select-none">Mostrar en Destacados del Home</label>
              </div>

              <!-- Descripción -->
              <div class="sm:col-span-3">
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Memoria Descriptiva del Proyecto</label>
                <textarea [(ngModel)]="nuevoProyecto.descripcion" name="p_desc" rows="3" placeholder="Describe los materiales, el concepto espacial y la relación con el entorno natural..."
                          class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none"></textarea>
              </div>

              <!-- Características (separadas por comas) -->
              <div class="sm:col-span-3">
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Especificaciones / Características Clave (Separadas por comas)</label>
                <input type="text" [(ngModel)]="nuevoProyecto.caracteristicasStr" name="p_caract" placeholder="Ej: Concreto a la vista, Piscina infinity, Domótica integral Lutron, Paneles solares"
                       class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
              </div>

            </div>

            <div class="flex justify-end pt-4 border-t border-white/10">
              <button type="submit" [disabled]="subiendoProyecto()"
                      class="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-105 cursor-pointer disabled:opacity-50">
                <span *ngIf="!subiendoProyecto()">🚀 Subir a Cloudinary y Publicar</span>
                <span *ngIf="subiendoProyecto()" class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-black animate-ping"></span>
                  Subiendo a Cloudinary...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tabla de Proyectos Activos -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
            <span>Catálogo Actual de Obras</span>
            <span class="text-xs font-mono text-gray-400">Total: {{ proyectosService.getProyectos().length }} proyectos</span>
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-[#090909] border-b border-white/10 text-[10px] uppercase font-bold text-gray-400 font-mono">
                <tr>
                  <th class="p-3">Foto</th>
                  <th class="p-3">Título & Ubicación</th>
                  <th class="p-3">Categoría</th>
                  <th class="p-3">Área / Año</th>
                  <th class="p-3">Destacado</th>
                  <th class="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr *ngFor="let p of proyectosService.getProyectos()" class="hover:bg-white/[0.02] transition-colors">
                  <td class="p-3">
                    <img [src]="p.imagenUrl" [alt]="p.titulo" class="w-14 h-10 object-cover rounded-lg border border-white/10">
                  </td>
                  <td class="p-3">
                    <div class="font-bold text-white">{{ p.titulo }}</div>
                    <div class="text-[11px] text-gray-400">{{ p.ubicacion }}</div>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">
                      {{ p.categoria }}
                    </span>
                  </td>
                  <td class="p-3 font-mono text-gray-400">
                    {{ p.area ? p.area + ' m²' : '—' }} / {{ p.anio || '2026' }}
                  </td>
                  <td class="p-3">
                    <span *ngIf="p.destacado" class="text-emerald-400 text-[10px] font-bold font-mono">★ En Home</span>
                    <span *ngIf="!p.destacado" class="text-gray-600 text-[10px] font-mono">—</span>
                  </td>
                  <td class="p-3 text-right">
                    <button (click)="eliminarProyecto(p.id)" title="Eliminar proyecto"
                            class="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-xs font-bold">
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
      <!-- PESTAÑA 2: TEXTOS DEL HOME                                     -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'home'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Hero & Portada Principal</h3>
          
          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Tagline Superior (Hero)</label>
            <input type="text" [(ngModel)]="formConfig.hero_tagline"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Título Principal (Hero)</label>
            <input type="text" [(ngModel)]="formConfig.hero_title"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Subtítulo Descriptivo (Hero)</label>
            <textarea [(ngModel)]="formConfig.hero_subtitle" rows="2"
                      class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Badge / Etiqueta Hero</label>
              <input type="text" [(ngModel)]="formConfig.hero_badge"
                     class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-mono">
            </div>
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Texto Botón Hero</label>
              <input type="text" [(ngModel)]="formConfig.hero_btn_text"
                     class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
            </div>
          </div>
        </div>

        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Filosofía & Sección Director</h3>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Cita Filosófica / Manifiesto</label>
            <textarea [(ngModel)]="formConfig.about_quote" rows="2"
                      class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none"></textarea>
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Descripción de Trayectoria</label>
            <textarea [(ngModel)]="formConfig.about_description" rows="3"
                      class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Nombre del Director</label>
              <input type="text" [(ngModel)]="formConfig.director_name"
                     class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
            </div>
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Cargo / Rol</label>
              <input type="text" [(ngModel)]="formConfig.director_role"
                     class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 3: COTIZA CON NOSOTROS                                 -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'cotizador'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Encabezado del Cotizador</h3>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Título de la Página</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_title"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Subtítulo</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_subtitle"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Texto de Invitación / Introducción</label>
            <textarea [(ngModel)]="formConfig.cotiza_intro_text" rows="3"
                      class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none"></textarea>
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Texto del Botón Enviar</label>
            <input type="text" [(ngModel)]="formConfig.cotiza_btn_text"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>
        </div>

        <!-- Previsualizador de Cotización -->
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Vista Previa del Encabezado</h3>
          
          <div class="p-6 rounded-xl bg-black border border-white/5 space-y-3">
            <span class="text-[10px] uppercase font-mono tracking-widest text-gray-400 block">SYSMICON STUDIO</span>
            <h4 class="font-serif text-2xl font-bold text-white">{{ formConfig.cotiza_title }}</h4>
            <p class="text-xs text-gray-300 font-mono">{{ formConfig.cotiza_subtitle }}</p>
            <p class="text-xs text-gray-400 pt-2 border-t border-white/5">{{ formConfig.cotiza_intro_text }}</p>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 4: CONTACTO & ALERTA GLOBAL                            -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'contacto'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade text-xs">
        
        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Canales Directos & Ubicación</h3>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Teléfono de Atención</label>
            <input type="text" [(ngModel)]="formConfig.telefono_contacto"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Email de Arquitectura</label>
            <input type="email" [(ngModel)]="formConfig.email_soporte"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Cuenta de Instagram</label>
            <input type="text" [(ngModel)]="formConfig.instagram_handle"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none font-mono">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Dirección de Sede / Oficina</label>
            <input type="text" [(ngModel)]="formConfig.direccion_oficina"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>
        </div>

        <div class="relative bg-[#030303] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 overflow-hidden">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">Banner Superior de Alerta</h3>

          <div class="flex items-center gap-3 py-1 font-sans">
            <input type="checkbox" [(ngModel)]="mostrarBannerAlertaBool" id="chkBannerGlobal"
                   class="w-4 h-4 rounded bg-[#222] border-white/20 text-white focus:ring-0 cursor-pointer">
            <label for="chkBannerGlobal" class="text-white font-bold cursor-pointer select-none">Mostrar Banner en Todo el Sitio</label>
          </div>

          <div *ngIf="mostrarBannerAlertaBool">
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Texto del Anuncio / Noticia</label>
            <input type="text" [(ngModel)]="formConfig.texto_banner_alerta"
                   class="w-full px-3.5 py-2.5 rounded-lg bg-[#090909] border border-white/10 text-white focus:border-white focus:outline-none">
          </div>

          <!-- Muestra en vivo -->
          <div *ngIf="mostrarBannerAlertaBool" class="p-3.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs font-mono flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{{ formConfig.texto_banner_alerta }}</span>
            </div>
            <span class="text-[9px] font-bold bg-white text-black px-2 py-0.5 rounded">VIVO</span>
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
