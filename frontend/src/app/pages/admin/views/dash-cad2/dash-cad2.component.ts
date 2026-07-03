import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, BloqueAdmin } from '../../../../services/admin.service';

interface CategoriaResumen {
  id: string;
  nombre: string;
  iconoSvg: string;
  totalBloques: number;
  activos: number;
  imagenMuestra: string;
}

@Component({
  selector: 'app-dash-cad2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade">
      
      <!-- Encabezado y botón para añadir (Estilo de precisión CAD) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-block px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-[9px] uppercase tracking-wider border border-white/10">Studio CAD 2 Pro</span>
            <span class="text-xs text-gray-500">|</span>
            <span class="text-xs text-gray-400 font-mono font-bold">{{ adminService.bloquesCAD().length }} Bloques en catálogo</span>
          </div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Gestión Arquitectónica CAD 2D</h2>
          <p class="text-xs text-gray-400 mt-1 font-sans">Administra imágenes PNG, asigna precios referenciales en USD y filtra por las 8 categorías del sistema.</p>
        </div>
        <button (click)="abrirModalNuevo()" 
                class="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white hover:bg-gray-200 text-black border border-white font-extrabold text-xs transition-all shadow-xl cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>+ Añadir Nuevo Bloque PNG</span>
        </button>
      </div>

      <!-- SECCIÓN 1: CATEGORÍAS AGREGADAS ACTUALMENTE -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-serif text-base font-extrabold text-white">Categorías Agregadas en Catálogo</h3>
            <p class="text-[11px] text-gray-400 font-sans">Haz clic en cualquier tarjeta para filtrar la tabla por esa categoría arquitectónica</p>
          </div>
          <button *ngIf="filtroCategoria() !== 'todos'" (click)="filtroCategoria.set('todos')" 
                  class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer">
            <span>✕ Mostrar todas las categorías</span>
          </button>
        </div>

        <!-- Grid de las 8 categorías -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <button type="button" *ngFor="let cat of listaCategorias()"
                  (click)="toggleFiltro(cat.id)"
                  [ngClass]="filtroCategoria() === cat.id ? 'border-white bg-white/15 scale-[1.03] shadow-lg ring-1 ring-white' : 'border-white/10 bg-[#030303] hover:border-white/30 hover:bg-[#0B0B0B]'"
                  class="p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer group relative overflow-hidden">
            
            <!-- Indicador de cantidad en esquina -->
            <span [ngClass]="cat.totalBloques > 0 ? 'bg-white/10 text-white border-white/20 font-bold' : 'bg-white/5 text-gray-500 border-white/5'"
                  class="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded border font-mono">
              {{ cat.totalBloques }}
            </span>

            <!-- Contenedor Imagen Muestra -->
            <div class="w-10 h-10 rounded-lg bg-[#080808] p-1 border border-white/5 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
              <img [src]="cat.imagenMuestra" [alt]="cat.nombre" class="w-full h-full object-contain filter drop-shadow">
            </div>

            <!-- Nombre de categoría -->
            <div class="w-full font-sans">
              <span class="text-xs font-bold text-white block truncate group-hover:text-gray-300 transition-colors">{{ cat.nombre }}</span>
              <span class="text-[10px]" [ngClass]="cat.activos > 0 ? 'text-gray-300 font-mono' : 'text-gray-500'">
                {{ cat.activos > 0 ? cat.activos + ' activos' : 'Sin agregar' }}
              </span>
            </div>

          </button>
        </div>
      </div>

      <!-- SECCIÓN 2: BARRA DE FILTRADO RÁPIDO Y RESULTADOS -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Filtrar:</span>
          
          <button (click)="filtroCategoria.set('todos')"
                  [ngClass]="filtroCategoria() === 'todos' ? 'bg-white text-black font-extrabold shadow-md border border-white' : 'bg-[#0D0D0D] text-gray-300 hover:bg-white/10 font-bold'"
                  class="px-3.5 py-1.5 rounded-xl text-xs transition-all shrink-0 cursor-pointer">
            Todas ({{ adminService.bloquesCAD().length }})
          </button>

          <button *ngFor="let cat of listaCategorias()" 
                  (click)="filtroCategoria.set(cat.id)"
                  [ngClass]="filtroCategoria() === cat.id ? 'bg-white text-black font-extrabold shadow-md border border-white' : 'bg-[#0D0D0D] text-gray-300 hover:bg-white/10 font-bold'"
                  class="px-3.5 py-1.5 rounded-xl text-xs transition-all shrink-0 cursor-pointer inline-flex items-center gap-1.5">
            <span>{{ cat.nombre }}</span>
            <span class="opacity-80 font-mono">({{ cat.totalBloques }})</span>
          </button>
        </div>

        <div class="text-xs text-gray-400 font-mono shrink-0">
          Mostrando <strong class="text-white">{{ bloquesFiltrados().length }}</strong> de {{ adminService.bloquesCAD().length }} bloques
        </div>
      </div>

      <!-- Tabla de Bloques CAD Filtrada (Diseño plano arquitectónico) -->
      <div class="relative bg-[#030303] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <!-- Trazos esquineros de plano -->
        <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
        <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>
        
        <div *ngIf="bloquesFiltrados().length === 0" class="p-12 text-center text-gray-400">
          <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-gray-500">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p class="font-serif text-base font-bold text-white mb-1">No hay bloques agregados en esta categoría</p>
          <p class="text-xs mb-4 font-sans">Haz clic en el botón superior para agregar tu primera imagen PNG en esta sección.</p>
          <button (click)="abrirModalNuevoConCategoria()" class="px-4 py-2 rounded-xl bg-white hover:bg-gray-200 text-black border border-white font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer">
            <span>+ Agregar Bloque en Categoría</span>
          </button>
        </div>

        <div *ngIf="bloquesFiltrados().length > 0" class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 bg-[#0C0C0C] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="py-4 px-5">Bloque & Imagen PNG</th>
                <th class="py-4 px-4">Categoría</th>
                <th class="py-4 px-4">Área m²</th>
                <th class="py-4 px-4">Precio USD ($ / m²)</th>
                <th class="py-4 px-4">Estado en Simulador</th>
                <th class="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-xs font-sans">
              <tr *ngFor="let b of bloquesFiltrados()" class="hover:bg-[#0D0D0D] transition-colors group">
                
                <!-- Col 1: Nombre e Imagen -->
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3.5">
                    <div class="w-14 h-14 rounded-lg bg-[#080808] p-2 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-white/50 transition-colors">
                      <img [src]="b.imagen" [alt]="b.nombre" class="w-full h-full object-contain filter drop-shadow">
                      <span class="absolute bottom-0 right-0 bg-black/80 text-[8px] text-gray-400 px-1 font-mono uppercase">png</span>
                    </div>
                    <div>
                      <span class="font-bold text-white text-sm block group-hover:text-gray-300 transition-colors">{{ b.nombre }}</span>
                      <span class="text-[11px] text-gray-500 block mt-0.5 font-mono">ID: {{ b.id }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Categoría -->
                <td class="py-3.5 px-4 font-mono">
                  <span class="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/5 text-gray-300 text-[10px] uppercase font-bold tracking-wider">
                    {{ getNombreCategoria(b.categoria) }}
                  </span>
                </td>

                <!-- Col 3: Área m2 -->
                <td class="py-3.5 px-4 font-mono font-bold text-gray-200">
                  <span class="bg-[#1C1C1C] px-2.5 py-1 rounded border border-white/5 text-xs">{{ b.areaM2 }} m²</span>
                </td>

                <!-- Col 4: Precio USD -->
                <td class="py-3.5 px-4">
                  <div class="space-y-0.5">
                    <div class="flex items-baseline gap-1.5">
                      <span class="font-mono font-bold text-white text-lg">$</span>
                      <span class="font-serif font-extrabold text-white text-2xl tracking-tight">{{ b.precioUSD | number:'1.0-0' }}</span>
                      <span class="text-[10px] font-mono font-extrabold text-black bg-white px-1.5 py-0.5 rounded shadow ml-1">USD</span>
                    </div>
                    <span class="text-[11px] text-gray-500 font-mono block">~${{ (b.precioUSD / b.areaM2) | number:'1.0-0' }} / m²</span>
                  </div>
                </td>

                <!-- Col 5: Estado -->
                <td class="py-3.5 px-4">
                  <button (click)="adminService.toggleActivoBloque(b.id)"
                          [ngClass]="b.activo ? 'bg-white/10 text-white border-white/20' : 'bg-red-950/40 text-red-300 border-red-800/40'"
                          class="px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="b.activo ? 'bg-white' : 'bg-red-400'"></span>
                    <span>{{ b.activo ? 'Activo en Nube' : 'Oculto / Inactivo' }}</span>
                  </button>
                </td>

                <!-- Col 6: Acciones -->
                <td class="py-3.5 px-5 text-right space-x-2">
                  <button (click)="abrirModalEditar(b)" title="Editar Imagen / Precio / Área" 
                          class="px-3 py-2 rounded-xl bg-[#1C1C1C] border border-white/10 text-white font-bold text-[10px] hover:bg-white hover:text-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    <span>Editar</span>
                  </button>
                  <button (click)="adminService.eliminarBloque(b.id)" title="Eliminar Bloque" 
                          class="p-2 rounded-xl border border-red-800/40 bg-red-950/20 text-red-400 text-xs transition-all cursor-pointer inline-flex items-center justify-center hover:bg-red-900/60">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL AÑADIR / EDITAR BLOQUE CAD CON PREVIEW Y SUBIDA PNG -->
      <div *ngIf="modalAbierto()" class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade">
        <div class="relative bg-[#030303] border border-white/10 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
          
          <!-- Trazos esquineros de plano -->
          <div class="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-white/20 pointer-events-none"></div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-white/20 pointer-events-none"></div>

          <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span class="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-500 block mb-0.5">Gestor de Catálogo Studio CAD</span>
              <h3 class="font-serif text-xl font-extrabold text-white">{{ esEdicion() ? 'Editar Bloque y Precio USD' : 'Crear Nuevo Bloque PNG 2D' }}</h3>
            </div>
            <button (click)="cerrarModal()" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 font-bold transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <form (ngSubmit)="guardarBloque()" class="space-y-6 text-xs font-sans">
            
            <!-- 1. Nombre y Categoría -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Nombre Arquitectónico *</label>
                <input type="text" [(ngModel)]="formNombre" name="nombre" required placeholder="ej. Master Suite & Vestier" 
                       class="w-full px-3.5 py-3 rounded-lg bg-[#090909] border border-white/10 text-white font-bold focus:border-white focus:outline-none">
              </div>
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Categoría Arquitectónica *</label>
                <select [(ngModel)]="formCategoria" name="categoria" (change)="onCategoriaChange()"
                        class="w-full px-3.5 py-3 rounded-lg bg-[#090909] border border-white/10 text-white font-bold focus:border-white focus:outline-none">
                  <option value="alcobas">Alcobas Suite</option>
                  <option value="cocina">Cocina Integral</option>
                  <option value="area-comun">Área Común / Sala</option>
                  <option value="piscina">Piscina & Solárium</option>
                  <option value="estacionamiento">Estacionamiento / Garaje</option>
                  <option value="muro">Muros & Divisiones</option>
                  <option value="columnas">Columnas & Estructura</option>
                  <option value="bano">Baños & Spa</option>
                </select>
              </div>
            </div>

            <!-- 2. Precio USD y Área m2 -->
            <div class="p-4 rounded-lg bg-[#090909] border border-white/10 space-y-4">
              <span class="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider block">Configuración Constructiva & Precio USD</span>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Precio Referencial ($ USD) *</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white font-bold text-sm">$</span>
                    <input type="number" [(ngModel)]="formPrecio" name="precio" required min="1000" step="500" 
                           class="w-full pl-8 pr-3 py-3 rounded-lg bg-[#030303] border border-white/10 text-white font-serif font-extrabold text-base focus:border-white focus:outline-none">
                  </div>
                  <!-- Botones rápidos de precio -->
                  <div class="flex items-center gap-1.5 mt-2 font-mono">
                    <button type="button" (click)="adjustPrecio(-5000)" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold">- $5k</button>
                    <button type="button" (click)="adjustPrecio(5000)" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold">+ $5k</button>
                    <button type="button" (click)="formPrecio = 35000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$35k</button>
                    <button type="button" (click)="formPrecio = 65000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$65k</button>
                    <button type="button" (click)="formPrecio = 90000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$90k</button>
                  </div>
                </div>

                <div>
                  <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Área Constructiva (m²) *</label>
                  <div class="relative font-mono">
                    <input type="number" [(ngModel)]="formArea" name="area" required min="5" max="500" 
                           class="w-full pl-3.5 pr-8 py-3 rounded-lg bg-[#030303] border border-white/10 text-white font-bold text-sm focus:border-white focus:outline-none">
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">m²</span>
                  </div>
                  <span class="text-[11px] text-gray-400 font-mono block mt-2">Costo estimado: <strong>\${{ (formPrecio / (formArea || 1)) | number:'1.0-0' }} / m²</strong></span>
                </div>
              </div>
            </div>

            <!-- 3. GESTIÓN DE IMAGEN PNG (Subida Archivo & Galería) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-gray-300 font-bold uppercase tracking-wider text-[11px]">Imagen CAD (.PNG Transparente) *</label>
                <span class="text-[10px] text-gray-500 font-bold">Soporta subida desde PC o galería de activos</span>
              </div>

              <!-- Selector 1: Subir archivo PNG desde el equipo -->
              <div class="p-4 rounded-lg bg-[#090909] border-2 border-dashed border-white/20 hover:border-white/50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3 font-sans">
                  <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <div>
                    <span class="text-white font-bold text-xs block">Subir nueva imagen PNG desde tu PC</span>
                    <span class="text-[11px] text-gray-400">El archivo se convertirá en formato transparente de alta resolución</span>
                  </div>
                </div>
                <label class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors shrink-0 inline-flex items-center gap-2">
                  <span>Seleccionar archivo .PNG</span>
                  <input type="file" accept=".png,image/png" (change)="onFileSelected($event)" class="hidden">
                </label>
              </div>

              <!-- Selector 2: Galería de pre-cargados según la categoría -->
              <div class="space-y-2">
                <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">O elige un modelo predeterminado en categoría "{{ getNombreCategoria(formCategoria) }}":</span>
                <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <button type="button" *ngFor="let preset of getPresetImages()" 
                          (click)="formImagen = preset.path"
                          [ngClass]="formImagen === preset.path ? 'border-white bg-white/15 scale-105' : 'border-white/10 bg-[#0C0C0C] hover:border-white/30'"
                          class="p-2 rounded-lg border flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer w-24">
                    <div class="w-12 h-12 rounded bg-[#080808] p-1 flex items-center justify-center">
                      <img [src]="preset.path" [alt]="preset.label" class="w-full h-full object-contain">
                    </div>
                    <span class="text-[10px] text-gray-300 font-bold truncate w-full text-center">{{ preset.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Vista Previa de la Imagen Seleccionada -->
              <div class="p-3 rounded-lg bg-[#090909] border border-white/10 flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg bg-[#030303] border border-white/10 p-2 flex items-center justify-center shrink-0">
                  <img [src]="formImagen" alt="Preview" class="w-full h-full object-contain filter drop-shadow-md">
                </div>
                <div class="overflow-hidden">
                  <span class="text-[10px] uppercase font-bold text-white block mb-0.5 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span> Imagen PNG Lista para Simulador CAD
                  </span>
                  <p class="text-xs text-gray-300 truncate font-mono">{{ formImagen.length > 50 ? formImagen.slice(0, 45) + '...' : formImagen }}</p>
                </div>
              </div>

            </div>

            <!-- Botones de Acción -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="cerrarModal()" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors cursor-pointer">Cancelar</button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black font-extrabold transition-all shadow-xl cursor-pointer inline-flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>{{ esEdicion() ? 'Guardar Cambios USD' : 'Publicar Bloque en Catálogo' }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  `
})
export class DashCad2Component {
  readonly adminService = inject(AdminService);

  readonly modalAbierto = signal<boolean>(false);
  readonly esEdicion = signal<boolean>(false);
  readonly filtroCategoria = signal<string>('todos');
  private idEnEdicion = '';

  formNombre = '';
  formCategoria: BloqueAdmin['categoria'] = 'alcobas';
  formArea = 35;
  formPrecio = 55000;
  formImagen = 'assets/images/arquitectura/alcobas/alcoba-principal.png';

  // Nombres descriptivos de las 8 categorías
  readonly nombresCategoriasMap: Record<string, string> = {
    alcobas: 'Alcobas Suite',
    cocina: 'Cocinas Gourmet',
    'area-comun': 'Áreas Comunes / Salas',
    piscina: 'Piscinas & Solárium',
    estacionamiento: 'Estacionamientos',
    muro: 'Muros & Divisiones',
    columnas: 'Columnas & Estructuras',
    bano: 'Baños & Spa'
  };

  // Opciones predeterminadas con TODAS las imágenes de la carpeta assets/images/arquitectura/
  readonly presetsMap: Record<string, Array<{ label: string; path: string }>> = {
    alcobas: [
      { label: 'Master Principal', path: 'assets/images/arquitectura/alcobas/alcoba-principal.png' },
      { label: 'Suite Doble', path: 'assets/images/arquitectura/alcobas/alcoba2.png' },
      { label: 'Alcoba 3', path: 'assets/images/arquitectura/alcobas/alcoba3.png' },
      { label: 'Alcoba 4', path: 'assets/images/arquitectura/alcobas/alcoba4.png' }
    ],
    cocina: [
      { label: 'Cocina Isla', path: 'assets/images/arquitectura/cocina/cocina1.png' }
    ],
    'area-comun': [
      { label: 'Sala Altura 1', path: 'assets/images/arquitectura/area-comun/comun1.png' },
      { label: 'Sala Altura 2', path: 'assets/images/arquitectura/area-comun/comun2.png' },
      { label: 'Sala Altura 3', path: 'assets/images/arquitectura/area-comun/comun3.png' }
    ],
    piscina: [
      { label: 'Piscina Infinity', path: 'assets/images/arquitectura/piscina/piscina.png' },
      { label: 'Jacuzzi Spa', path: 'assets/images/arquitectura/piscina/jacuzzi.png' }
    ],
    estacionamiento: [
      { label: 'Garaje Doble', path: 'assets/images/arquitectura/estacionamiento/congarage.png' },
      { label: 'Parqueadero Abierto', path: 'assets/images/arquitectura/estacionamiento/singarage.png' }
    ],
    muro: [
      { label: 'Muro Contención', path: 'assets/images/arquitectura/muro/muro-contencion.png' },
      { label: 'Muro Largo', path: 'assets/images/arquitectura/muro/muro-largo.png' },
      { label: 'Muro Estándar', path: 'assets/images/arquitectura/muro/muro.png' }
    ],
    columnas: [
      { label: 'Columna Circular', path: 'assets/images/arquitectura/columnas/circular.png' },
      { label: 'Columna Cuadrada', path: 'assets/images/arquitectura/columnas/cuadrada.png' },
      { label: 'Columna Rectangular', path: 'assets/images/arquitectura/columnas/rectangular.png' }
    ],
    bano: [
      { label: 'Baño Jacuzzi', path: 'assets/images/arquitectura/bano/bano1.png' },
      { label: 'Baño Suite', path: 'assets/images/arquitectura/bano/bano2.png' }
    ]
  };

  // Lista de las 8 categorías del sistema
  readonly listaCategorias = computed<CategoriaResumen[]>(() => {
    const todos = this.adminService.bloquesCAD();
    const keys: Array<BloqueAdmin['categoria']> = ['alcobas', 'area-comun', 'bano', 'cocina', 'columnas', 'estacionamiento', 'muro', 'piscina'];
    
    return keys.map(id => {
      const bloquesCat = todos.filter(b => b.categoria === id);
      const activos = bloquesCat.filter(b => b.activo).length;
      const muestra = bloquesCat.length > 0 ? bloquesCat[0].imagen : (this.presetsMap[id]?.[0]?.path || '');
      return {
        id,
        nombre: this.nombresCategoriasMap[id] || id,
        iconoSvg: '',
        totalBloques: bloquesCat.length,
        activos,
        imagenMuestra: muestra
      };
    });
  });

  // Bloques filtrados según la categoría seleccionada
  readonly bloquesFiltrados = computed(() => {
    const f = this.filtroCategoria();
    const list = this.adminService.bloquesCAD();
    if (f === 'todos') return list;
    return list.filter(b => b.categoria === f);
  });

  getNombreCategoria(cat: string): string {
    return this.nombresCategoriasMap[cat] || cat;
  }

  getPresetImages(): Array<{ label: string; path: string }> {
    return this.presetsMap[this.formCategoria] || this.presetsMap['alcobas'];
  }

  onCategoriaChange(): void {
    const presets = this.getPresetImages();
    if (presets && presets.length > 0) {
      this.formImagen = presets[0].path;
    }
  }

  toggleFiltro(catId: string): void {
    if (this.filtroCategoria() === catId) {
      this.filtroCategoria.set('todos');
    } else {
      this.filtroCategoria.set(catId);
    }
  }

  adjustPrecio(delta: number): void {
    const nuevo = this.formPrecio + delta;
    if (nuevo >= 1000) {
      this.formPrecio = nuevo;
    }
  }

  // Carga local de archivo PNG desde PC
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formImagen = e.target.result; // Base64 DataURL
      };
      reader.readAsDataURL(file);
    }
  }

  abrirModalNuevo(): void {
    this.esEdicion.set(false);
    this.idEnEdicion = '';
    this.formNombre = '';
    this.formCategoria = (this.filtroCategoria() !== 'todos' ? this.filtroCategoria() as any : 'alcobas');
    this.formArea = 35;
    this.formPrecio = 55000;
    this.onCategoriaChange();
    this.modalAbierto.set(true);
  }

  abrirModalNuevoConCategoria(): void {
    this.abrirModalNuevo();
  }

  abrirModalEditar(bloque: BloqueAdmin): void {
    this.esEdicion.set(true);
    this.idEnEdicion = bloque.id;
    this.formNombre = bloque.nombre;
    this.formCategoria = bloque.categoria;
    this.formArea = bloque.areaM2;
    this.formPrecio = bloque.precioUSD;
    this.formImagen = bloque.imagen;
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardarBloque(): void {
    if (!this.formNombre.trim()) return;

    if (this.esEdicion() && this.idEnEdicion) {
      this.adminService.editarBloque(this.idEnEdicion, {
        nombre: this.formNombre,
        categoria: this.formCategoria,
        areaM2: this.formArea,
        precioUSD: this.formPrecio,
        imagen: this.formImagen
      });
    } else {
      this.adminService.agregarBloque({
        nombre: this.formNombre,
        categoria: this.formCategoria,
        areaM2: this.formArea,
        precioUSD: this.formPrecio,
        imagen: this.formImagen,
        activo: true
      });
    }

    this.cerrarModal();
  }
}
