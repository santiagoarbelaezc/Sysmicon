import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, BloqueAdmin } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-cad2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado y botón para añadir -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider">Studio CAD 2 Pro</span>
            <span class="text-xs text-gray-500">|</span>
            <span class="text-xs text-gray-400 font-bold">{{ adminService.bloquesCAD().length }} Bloques en catálogo</span>
          </div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Gestión Arquitectónica CAD 2D</h2>
          <p class="text-xs text-gray-400 mt-1">Administra imágenes PNG, asigna precios referenciales en USD y publica bloques en tiempo real.</p>
        </div>
        <button (click)="abrirModalNuevo()" 
                class="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-wood-accent to-wood-light hover:brightness-110 text-[#111] font-extrabold text-xs transition-all shadow-xl scale-100 hover:scale-105 cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>+ Añadir Nuevo Bloque PNG</span>
        </button>
      </div>

      <!-- Alerta Informativa & Guía PNG -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 p-4 rounded-xl bg-[#111111] border border-white/10 text-gray-300 text-xs flex items-center gap-3.5 shadow-md">
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-bold">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <strong class="text-white block mb-0.5">Gestión de Imágenes PNG con Transparencia</strong>
            <span class="text-gray-400">Puedes cargar tus propios archivos <code class="text-wood-light bg-black/40 px-1 py-0.5 rounded">.png</code> desde tu computadora o elegir desde la galería de cada categoría arquitectónica.</span>
          </div>
        </div>
        
        <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs flex items-center gap-3 shadow-md">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <strong class="text-white block mb-0.5">Control de Precios USD</strong>
            <span class="text-emerald-400/80">Los precios se actualizan y reflejan en cotizaciones al instante.</span>
          </div>
        </div>
      </div>

      <!-- Tabla de Bloques CAD -->
      <div class="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 bg-[#161616] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="py-4 px-5">Bloque & Imagen PNG</th>
                <th class="py-4 px-4">Categoría</th>
                <th class="py-4 px-4">Área m²</th>
                <th class="py-4 px-4">Precio USD ($ / m²)</th>
                <th class="py-4 px-4">Estado en Simulador</th>
                <th class="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-xs font-sans">
              <tr *ngFor="let b of adminService.bloquesCAD()" class="hover:bg-[#151515] transition-colors group">
                
                <!-- Col 1: Nombre e Imagen -->
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3.5">
                    <div class="w-14 h-14 rounded-xl bg-[#080808] p-2 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:border-wood-accent/50 transition-colors">
                      <img [src]="b.imagen" [alt]="b.nombre" class="w-full h-full object-contain filter drop-shadow">
                      <span class="absolute bottom-0 right-0 bg-black/80 text-[8px] text-gray-300 px-1 font-mono uppercase">png</span>
                    </div>
                    <div>
                      <span class="font-bold text-white text-sm block group-hover:text-wood-light transition-colors">{{ b.nombre }}</span>
                      <span class="text-[11px] text-gray-500 block mt-0.5 font-mono">ID: {{ b.id }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Categoría -->
                <td class="py-3.5 px-4">
                  <span class="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-300 text-[11px] uppercase font-bold tracking-wider">
                    {{ b.categoria }}
                  </span>
                </td>

                <!-- Col 3: Área m2 -->
                <td class="py-3.5 px-4 font-bold text-gray-200">
                  <span class="bg-[#1C1C1C] px-2.5 py-1 rounded-lg border border-white/5 text-sm">{{ b.areaM2 }} m²</span>
                </td>

                <!-- Col 4: Precio USD -->
                <td class="py-3.5 px-4">
                  <div class="font-serif font-extrabold text-emerald-400 text-base">
                    \${{ b.precioUSD | number:'1.0-0' }} <span class="text-xs font-sans font-bold text-gray-400">USD</span>
                  </div>
                  <span class="text-[10px] text-gray-500 font-mono block mt-0.5">~\${{ (b.precioUSD / b.areaM2) | number:'1.0-0' }} / m²</span>
                </td>

                <!-- Col 5: Estado -->
                <td class="py-3.5 px-4">
                  <button (click)="adminService.toggleActivoBloque(b.id)"
                          [ngClass]="b.activo ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' : 'bg-red-950/60 text-red-300 border-red-800/50'"
                          class="px-3 py-1.5 rounded-full border text-[11px] font-bold inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="b.activo ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
                    <span>{{ b.activo ? 'Activo en Nube' : 'Oculto / Inactivo' }}</span>
                  </button>
                </td>

                <!-- Col 6: Acciones -->
                <td class="py-3.5 px-5 text-right space-x-2">
                  <button (click)="abrirModalEditar(b)" title="Editar Imagen / Precio / Área" 
                          class="px-3 py-2 rounded-xl bg-[#222] hover:bg-wood-accent hover:text-[#111] text-gray-300 font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    <span>Editar</span>
                  </button>
                  <button (click)="adminService.eliminarBloque(b.id)" title="Eliminar Bloque" 
                          class="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-400 text-xs transition-all cursor-pointer inline-flex items-center justify-center">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL AÑADIR / EDITAR BLOQUE CAD CON PREVIEW Y SUBIDA PNG -->
      <div *ngIf="modalAbierto()" class="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade">
        <div class="bg-[#12141C] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
          
          <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-wood-light block mb-0.5">Gestor de Catálogo Studio CAD</span>
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
                       class="w-full px-3.5 py-3 rounded-xl bg-[#181818] border border-white/10 text-white font-bold focus:border-wood-accent focus:outline-none">
              </div>
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Categoría Arquitectónica *</label>
                <select [(ngModel)]="formCategoria" name="categoria" (change)="onCategoriaChange()"
                        class="w-full px-3.5 py-3 rounded-xl bg-[#181818] border border-white/10 text-white font-bold focus:border-wood-accent focus:outline-none">
                  <option value="alcobas">Alcobas Suite</option>
                  <option value="cocina">Cocina Integral</option>
                  <option value="area-comun">Área Común / Sala</option>
                  <option value="piscina">Piscina & Solárium</option>
                  <option value="estacionamiento">Estacionamiento / Garaje</option>
                  <option value="muro">Muros & Divisiones</option>
                  <option value="columnas">Columnas & Estructura</option>
                </select>
              </div>
            </div>

            <!-- 2. Precio USD y Área m2 -->
            <div class="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-4">
              <span class="text-[10px] font-bold text-wood-light uppercase tracking-wider block">Configuración Constructiva & Precio USD</span>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Precio Referencial ($ USD) *</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">$</span>
                    <input type="number" [(ngModel)]="formPrecio" name="precio" required min="1000" step="500" 
                           class="w-full pl-8 pr-3 py-3 rounded-xl bg-[#111] border border-emerald-500/40 text-emerald-400 font-serif font-extrabold text-base focus:border-emerald-400 focus:outline-none">
                  </div>
                  <!-- Botones rápidos de precio -->
                  <div class="flex items-center gap-1.5 mt-2">
                    <button type="button" (click)="adjustPrecio(-5000)" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold">- $5k</button>
                    <button type="button" (click)="adjustPrecio(5000)" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold">+ $5k</button>
                    <button type="button" (click)="formPrecio = 35000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$35k</button>
                    <button type="button" (click)="formPrecio = 65000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$65k</button>
                    <button type="button" (click)="formPrecio = 90000" class="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold">$90k</button>
                  </div>
                </div>

                <div>
                  <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Área Constructiva (m²) *</label>
                  <div class="relative">
                    <input type="number" [(ngModel)]="formArea" name="area" required min="5" max="500" 
                           class="w-full pl-3.5 pr-8 py-3 rounded-xl bg-[#111] border border-white/10 text-white font-bold text-sm focus:border-wood-accent focus:outline-none">
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
                <span class="text-[10px] text-wood-light font-bold">Soporta subida desde PC o galería</span>
              </div>

              <!-- Selector 1: Subir archivo PNG desde el equipo -->
              <div class="p-4 rounded-xl bg-[#161822] border-2 border-dashed border-white/20 hover:border-wood-accent transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-wood-accent/20 text-wood-light flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <div>
                    <span class="text-white font-bold text-xs block">Subir nueva imagen PNG desde tu PC</span>
                    <span class="text-[11px] text-gray-400">El archivo se convertirá en formato transparente de alta resolución</span>
                  </div>
                </div>
                <label class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors shrink-0 inline-flex items-center gap-2">
                  <span>Seleccionar archivo .PNG</span>
                  <input type="file" accept=".png,image/png" (change)="onFileSelected($event)" class="hidden">
                </label>
              </div>

              <!-- Selector 2: Galería de pre-cargados según la categoría -->
              <div class="space-y-2">
                <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">O elige un modelo predeterminado para categoría "{{ formCategoria }}":</span>
                <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <button type="button" *ngFor="let preset of getPresetImages()" 
                          (click)="formImagen = preset.path"
                          [ngClass]="formImagen === preset.path ? 'border-wood-accent bg-wood-accent/15 scale-105' : 'border-white/10 bg-[#151515] hover:border-white/30'"
                          class="p-2 rounded-xl border flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer w-24">
                    <div class="w-12 h-12 rounded bg-[#080808] p-1 flex items-center justify-center">
                      <img [src]="preset.path" [alt]="preset.label" class="w-full h-full object-contain">
                    </div>
                    <span class="text-[10px] text-gray-300 font-bold truncate w-full text-center">{{ preset.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Vista Previa de la Imagen Seleccionada -->
              <div class="p-3 rounded-xl bg-[#080808] border border-white/10 flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-[#111] border border-white/10 p-2 flex items-center justify-center shrink-0">
                  <img [src]="formImagen" alt="Preview" class="w-full h-full object-contain filter drop-shadow-md">
                </div>
                <div class="overflow-hidden">
                  <span class="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Imagen PNG Lista para Simulador CAD
                  </span>
                  <p class="text-xs text-gray-300 truncate font-mono">{{ formImagen.length > 50 ? formImagen.slice(0, 45) + '...' : formImagen }}</p>
                </div>
              </div>

            </div>

            <!-- Botones de Acción -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="cerrarModal()" class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors cursor-pointer">Cancelar</button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold transition-all shadow-xl cursor-pointer inline-flex items-center gap-2">
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
  private idEnEdicion = '';

  formNombre = '';
  formCategoria: BloqueAdmin['categoria'] = 'alcobas';
  formArea = 35;
  formPrecio = 55000;
  formImagen = 'assets/images/arquitectura/alcobas/alcoba1.png';

  // Opciones predeterminadas por categoría
  readonly presetsMap: Record<string, Array<{ label: string; path: string }>> = {
    alcobas: [
      { label: 'Master Suite', path: 'assets/images/arquitectura/alcobas/alcoba1.png' },
      { label: 'Suite Doble', path: 'assets/images/arquitectura/alcobas/alcoba2.png' },
      { label: 'Alcoba 3', path: 'assets/images/arquitectura/alcobas/alcoba3.png' },
      { label: 'Alcoba 4', path: 'assets/images/arquitectura/alcobas/alcoba4.png' }
    ],
    cocina: [
      { label: 'Cocina Isla', path: 'assets/images/arquitectura/cocina/cocina1.png' }
    ],
    'area-comun': [
      { label: 'Sala Altura', path: 'assets/images/arquitectura/area-comun/comun1.png' }
    ],
    piscina: [
      { label: 'Piscina Infinity', path: 'assets/images/arquitectura/piscina/piscina.png' }
    ],
    estacionamiento: [
      { label: 'Garaje Doble', path: 'assets/images/arquitectura/estacionamiento/congarage.png' }
    ],
    muro: [
      { label: 'Muro Estructural', path: 'assets/images/arquitectura/alcobas/alcoba1.png' }
    ],
    columnas: [
      { label: 'Columna Concreto', path: 'assets/images/arquitectura/cocina/cocina1.png' }
    ]
  };

  getPresetImages(): Array<{ label: string; path: string }> {
    return this.presetsMap[this.formCategoria] || this.presetsMap['alcobas'];
  }

  onCategoriaChange(): void {
    const presets = this.getPresetImages();
    if (presets && presets.length > 0) {
      this.formImagen = presets[0].path;
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
        this.formImagen = e.target.result; // Base64 DataURL de la imagen cargada
      };
      reader.readAsDataURL(file);
    }
  }

  abrirModalNuevo(): void {
    this.esEdicion.set(false);
    this.idEnEdicion = '';
    this.formNombre = '';
    this.formCategoria = 'alcobas';
    this.formArea = 35;
    this.formPrecio = 55000;
    this.formImagen = 'assets/images/arquitectura/alcobas/alcoba1.png';
    this.modalAbierto.set(true);
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
