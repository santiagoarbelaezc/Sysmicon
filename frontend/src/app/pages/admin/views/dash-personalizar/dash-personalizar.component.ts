import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsService, SiteConfig, DEFAULT_SITE_CONFIG } from '../../../../services/cms.service';
import { ProyectosService } from '../../../../services/proyectos.service';
import { AdminService } from '../../../../services/admin.service';
import { Proyecto } from '../../../../models/proyecto.model';

interface GaleriaItem {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-dash-personalizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10 animate-fade-in font-sans pb-28 max-w-[1650px] mx-auto">
      
      <!-- =====================================================
           ENCABEZADO DE SECCIÓN
           ===================================================== -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b-2 border-neutral-200">
        <div class="max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 font-mono text-xs tracking-widest text-neutral-800 font-bold uppercase mb-4">
            <svg width="14" height="14" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            SISTEMA DE GESTIÓN & CONTENIDOS
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-tight">
            Personalización del Sitio
          </h1>
          <p class="font-sans text-lg text-neutral-600 font-normal mt-3">
            Publica obras con galerías de alta resolución (hasta 30 fotos), edita los textos editoriales y gestiona los canales del estudio.
          </p>
        </div>
        
        <div class="flex items-center gap-4 shrink-0">
          <button *ngIf="tabActiva() !== 'proyectos'" (click)="guardarConfiguracion()" [disabled]="guardando()"
                  class="admin-btn-primary py-4 px-8 text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <span *ngIf="!guardando()">Guardar Cambios</span>
            <span *ngIf="guardando()" class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Guardando...
            </span>
          </button>
        </div>
      </div>

      <!-- ALERTA DE ÉXITO O ERROR -->
      <div *ngIf="mensajeAlerta()" 
           class="p-5 rounded-2xl border-2 flex items-center justify-between animate-fade-in shadow-md"
           [ngClass]="tipoAlerta() === 'exito' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'">
        <div class="flex items-center gap-3 font-bold text-base">
          <span class="w-3.5 h-3.5 rounded-full shrink-0" [ngClass]="tipoAlerta() === 'exito' ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'"></span>
          <span>{{ mensajeAlerta() }}</span>
        </div>
        <button (click)="mensajeAlerta.set('')" class="text-neutral-500 hover:text-neutral-950 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- =====================================================
           NAVEGACIÓN PRINCIPAL (TABS MODERNIZADOS)
           ===================================================== -->
      <div class="bg-neutral-100/90 p-2 rounded-2xl border-2 border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-inner">
        
        <!-- Tab 1: Proyectos -->
        <button (click)="tabActiva.set('proyectos')"
                [ngClass]="tabActiva() === 'proyectos' ? 'bg-neutral-950 text-white shadow-lg' : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'"
                class="py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200">
          <svg width="20" height="20" style="width: 20px; height: 20px; min-width: 20px;" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <span>Proyectos</span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
                [ngClass]="tabActiva() === 'proyectos' ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-800'">
            {{ proyectosService.getProyectos().length }}
          </span>
        </button>

        <!-- Tab 2: Home -->
        <button (click)="tabActiva.set('home')"
                [ngClass]="tabActiva() === 'home' ? 'bg-neutral-950 text-white shadow-lg' : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'"
                class="py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200">
          <svg width="20" height="20" style="width: 20px; height: 20px; min-width: 20px;" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Textos Home</span>
        </button>

        <!-- Tab 3: Cotizador -->
        <button (click)="tabActiva.set('cotizador')"
                [ngClass]="tabActiva() === 'cotizador' ? 'bg-neutral-950 text-white shadow-lg' : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'"
                class="py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200">
          <svg width="20" height="20" style="width: 20px; height: 20px; min-width: 20px;" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M7 7h10"/>
            <path d="M7 12h10"/>
            <path d="M7 17h10"/>
          </svg>
          <span>Cotizador</span>
        </button>

        <!-- Tab 4: Canales -->
        <button (click)="tabActiva.set('contacto')"
                [ngClass]="tabActiva() === 'contacto' ? 'bg-neutral-950 text-white shadow-lg' : 'bg-white/80 text-neutral-700 hover:text-neutral-950 hover:bg-white'"
                class="py-4 px-5 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 border border-neutral-200">
          <svg width="20" height="20" style="width: 20px; height: 20px; min-width: 20px;" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Canales</span>
        </button>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 1: GESTIÓN DE PROYECTOS                                -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'proyectos'" class="space-y-16 animate-fade-in mt-10">
        
        <!-- FORMULARIO INTEGRAL DE CREACIÓN DE PROYECTO CON MULTI-IMAGEN HASTA 30 FOTOS -->
        <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-12 shadow-md">
          
          <div class="mb-10 pb-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Nueva Publicación</span>
              <h3 class="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight mt-1">
                Publicar Obra en el Portafolio
              </h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-2">
                Define la fotografía de portada, agrega hasta 30 imágenes de alta calidad para la galería y especifica todos los detalles constructivos.
              </p>
            </div>
            <div class="bg-neutral-100 border border-neutral-300 rounded-2xl px-5 py-3 text-right shrink-0">
              <span class="text-xs font-mono font-bold text-neutral-500 uppercase block">Galería Total</span>
              <span class="text-lg font-mono font-bold text-neutral-950">
                {{ (portadaPreview() ? 1 : 0) + galeriaImagenes().length }} / 31 Fotos
              </span>
            </div>
          </div>

          <form (submit)="onCrearProyecto($event)" class="space-y-12">
            
            <!-- ============================================================
                 BLOQUE 1: ZONA DE FOTOGRAFÍAS (PORTADA + GALERÍA HASTA 30)
                 ============================================================ -->
            <div class="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-8">
              
              <div class="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h4 class="font-serif text-2xl font-black text-neutral-950 uppercase">
                    1. Fotografía de Portada & Galería Completa
                  </h4>
                  <p class="text-sm text-neutral-600 mt-1">
                    Carga la portada principal de la obra y complementa con hasta 30 fotografías para el recorrido cinemático.
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <!-- PORTADA PRINCIPAL (Columna de 5) -->
                <div class="lg:col-span-5 space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900">
                      Fotografía de Portada <span class="text-red-600 font-black text-base">*</span>
                    </label>
                    <span class="text-xs font-mono font-bold text-neutral-500 uppercase">Principal (Catálogo & Hero)</span>
                  </div>

                  <div class="relative w-full aspect-[4/3] bg-white border-2 border-dashed border-neutral-400 rounded-2xl flex flex-col items-center justify-center p-4 text-center hover:border-black hover:bg-neutral-100 transition-all cursor-pointer group overflow-hidden shadow-sm">
                    <input type="file" (change)="onArchivoPortadaSeleccionado($event)" accept="image/*"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" [required]="!archivoPortada">
                    
                    <!-- Previsualización de Portada -->
                    <div *ngIf="portadaPreview()" class="absolute inset-0 z-10 w-full h-full">
                      <img [src]="portadaPreview()" alt="Portada Preview" class="w-full h-full object-cover">
                      <div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg">Cambiar Foto de Portada</span>
                        <span class="text-white text-xs mt-2 font-mono">{{ archivoPortada?.name }}</span>
                      </div>
                    </div>

                    <!-- Estado Vacío -->
                    <div *ngIf="!portadaPreview()" class="relative z-0 pointer-events-none flex flex-col items-center px-4">
                      <div class="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg width="26" height="26" class="text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                      </div>
                      <span class="font-bold text-neutral-950 text-base">Subir Portada Oficial</span>
                      <span class="text-neutral-500 text-xs mt-1">Formato JPG o PNG de alta resolución</span>
                    </div>
                  </div>

                  <div *ngIf="archivoPortada" class="flex items-center justify-between p-3 bg-emerald-100/70 text-emerald-950 rounded-xl border border-emerald-300 text-sm font-semibold">
                    <span class="truncate max-w-[280px]">✓ {{ archivoPortada.name }}</span>
                    <button type="button" (click)="quitarPortada()" class="text-emerald-900 hover:text-red-600 text-xs font-bold uppercase underline cursor-pointer">
                      Quitar
                    </button>
                  </div>
                </div>

                <!-- GALERÍA MULTI-IMAGEN HASTA 30 FOTOS (Columna de 7) -->
                <div class="lg:col-span-7 space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900">
                        Galería del Proyecto (Hasta 30 fotos adicionales)
                      </label>
                      <span class="text-xs text-neutral-500">Fotografías de interiores, detalles constructivos, fachadas y planos.</span>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-mono font-bold px-3 py-1 bg-white rounded-lg border-2 border-neutral-300 text-neutral-800">
                        {{ galeriaImagenes().length }} / 30 fotos
                      </span>
                      <button *ngIf="galeriaImagenes().length > 0" type="button" (click)="limpiarGaleria()"
                              class="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider underline cursor-pointer">
                        Vaciar
                      </button>
                    </div>
                  </div>

                  <!-- Dropzone para Multi-Upload -->
                  <div class="relative w-full py-8 bg-white border-2 border-dashed border-neutral-400 rounded-2xl flex flex-col items-center justify-center px-6 text-center hover:border-black hover:bg-neutral-100 transition-all cursor-pointer group shadow-sm">
                    <input type="file" (change)="onImagenesGaleriaSeleccionadas($event)" multiple accept="image/*"
                           [disabled]="galeriaImagenes().length >= 30"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed">
                    
                    <div class="flex items-center gap-4 pointer-events-none">
                      <div class="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <svg width="24" height="24" class="text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </div>
                      <div class="text-left">
                        <span class="font-bold text-neutral-950 text-base block">
                          {{ galeriaImagenes().length >= 30 ? 'Límite de 30 fotos alcanzado' : 'Selecciona o arrastra varias imágenes a la vez' }}
                        </span>
                        <span class="text-neutral-500 text-xs">Puedes seleccionar hasta 30 archivos de una sola vez</span>
                      </div>
                    </div>
                  </div>

                  <!-- Grid de Miniaturas de las Fotos Cargadas -->
                  <div *ngIf="galeriaImagenes().length > 0" 
                       class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[280px] overflow-y-auto p-3 bg-white rounded-2xl border-2 border-neutral-200">
                    <div *ngFor="let item of galeriaImagenes(); let i = index" 
                         class="relative aspect-square rounded-xl overflow-hidden group border border-neutral-300 bg-neutral-100 shadow-xs">
                      <img [src]="item.previewUrl" alt="Foto {{ i + 1 }}" class="w-full h-full object-cover">
                      
                      <!-- Badge con número de foto -->
                      <span class="absolute top-1 left-1 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        #{{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}
                      </span>

                      <!-- Botón Eliminar Foto Individual -->
                      <button type="button" (click)="eliminarFotoGaleria(i)" title="Eliminar de la galería"
                              class="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer hover:bg-red-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>

                      <div class="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                        {{ item.file.name }}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            <!-- ============================================================
                 BLOQUE 2: DATOS DE IDENTIFICACIÓN & CATEGORÍA
                 ============================================================ -->
            <div class="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-6">
              
              <div class="border-b border-neutral-200 pb-4">
                <h4 class="font-serif text-2xl font-black text-neutral-950 uppercase">
                  2. Información de la Obra & Ubicación
                </h4>
                <p class="text-sm text-neutral-600 mt-1">Título editorial, categoría tipológica y zona geográfica.</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div class="lg:col-span-6">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Nombre de la Obra <span class="text-red-600 font-bold">*</span>
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.titulo" name="p_titulo" required 
                         placeholder="Ej: CASA M o RESIDENCIA ALTOS DEL VALLE"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-2xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all shadow-sm">
                </div>

                <div class="lg:col-span-6">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Subtítulo Conceptual / Editorial
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.subtitulo" name="p_subtitulo" 
                         placeholder="Ej: Geometría minimalista integrada con materiales nobles y luz natural."
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div class="lg:col-span-4">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Categoría Tipológica <span class="text-red-600 font-bold">*</span>
                  </label>
                  <select [(ngModel)]="nuevoProyecto.categoria" name="p_cat" required
                          class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-bold focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all cursor-pointer">
                    <option value="Residencial">Residencial</option>
                    <option value="Remodelación">Remodelación</option>
                    <option value="Arquitectura interior">Arquitectura interior</option>
                    <option value="Oficina">Oficina</option>
                  </select>
                </div>

                <div class="lg:col-span-4">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Ubicación Geográfica
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.ubicacion" name="p_ubi" 
                         placeholder="Ej: Llanogrande, Antioquia"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div class="lg:col-span-4 flex items-center pt-2 lg:pt-8">
                  <label for="chkDest" class="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-neutral-300 hover:border-black cursor-pointer transition-all w-full">
                    <input type="checkbox" [(ngModel)]="nuevoProyecto.destacado" id="chkDest" name="p_dest"
                           class="w-6 h-6 rounded border-2 border-neutral-400 text-black focus:ring-black cursor-pointer accent-black shrink-0">
                    <div>
                      <span class="text-neutral-950 font-bold text-base block">Destacar en el Home</span>
                      <span class="text-xs text-neutral-500">Aparecerá en la portada del sitio</span>
                    </div>
                  </label>
                </div>

              </div>

            </div>

            <!-- ============================================================
                 BLOQUE 3: ESPECIFICACIONES TÉCNICAS Y ATRIBUTOS EDITORIALES
                 ============================================================ -->
            <div class="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-6">
              
              <div class="border-b border-neutral-200 pb-4">
                <h4 class="font-serif text-2xl font-black text-neutral-950 uppercase">
                  3. Especificaciones Técnicas & Estilo de Revista
                </h4>
                <p class="text-sm text-neutral-600 mt-1">Métricas de ingeniería, materiales nobles y presentación editorial.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Área Construida (m²)
                  </label>
                  <input type="number" [(ngModel)]="nuevoProyecto.area" name="p_area" placeholder="Ej: 520"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Año de Ejecución
                  </label>
                  <input type="number" [(ngModel)]="nuevoProyecto.anio" name="p_anio" placeholder="Ej: 2026"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Estilo de Tarjeta Editorial
                  </label>
                  <select [(ngModel)]="nuevoProyecto.editorial_style" name="p_style"
                          class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-semibold focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all cursor-pointer">
                    <option value="coral-title">Coral Title (Editorial)</option>
                    <option value="white-bold">White Bold (Monocromático)</option>
                    <option value="ribbon-tag">Ribbon Tag (Cinta)</option>
                    <option value="split-grid">Split Grid (Dividido)</option>
                  </select>
                </div>

                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Código de Catálogo (Barcode)
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.barcode" name="p_barcode" placeholder="Ej: 0 600229402 1"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div class="sm:col-span-2 lg:col-span-6">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Slogan / Remate Editorial
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.editorial_slogan" name="p_slogan" 
                         placeholder="Ej: CONCRETO Y LUZ NATURAL EN EL ORIENTE ANTIOQUEÑO."
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

                <div class="sm:col-span-2 lg:col-span-6">
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Atributos y Materiales Clave (Separados por coma)
                  </label>
                  <input type="text" [(ngModel)]="nuevoProyecto.caracteristicasStr" name="p_caract" 
                         placeholder="Ej: Concreto a la vista con duela, Patio interior central, Iluminación indirecta"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>

              </div>

            </div>

            <!-- ============================================================
                 BLOQUE 4: MEMORIA DESCRIPTIVA
                 ============================================================ -->
            <div class="bg-neutral-50 p-6 sm:p-8 rounded-3xl border-2 border-neutral-300 space-y-4">
              <div class="border-b border-neutral-200 pb-4">
                <h4 class="font-serif text-2xl font-black text-neutral-950 uppercase">
                  4. Memoria Descriptiva & Concepto Arquitectónico
                </h4>
                <p class="text-sm text-neutral-600 mt-1">Escribe la visión de diseño, justificación espacial y experiencia de habitabilidad.</p>
              </div>

              <div>
                <textarea [(ngModel)]="nuevoProyecto.descripcion" name="p_desc" rows="5" 
                          placeholder="Describe la volumetría del proyecto, la distribución espacial, los materiales nobles utilizados y cómo dialoga con el entorno natural..."
                          class="w-full px-5 py-4 rounded-2xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            <!-- BARRA DE PUBLICACIÓN -->
            <div class="pt-6 border-t-2 border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div class="text-neutral-600 text-base font-medium">
                Al publicar, la portada y las fotos de la galería serán procesadas y optimizadas en alta definición para la web y móviles.
              </div>

              <button type="submit" [disabled]="subiendoProyecto()" 
                      class="admin-btn-primary py-5 px-12 text-base font-bold uppercase tracking-widest shadow-2xl rounded-2xl hover:scale-[1.01] transition-transform cursor-pointer shrink-0">
                <span *ngIf="!subiendoProyecto()" class="flex items-center gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Publicar Obra en Portafolio
                </span>
                <span *ngIf="subiendoProyecto()" class="flex items-center justify-center gap-3">
                  <span class="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Subiendo {{ (portadaPreview() ? 1 : 0) + galeriaImagenes().length }} Fotografías...
                </span>
              </button>
            </div>

          </form>
        </div>

        <!-- ============================================================== -->
        <!-- CATÁLOGO DE OBRAS ACTIVAS                                      -->
        <!-- ============================================================== -->
        <div class="space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-neutral-200">
            <div>
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Portafolio Actual</span>
              <h3 class="font-serif text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight mt-1">
                Catálogo de Obras Publicadas
              </h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-1">
                Total de obras registradas: <strong>{{ proyectosService.getProyectos().length }}</strong>
              </p>
            </div>
          </div>

          <div *ngIf="proyectosService.getProyectos().length === 0" class="bg-neutral-50 rounded-3xl p-16 text-center border-2 border-neutral-300">
            <p class="text-neutral-600 font-bold text-lg">Aún no hay obras publicadas en el catálogo.</p>
            <p class="text-neutral-500 text-sm mt-1">Usa el formulario superior para añadir tu primer proyecto.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="proyectosService.getProyectos().length > 0">
            <!-- Project Card -->
            <div *ngFor="let p of proyectosService.getProyectos()" class="group bg-white rounded-3xl border-2 border-neutral-300 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:border-black">
              
              <!-- Imagen del Proyecto -->
              <div class="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                <img [src]="p.imagenUrl" [alt]="p.titulo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Categoría & Destacado -->
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span class="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-black shadow-md">
                    {{ p.categoria }}
                  </span>
                  <span *ngIf="p.destacado" class="px-3 py-1.5 bg-black/95 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Home
                  </span>
                </div>

                <!-- Conteo de Galería -->
                <div class="absolute bottom-4 left-4">
                  <span class="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-white shadow flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    {{ (p.imagenesAdicionales?.length || 0) + 1 }} Fotografías
                  </span>
                </div>
                
                <!-- Botón Eliminar -->
                <div class="absolute top-4 right-4">
                  <button (click)="abrirModalEliminar(p)" title="Eliminar obra del portafolio"
                          class="w-11 h-11 bg-white/95 hover:bg-red-600 text-neutral-700 hover:text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>

              <!-- Contenido de la Tarjeta -->
              <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 class="font-serif text-2xl font-bold text-neutral-950 leading-snug">{{ p.titulo }}</h4>
                  <p class="text-base text-neutral-600 mt-1.5 line-clamp-1 font-medium">{{ p.ubicacion }}</p>
                  <p *ngIf="p.subtitulo" class="text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed">{{ p.subtitulo }}</p>
                </div>
                
                <div class="pt-4 flex items-center justify-between text-sm font-mono text-neutral-700 font-bold uppercase tracking-wider border-t-2 border-neutral-100">
                  <span class="bg-neutral-100 px-3 py-1 rounded-lg">{{ p.area ? p.area + ' m²' : 'Área N/D' }}</span>
                  <span class="bg-neutral-100 px-3 py-1 rounded-lg">{{ p.anio || '2026' }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 2: TEXTOS DEL HOME                                     -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'home'" class="space-y-10 animate-fade-in mt-10">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <!-- Bloque Portada / Hero -->
          <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div class="pb-4 border-b border-neutral-200">
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Inicio Principal</span>
              <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Portada / Hero</h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-1">Titular cinemático principal y botones del video inicial.</p>
            </div>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Prefijo del Título</label>
                  <input type="text" [(ngModel)]="formConfig.hero_title_prefix"
                         placeholder="Ej: Diseñamos y"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Palabra Resaltada</label>
                  <input type="text" [(ngModel)]="formConfig.hero_title_highlight"
                         placeholder="Ej: Construimos"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Botón Principal (Cotizar)</label>
                  <input type="text" [(ngModel)]="formConfig.hero_btn_cotizar"
                         placeholder="Ej: Cotiza con nosotros"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Botón Secundario (Obras)</label>
                  <input type="text" [(ngModel)]="formConfig.hero_btn_obras"
                         placeholder="Ej: Ver Obras & Proyectos"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Indicador Inferior de Desplazamiento</label>
                <input type="text" [(ngModel)]="formConfig.hero_scroll_text"
                       placeholder="Ej: DESLIZA PARA EXPLORAR"
                       class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Bloque Director Showcase (Juan Moreno) -->
          <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div class="pb-4 border-b border-neutral-200">
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Director General</span>
              <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Director Showcase</h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-1">Datos, cargos y cifras clave de la dirección de obra.</p>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Nombre del Director</label>
                  <input type="text" [(ngModel)]="formConfig.director_name"
                         placeholder="Ej: JUAN MORENO"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Cargo / Título</label>
                  <input type="text" [(ngModel)]="formConfig.director_role"
                         placeholder="Ej: INGENIERO CIVIL"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Etiqueta Superior</label>
                <input type="text" [(ngModel)]="formConfig.director_tagline"
                       placeholder="Ej: LIDERAZGO & RIGOR TÉCNICO"
                       class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Titular de Excelencia</label>
                <input type="text" [(ngModel)]="formConfig.director_title"
                       placeholder="Ej: Ingeniería de Excelencia sin Concesiones"
                       class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
              </div>

              <div class="grid grid-cols-2 gap-5 pt-2">
                <div>
                  <label class="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Métrica 1 (Cifra)</label>
                  <input type="text" [(ngModel)]="formConfig.director_stat1_number" placeholder="7+"
                         class="w-full px-4 py-3 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-lg font-bold outline-none">
                  <input type="text" [(ngModel)]="formConfig.director_stat1_label" placeholder="AÑOS DE EXPERIENCIA"
                         class="w-full px-4 py-2 mt-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-mono font-bold uppercase outline-none">
                </div>
                <div>
                  <label class="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Métrica 2 (Cifra)</label>
                  <input type="text" [(ngModel)]="formConfig.director_stat2_number" placeholder="4+"
                         class="w-full px-4 py-3 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-lg font-bold outline-none">
                  <input type="text" [(ngModel)]="formConfig.director_stat2_label" placeholder="OBRAS EJECUTADAS"
                         class="w-full px-4 py-2 mt-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-mono font-bold uppercase outline-none">
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- SEGUNDA FILA: CASA M & NUESTRA MISIÓN -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <!-- Bloque Casa M (Banner Video de Home) -->
          <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div class="pb-4 border-b border-neutral-200">
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Banner Video</span>
              <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Obra Emblemática (Casa M)</h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-1">Titular y descripción de la sección de video cinemático en el Home.</p>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Prefijo del Título</label>
                  <input type="text" [(ngModel)]="formConfig.casam_title"
                         placeholder="Ej: CASA"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
                <div>
                  <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Letra / Palabra Resaltada</label>
                  <input type="text" [(ngModel)]="formConfig.casam_highlight"
                         placeholder="Ej: M"
                         class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
                </div>
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Descripción de la Obra</label>
                <textarea [(ngModel)]="formConfig.casam_subtitle" rows="3"
                          placeholder="Residencia contemporánea donde la arquitectura de autor..."
                          class="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"></textarea>
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Texto del Botón</label>
                <input type="text" [(ngModel)]="formConfig.casam_btn"
                       placeholder="Ej: VER PROYECTO"
                       class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Bloque Nuestra Misión -->
          <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
            <div class="pb-4 border-b border-neutral-200">
              <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Filosofía & Propósito</span>
              <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Nuestra Misión</h3>
              <p class="font-sans text-base text-neutral-600 font-normal mt-1">Manifiesto editorial sobre arquitectura y visión de Sysmicon.</p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Título de la Sección</label>
                <input type="text" [(ngModel)]="formConfig.mision_title"
                       placeholder="Ej: Nuestra Misión"
                       class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
              </div>

              <div>
                <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Manifiesto / Descripción</label>
                <textarea [(ngModel)]="formConfig.mision_desc" rows="5"
                          placeholder="Desarrollar proyectos a través de los conocimientos multidisciplinares..."
                          class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Bloque Pasos de Contacto (Steps Home) -->
        <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-12 shadow-md space-y-8">
          <div class="pb-4 border-b border-neutral-200">
            <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Sección de Asesoría</span>
            <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Pasos de Contacto (Home)</h3>
            <p class="font-sans text-base text-neutral-600 font-normal mt-1">El proceso de 3 pasos que guía al cliente antes del formulario.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Pregunta Titular</label>
              <input type="text" [(ngModel)]="formConfig.steps_title"
                     placeholder="Ej: ¿Tienes un terreno o un sueño en mente?"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>

            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Subtítulo de Asesoría</label>
              <textarea [(ngModel)]="formConfig.steps_subtitle" rows="3"
                        placeholder="Nuestros arquitectos e ingenieros están listos para asesorarte..."
                        class="w-full px-5 py-3.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
            <!-- Paso 01 -->
            <div class="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 01</span>
              </div>
              <input type="text" [(ngModel)]="formConfig.step1_title" placeholder="Habla con un Experto"
                     class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none">
              <textarea [(ngModel)]="formConfig.step1_desc" rows="3" placeholder="Te conectamos con un profesional..."
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"></textarea>
            </div>

            <!-- Paso 02 -->
            <div class="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 02</span>
              </div>
              <input type="text" [(ngModel)]="formConfig.step2_title" placeholder="Obtén Claridad"
                     class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none">
              <textarea [(ngModel)]="formConfig.step2_desc" rows="3" placeholder="Definimos lo que realmente necesitas..."
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"></textarea>
            </div>

            <!-- Paso 03 -->
            <div class="bg-neutral-50 p-5 rounded-2xl border-2 border-neutral-300 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-black text-white">Paso 03</span>
              </div>
              <input type="text" [(ngModel)]="formConfig.step3_title" placeholder="Avanza con Seguridad"
                     class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-serif text-base font-bold outline-none">
              <textarea [(ngModel)]="formConfig.step3_desc" rows="3" placeholder="Encontramos lo que encaja..."
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-sm font-medium outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 3: COTIZADOR                                           -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'cotizador'" class="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in mt-10">
        
        <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
          <div class="pb-4 border-b border-neutral-200">
            <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Mensaje de Invitación</span>
            <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Página de Cotización</h3>
            <p class="font-sans text-base text-neutral-600 font-normal mt-1">Ajusta el titular y el mensaje de apertura de /cotiza-con-nosotros.</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Título Principal</label>
              <input type="text" [(ngModel)]="formConfig.cotiza_title"
                     placeholder="Ej: HABLEMOS DE TU PRÓXIMO PROYECTO"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 font-serif text-xl font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Subtítulo / Mensaje de Invitación</label>
              <textarea [(ngModel)]="formConfig.cotiza_subtitle" rows="4"
                        placeholder="Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible..."
                        class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        <div class="bg-neutral-50 border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden shadow-inner">
          <div class="relative z-10 p-8 sm:p-10 rounded-3xl bg-black text-white shadow-2xl space-y-5 border border-white/10">
            <span class="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Vista Previa en Vivo (/cotiza-con-nosotros)
            </span>
            <h4 class="font-serif text-3xl sm:text-4xl font-light text-white leading-tight uppercase">
              {{ formConfig.cotiza_title }}
            </h4>
            <p class="text-base sm:text-lg text-neutral-300 font-light leading-relaxed pt-2 border-t border-white/15">
              {{ formConfig.cotiza_subtitle }}
            </p>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- PESTAÑA 4: CANALES Y ALERTA                                    -->
      <!-- ============================================================== -->
      <div *ngIf="tabActiva() === 'contacto'" class="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in mt-10">
        
        <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7">
          <div class="pb-4 border-b border-neutral-200">
            <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Información Pública</span>
            <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Canales de Contacto</h3>
            <p class="font-sans text-base text-neutral-600 font-normal mt-1">Datos que se muestran en el pie de página, botones de WhatsApp y llamadas.</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Teléfono Visible</label>
              <input type="text" [(ngModel)]="formConfig.telefono_contacto"
                     placeholder="Ej: +57 (310) 845-9210"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">WhatsApp Directo (Solo Números con código de país)</label>
              <input type="text" [(ngModel)]="formConfig.whatsapp_contacto"
                     placeholder="Ej: 573108459210"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Correo Electrónico</label>
              <input type="email" [(ngModel)]="formConfig.email_soporte"
                     placeholder="Ej: contacto@sysmicon.com"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Dirección / Ubicación de Oficina</label>
              <input type="text" [(ngModel)]="formConfig.direccion_oficina"
                     placeholder="Ej: Calle 10A # 36-44, Piso 5, Medellín, Colombia"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Instagram (Usuario)</label>
              <input type="text" [(ngModel)]="formConfig.instagram_handle"
                     placeholder="Ej: @sysmicon"
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-300 text-neutral-950 font-mono text-base font-bold placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
          </div>
        </div>

        <div class="bg-white border-2 border-neutral-300 rounded-3xl p-8 lg:p-10 shadow-md space-y-7 self-start">
          <div class="pb-4 border-b border-neutral-200">
            <span class="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">Comunicado Global</span>
            <h3 class="font-serif text-3xl font-black text-neutral-950 uppercase tracking-tight mt-1">Banner Superior de Anuncios</h3>
            <p class="font-sans text-base text-neutral-600 font-normal mt-1">Activa una barra superior visible en todo el sitio para noticias o avisos.</p>
          </div>

          <div class="bg-neutral-50 rounded-2xl p-6 border-2 border-neutral-300 flex items-center gap-4">
            <input type="checkbox" [(ngModel)]="mostrarBannerAlertaBool" id="chkBannerGlobal"
                   class="w-6 h-6 rounded border-2 border-neutral-400 text-black focus:ring-black cursor-pointer accent-black">
            <label for="chkBannerGlobal" class="text-neutral-950 font-bold text-base cursor-pointer block select-none">
              Activar Barra Global de Anuncios
            </label>
          </div>

          <div *ngIf="mostrarBannerAlertaBool" class="animate-fade-in space-y-5">
            <div>
              <label class="block font-sans text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Mensaje del Banner</label>
              <input type="text" [(ngModel)]="formConfig.texto_banner_alerta"
                     placeholder="Escribe el anuncio o comunicado..."
                     class="w-full px-5 py-4 rounded-xl bg-white border-2 border-neutral-400 text-neutral-950 text-base font-medium placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all">
            </div>
            
            <div class="p-5 rounded-2xl bg-neutral-950 text-white text-base font-sans flex items-center gap-3 shadow-lg">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span class="font-medium">{{ formConfig.texto_banner_alerta || 'Escribe un mensaje para previsualizar...' }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================== -->
      <!-- MODAL ELEGANTE DE CONFIRMACIÓN PARA ELIMINAR PROYECTO          -->
      <!-- ============================================================== -->
      <div *ngIf="proyectoAEliminar() as p" 
           class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        
        <!-- Backdrop oscuro con desenfoque de cristal -->
        <div (click)="cerrarModalEliminar()"
             class="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"></div>

        <!-- Tarjeta del Modal -->
        <div class="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-neutral-300 shadow-2xl overflow-hidden animate-scale-up">
          
          <!-- Encabezado / Alerta Visual -->
          <div class="p-6 sm:p-8 border-b border-neutral-200 bg-neutral-50 flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </div>
            <div>
              <span class="text-xs font-mono font-bold tracking-widest text-red-600 uppercase block mb-1">
                Acción Irreversible
              </span>
              <h3 class="font-serif text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                ¿Eliminar esta Obra?
              </h3>
            </div>
          </div>

          <!-- Cuerpo: Información de la Obra que se va a borrar -->
          <div class="p-6 sm:p-8 space-y-6">
            
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100 border border-neutral-200">
              <img [src]="p.imagenUrl" [alt]="p.titulo" 
                   class="w-20 h-20 rounded-xl object-cover border border-neutral-300 shadow-sm shrink-0">
              <div class="min-w-0 flex-1">
                <span class="px-2.5 py-0.5 rounded bg-white text-neutral-900 font-mono text-[10px] font-bold uppercase tracking-wider border border-neutral-200">
                  {{ p.categoria }}
                </span>
                <h4 class="font-serif text-lg font-bold text-neutral-950 truncate mt-1">
                  {{ p.titulo }}
                </h4>
                <p class="font-sans text-xs text-neutral-500 truncate mt-0.5">
                  {{ p.ubicacion }} &bull; {{ (p.imagenesAdicionales?.length || 0) + 1 }} Fotos en catálogo
                </p>
              </div>
            </div>

            <p class="font-sans text-sm text-neutral-600 leading-relaxed">
              Esta acción eliminará permanentemente la obra del portafolio del sitio web, incluyendo su fotografía de portada, memoria descriptiva y todas las fotografías de la galería.
            </p>

          </div>

          <!-- Pie del Modal: Botones de Acción -->
          <div class="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            
            <button type="button" (click)="cerrarModalEliminar()" [disabled]="eliminando()"
                    class="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 font-sans text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50">
              Cancelar
            </button>

            <button type="button" (click)="confirmarEliminar()" [disabled]="eliminando()"
                    class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-sans text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              <span *ngIf="!eliminando()" class="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Sí, Eliminar Obra
              </span>
              <span *ngIf="eliminando()" class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Eliminando...
              </span>
            </button>

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

  // Foto de Portada Principal
  archivoPortada: File | null = null;
  readonly portadaPreview = signal<string | null>(null);

  // Galería Adicional (Hasta 30 fotos)
  readonly galeriaImagenes = signal<GaleriaItem[]>([]);

  // Estado del Modal de Eliminación de Proyecto
  readonly proyectoAEliminar = signal<Proyecto | null>(null);
  readonly eliminando = signal<boolean>(false);

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
    area: 520,
    anio: 2026,
    destacado: true,
    caracteristicasStr: 'Estructura en concreto a la vista, Patio interior central, Iluminación indirecta, Ventanería con control solar',
    editorial_slogan: 'ARQUITECTURA DE ALTA PRECISIÓN Y PAISAJISMO.',
    editorial_style: 'coral-title',
    barcode: '0 600229402 1'
  };

  ngOnInit(): void {
    this.formConfig = { ...DEFAULT_SITE_CONFIG, ...this.cmsService.config() };
    this.cmsService.fetchConfig().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.formConfig = { ...DEFAULT_SITE_CONFIG, ...res.data };
        }
      }
    });
  }

  // Selección de Foto de Portada
  onArchivoPortadaSeleccionado(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.archivoPortada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.portadaPreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  quitarPortada(): void {
    this.archivoPortada = null;
    this.portadaPreview.set(null);
  }

  // Selección de Múltiples Fotos para Galería (Hasta 30)
  onImagenesGaleriaSeleccionadas(event: any): void {
    const fileList: FileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const actual = this.galeriaImagenes();
    const espacioDisponible = 30 - actual.length;

    if (espacioDisponible <= 0) {
      this.mostrarMensaje('Ya has alcanzado el límite máximo de 30 fotos para la galería.', 'error');
      return;
    }

    const archivosAceptados = Array.from(fileList).slice(0, espacioDisponible);

    if (fileList.length > espacioDisponible) {
      this.mostrarMensaje(`Se seleccionaron solo las primeras ${espacioDisponible} fotos para no superar el límite de 30.`, 'error');
    }

    archivosAceptados.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galeriaImagenes.update(items => [
          ...items,
          { file, previewUrl: e.target.result }
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Resetear valor para permitir volver a seleccionar si se desea
    event.target.value = '';
  }

  eliminarFotoGaleria(index: number): void {
    this.galeriaImagenes.update(items => items.filter((_, i) => i !== index));
  }

  limpiarGaleria(): void {
    this.galeriaImagenes.set([]);
  }

  onCrearProyecto(event: Event): void {
    event.preventDefault();
    if (!this.nuevoProyecto.titulo || !this.archivoPortada) {
      this.mostrarMensaje('Por favor ingresa el nombre de la obra y sube la fotografía de portada.', 'error');
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
    formData.append('editorial_title', this.nuevoProyecto.titulo);
    formData.append('editorial_subtitle', this.nuevoProyecto.subtitulo);
    formData.append('editorial_slogan', this.nuevoProyecto.editorial_slogan);
    formData.append('editorial_style', this.nuevoProyecto.editorial_style);
    formData.append('barcode', this.nuevoProyecto.barcode);

    // Foto de Portada Principal
    formData.append('imagen', this.archivoPortada);

    // Galería Adicional (Hasta 30 fotos)
    const galeria = this.galeriaImagenes();
    for (const item of galeria) {
      formData.append('imagenes_adicionales[]', item.file);
    }

    // Características técnicas como JSON
    const caracteristicas = this.nuevoProyecto.caracteristicasStr
      .split(',')
      .map(s => s.trim())
      .filter(s => !!s);
    formData.append('caracteristicas', JSON.stringify(caracteristicas));

    this.proyectosService.crearProyectoApi(formData).subscribe({
      next: () => {
        this.subiendoProyecto.set(false);
        const totalFotos = 1 + galeria.length;
        this.mostrarMensaje(`¡Obra «${this.nuevoProyecto.titulo}» publicada exitosamente con ${totalFotos} fotografías en el portafolio!`, 'exito');
        
        // Limpiar formulario
        this.nuevoProyecto.titulo = '';
        this.nuevoProyecto.subtitulo = '';
        this.nuevoProyecto.descripcion = '';
        this.archivoPortada = null;
        this.portadaPreview.set(null);
        this.galeriaImagenes.set([]);
      },
      error: (err) => {
        this.subiendoProyecto.set(false);
        const errDesc = err?.error?.message || 'Error al conectar con el backend o Cloudinary.';
        this.mostrarMensaje(errDesc, 'error');
      }
    });
  }

  abrirModalEliminar(p: Proyecto): void {
    this.proyectoAEliminar.set(p);
  }

  cerrarModalEliminar(): void {
    if (!this.eliminando()) {
      this.proyectoAEliminar.set(null);
    }
  }

  confirmarEliminar(): void {
    const p = this.proyectoAEliminar();
    if (!p) return;

    this.eliminando.set(true);
    this.proyectosService.eliminarProyectoApi(p.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.proyectoAEliminar.set(null);
        this.mostrarMensaje(`La obra «${p.titulo}» ha sido eliminada del catálogo.`, 'exito');
      },
      error: (err) => {
        this.eliminando.set(false);
        const desc = err?.error?.message || 'Error al eliminar el proyecto en la base de datos.';
        this.mostrarMensaje(desc, 'error');
      }
    });
  }

  guardarConfiguracion(): void {
    this.guardando.set(true);
    this.mensajeAlerta.set('');

    this.cmsService.saveConfig(this.formConfig).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarMensaje('¡Configuración guardada exitosamente!', 'exito');
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
    }, 7000);
  }
}
