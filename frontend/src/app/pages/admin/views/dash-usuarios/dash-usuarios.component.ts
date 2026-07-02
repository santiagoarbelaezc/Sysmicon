import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de Sección -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Comunidad & Gestión de Usuarios</h2>
          <p class="text-xs text-gray-400 mt-1">Directorio de propietarios, arquitectos senior e inversionistas con cuentas privadas en Sysmicon.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-wood-light bg-wood-accent/15 px-3 py-1.5 rounded-xl border border-wood-accent/30 shadow-sm">
            Total Registrados: {{ adminService.usuarios().length }}
          </span>
        </div>
      </div>

      <!-- Barra de Búsqueda y Filtros -->
      <div class="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <!-- Buscador -->
        <div class="relative w-full sm:w-80">
          <svg class="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="terminoBusqueda" (ngModelChange)="actualizarFiltros()" placeholder="Buscar por nombre o correo..." 
                 class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs placeholder-gray-500 focus:border-wood-accent focus:outline-none">
        </div>

        <!-- Filtros de Rol -->
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button (click)="setFiltroRol('todos')"
                  [ngClass]="filtroRol() === 'todos' ? 'bg-wood-accent text-[#111] font-extrabold shadow-sm' : 'bg-[#181818] text-gray-400 hover:text-white'"
                  class="px-3.5 py-2 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap">
            Todos
          </button>
          <button (click)="setFiltroRol('propietario')"
                  [ngClass]="filtroRol() === 'propietario' ? 'bg-wood-accent text-[#111] font-extrabold shadow-sm' : 'bg-[#181818] text-gray-400 hover:text-white'"
                  class="px-3.5 py-2 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Propietarios</span>
          </button>
          <button (click)="setFiltroRol('arquitecto')"
                  [ngClass]="filtroRol() === 'arquitecto' ? 'bg-wood-accent text-[#111] font-extrabold shadow-sm' : 'bg-[#181818] text-gray-400 hover:text-white'"
                  class="px-3.5 py-2 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/></svg>
            <span>Arquitectos</span>
          </button>
          <button (click)="setFiltroRol('inversionista')"
                  [ngClass]="filtroRol() === 'inversionista' ? 'bg-wood-accent text-[#111] font-extrabold shadow-sm' : 'bg-[#181818] text-gray-400 hover:text-white'"
                  class="px-3.5 py-2 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Inversionistas</span>
          </button>
        </div>

      </div>

      <!-- Tabla de Usuarios -->
      <div class="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10 bg-[#161616] text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="py-4 px-5">Usuario & Contacto</th>
                <th class="py-4 px-4">Rol en Portal</th>
                <th class="py-4 px-4">Proyectos Nube</th>
                <th class="py-4 px-4">Fecha Registro</th>
                <th class="py-4 px-4">Estado</th>
                <th class="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-xs font-sans">
              <tr *ngFor="let u of usuariosFiltrados()" class="hover:bg-[#151515] transition-colors group">
                
                <!-- Col 1: Nombre y Email -->
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-wood-accent/30 to-blue-900/40 border border-white/10 flex items-center justify-center font-serif font-bold text-white shrink-0">
                      {{ u.nombre.charAt(0) }}
                    </div>
                    <div>
                      <span class="font-bold text-white text-sm block group-hover:text-wood-light transition-colors">{{ u.nombre }}</span>
                      <span class="text-gray-400 text-[11px] block">{{ u.email }}</span>
                      <span class="text-gray-500 text-[10px]">{{ u.telefono }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Rol -->
                <td class="py-3.5 px-4">
                  <span [ngClass]="{
                          'bg-emerald-950/60 text-emerald-300 border-emerald-800/40': u.rol === 'propietario',
                          'bg-blue-950/60 text-blue-300 border-blue-800/40': u.rol === 'arquitecto',
                          'bg-purple-950/60 text-purple-300 border-purple-800/40': u.rol === 'inversionista',
                          'bg-wood-accent/20 text-wood-light border-wood-accent/50': u.rol === 'admin'
                        }"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider">
                    {{ u.rol }}
                  </span>
                </td>

                <!-- Col 3: Proyectos -->
                <td class="py-3.5 px-4 font-bold text-gray-200">
                  <span class="bg-[#1C1C1C] px-2.5 py-1 rounded-lg border border-white/5">{{ u.proyectosGuardados }} CADs</span>
                </td>

                <!-- Col 4: Fecha -->
                <td class="py-3.5 px-4 text-gray-400 font-mono">
                  {{ u.fechaRegistro }}
                </td>

                <!-- Col 5: Estado -->
                <td class="py-3.5 px-4">
                  <button (click)="adminService.toggleEstadoUsuario(u.id)"
                          [ngClass]="{
                            'bg-emerald-950/60 text-emerald-300 border-emerald-800/50': u.estado === 'activo',
                            'bg-amber-950/60 text-amber-300 border-amber-800/50': u.estado === 'pendiente',
                            'bg-red-950/60 text-red-300 border-red-800/50': u.estado === 'suspendido'
                          }"
                          class="px-3 py-1 rounded-full border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="u.estado === 'activo' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
                    <span class="capitalize">{{ u.estado }}</span>
                  </button>
                </td>

                <!-- Col 6: Acciones -->
                <td class="py-3.5 px-5 text-right">
                  <button (click)="adminService.eliminarUsuario(u.id)" title="Retirar Usuario de Sysmicon" 
                          class="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-400 text-[11px] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    <span>Retirar</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>

          <div *ngIf="usuariosFiltrados().length === 0" class="py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <svg class="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span class="text-xs text-gray-400">No se encontraron usuarios que coincidan con la búsqueda.</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashUsuariosComponent {
  readonly adminService = inject(AdminService);

  readonly filtroRol = signal<string>('todos');
  terminoBusqueda = '';

  readonly usuariosFiltrados = computed(() => {
    const lista = this.adminService.usuarios();
    const termino = this.terminoBusqueda.toLowerCase().trim();
    const rol = this.filtroRol();

    return lista.filter((u: any) => {
      const cumpleRol = rol === 'todos' || u.rol === rol;
      const cumpleBusqueda = !termino || u.nombre.toLowerCase().includes(termino) || u.email.toLowerCase().includes(termino);
      return cumpleRol && cumpleBusqueda;
    });
  });

  setFiltroRol(rol: string): void {
    this.filtroRol.set(rol);
  }

  actualizarFiltros(): void {
    // El computed actualiza automáticamente
  }
}
