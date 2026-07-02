import { Component, inject, signal } from '@angular/core';
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
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Catálogo Arquitectónico Studio CAD 2</h2>
          <p class="text-xs text-gray-400 mt-1">Administración de bloques CAD 2D, áreas constructivas en m² y precios referenciales en USD.</p>
        </div>
        <button (click)="abrirModalNuevo()" 
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-105 cursor-pointer">
          <span>+ Añadir Nuevo Bloque CAD</span>
        </button>
      </div>

      <!-- Alerta Informativa -->
      <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs flex items-center gap-3">
        <span class="text-lg">💡</span>
        <span><strong>Sincronización en Nube:</strong> Cualquier bloque marcado como "Inactivo" dejará de mostrarse al cliente en el simulador en vivo al instante.</span>
      </div>

      <!-- Tabla de Bloques CAD -->
      <div class="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 bg-[#161616] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="py-4 px-5">Bloque & Categoría</th>
                <th class="py-4 px-4">Área Constructiva</th>
                <th class="py-4 px-4">Inversión Ref.</th>
                <th class="py-4 px-4">Estado en Simulador</th>
                <th class="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-xs font-sans">
              <tr *ngFor="let b of adminService.bloquesCAD()" class="hover:bg-[#151515] transition-colors group">
                
                <!-- Col 1: Nombre e Imagen -->
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-[#080808] p-1.5 border border-white/10 flex items-center justify-center shrink-0">
                      <img [src]="b.imagen" [alt]="b.nombre" class="w-full h-full object-contain filter drop-shadow">
                    </div>
                    <div>
                      <span class="font-bold text-white text-sm block group-hover:text-wood-light transition-colors">{{ b.nombre }}</span>
                      <span class="inline-block px-2 py-0.5 mt-1 rounded bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-wider">{{ b.categoria }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Área m2 -->
                <td class="py-3.5 px-4 font-bold text-gray-200">
                  <span class="bg-[#1C1C1C] px-2.5 py-1 rounded-lg border border-white/5">{{ b.areaM2 }} m²</span>
                </td>

                <!-- Col 3: Precio USD -->
                <td class="py-3.5 px-4 font-serif font-extrabold text-emerald-400 text-sm">
                  \${{ b.precioUSD | number:'1.0-0' }} USD
                </td>

                <!-- Col 4: Estado -->
                <td class="py-3.5 px-4">
                  <button (click)="adminService.toggleActivoBloque(b.id)"
                          [ngClass]="b.activo ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' : 'bg-red-950/60 text-red-300 border-red-800/50'"
                          class="px-3 py-1 rounded-full border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="b.activo ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
                    <span>{{ b.activo ? 'Activo en CAD 2' : 'Inactivo / Oculto' }}</span>
                  </button>
                </td>

                <!-- Col 5: Acciones -->
                <td class="py-3.5 px-5 text-right space-x-2">
                  <button (click)="abrirModalEditar(b)" title="Editar Precio / Área" 
                          class="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-wood-accent hover:text-[#111] text-gray-300 font-bold text-[11px] transition-all cursor-pointer">
                    ✏️ Editar
                  </button>
                  <button (click)="adminService.eliminarBloque(b.id)" title="Eliminar Bloque" 
                          class="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/80 text-red-400 text-[11px] transition-all cursor-pointer">
                    🗑️
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL AÑADIR / EDITAR BLOQUE -->
      <div *ngIf="modalAbierto()" class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
        <div class="bg-[#12141C] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
          
          <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <h3 class="font-serif text-lg font-bold text-white">{{ esEdicion() ? 'Editar Bloque CAD' : 'Nuevo Bloque CAD 2D' }}</h3>
            <button (click)="cerrarModal()" class="text-gray-400 hover:text-white font-bold">✕</button>
          </div>

          <form (ngSubmit)="guardarBloque()" class="space-y-4 text-xs font-sans">
            
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Nombre Arquitectónico *</label>
              <input type="text" [(ngModel)]="formNombre" name="nombre" required placeholder="ej. Suite Principal con Balcón" 
                     class="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Categoría *</label>
                <select [(ngModel)]="formCategoria" name="categoria" 
                        class="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
                  <option value="alcobas">Alcobas</option>
                  <option value="cocina">Cocina</option>
                  <option value="area-comun">Área Común</option>
                  <option value="piscina">Piscina</option>
                  <option value="estacionamiento">Estacionamiento</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Área Constructiva (m²) *</label>
                <input type="number" [(ngModel)]="formArea" name="area" required min="5" max="500" 
                       class="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
              </div>
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Precio Referencial ($ USD) *</label>
              <input type="number" [(ngModel)]="formPrecio" name="precio" required min="1000" step="500" 
                     class="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>

            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Ruta de Imagen CAD *</label>
              <input type="text" [(ngModel)]="formImagen" name="imagen" required placeholder="assets/images/arquitectura/..." 
                     class="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="cerrarModal()" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors">Cancelar</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-wood-accent hover:bg-wood-light text-[#111] font-extrabold transition-all shadow-lg">
                {{ esEdicion() ? 'Guardar Cambios' : 'Añadir al Catálogo' }}
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
  formArea = 30;
  formPrecio = 45000;
  formImagen = 'assets/images/arquitectura/alcobas/alcoba1.png';

  abrirModalNuevo(): void {
    this.esEdicion.set(false);
    this.idEnEdicion = '';
    this.formNombre = '';
    this.formCategoria = 'alcobas';
    this.formArea = 35;
    this.formPrecio = 50000;
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
