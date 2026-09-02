import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10 animate-fade font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-[0.3em] text-neutral-400 font-bold uppercase block mb-2">
            DIRECTORIO INSTITUCIONAL
          </span>
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 tracking-tight leading-[1.05]">
            Comunidad & <span class="font-bold">Usuarios del Portal</span>
          </h1>
          <p class="font-sans text-base sm:text-lg text-neutral-500 font-light leading-relaxed mt-3 max-w-2xl">
            Gestión de propietarios, arquitectos, colaboradores y administradores con acceso a la plataforma.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-xs sm:text-sm font-mono font-bold text-neutral-800 bg-white px-5 py-3 rounded-2xl border border-neutral-200 shadow-2xs">
            Total Registrados: {{ adminService.usuarios().length }}
          </span>
        </div>
      </div>

      <!-- BARRA DE BÚSQUEDA Y FILTROS -->
      <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5">
        
        <!-- Buscador -->
        <div class="relative w-full sm:w-[420px]">
          <svg class="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="terminoBusqueda" (ngModelChange)="actualizarFiltros()" placeholder="Buscar por nombre o correo electrónico..." 
                 class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm placeholder:text-neutral-400 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all">
        </div>

        <!-- Filtros de Rol -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-sans">
          <button (click)="setFiltroRol('todos')"
                  [ngClass]="filtroRol() === 'todos' ? 'bg-black text-white font-bold shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
                  class="px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap">
            Todos
          </button>
          <button (click)="setFiltroRol('propietario')"
                  [ngClass]="filtroRol() === 'propietario' ? 'bg-black text-white font-bold shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
                  class="px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <span>Propietarios</span>
          </button>
          <button (click)="setFiltroRol('arquitecto')"
                  [ngClass]="filtroRol() === 'arquitecto' ? 'bg-black text-white font-bold shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
                  class="px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <span>Arquitectos</span>
          </button>
          <button (click)="setFiltroRol('inversionista')"
                  [ngClass]="filtroRol() === 'inversionista' ? 'bg-black text-white font-bold shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
                  class="px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5">
            <span>Inversionistas</span>
          </button>
        </div>

      </div>

      <!-- TABLA DE USUARIOS BLANCA Y MODERNA -->
      <div class="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden shadow-2xs">
        <div class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                <th class="py-5 px-7">Usuario & Contacto</th>
                <th class="py-5 px-5">Rol en Portal</th>
                <th class="py-5 px-5">Proyectos Nube</th>
                <th class="py-5 px-5">Fecha Registro</th>
                <th class="py-5 px-5">Estado</th>
                <th class="py-5 px-7 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-sm font-sans">
              <tr *ngFor="let u of usuariosFiltrados()" class="hover:bg-neutral-50/70 transition-colors group">
                
                <!-- Col 1: Nombre y Email -->
                <td class="py-4.5 px-7">
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif font-black text-neutral-900 shrink-0 text-base shadow-xs">
                      {{ u.nombre.charAt(0) }}
                    </div>
                    <div>
                      <span class="font-bold text-neutral-900 text-sm sm:text-base block">{{ u.nombre }}</span>
                      <span class="text-neutral-500 text-xs sm:text-sm block font-light">{{ u.email }}</span>
                      <span class="text-neutral-400 text-xs font-mono mt-0.5 block">{{ u.telefono }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Rol -->
                <td class="py-4.5 px-5 font-mono">
                  <span [ngClass]="u.rol === 'admin' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-200'"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {{ u.rol }}
                  </span>
                </td>

                <!-- Col 3: Proyectos -->
                <td class="py-4.5 px-5 font-mono font-bold text-neutral-700">
                  <span class="bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs">{{ u.proyectosGuardados }} Obras</span>
                </td>

                <!-- Col 4: Fecha -->
                <td class="py-4.5 px-5 text-neutral-500 font-mono text-xs sm:text-sm">
                  {{ u.fechaRegistro }}
                </td>

                <!-- Col 5: Estado -->
                <td class="py-4.5 px-5">
                  <button (click)="adminService.toggleEstadoUsuario(u.id)"
                          [ngClass]="{
                            'bg-emerald-50 text-emerald-800 border-emerald-200': u.estado === 'activo',
                            'bg-amber-50 text-amber-800 border-amber-200': u.estado === 'pendiente',
                            'bg-red-50 text-red-800 border-red-200': u.estado === 'suspendido'
                          }"
                          class="px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-2 h-2 rounded-full" [ngClass]="u.estado === 'activo' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    <span class="capitalize">{{ u.estado }}</span>
                  </button>
                </td>

                <!-- Col 6: Acciones -->
                <td class="py-4.5 px-7 text-right">
                  <button (click)="eliminarUsuario(u)" title="Retirar Usuario" 
                          class="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-xs font-semibold border border-transparent hover:border-red-200 inline-flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>Retirar</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>

          <div *ngIf="usuariosFiltrados().length === 0" class="py-20 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
            <svg class="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span class="text-sm text-neutral-500 font-sans">No se encontraron usuarios registrados en la base de datos.</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashUsuariosComponent implements OnInit {
  readonly adminService = inject(AdminService);

  readonly filtroRol = signal<string>('todos');
  terminoBusqueda = '';

  readonly usuariosFiltrados = computed(() => {
    const lista = this.adminService.usuarios();
    const termino = this.terminoBusqueda.toLowerCase().trim();
    const rol = this.filtroRol();

    return lista.filter((u: any) => {
      const cumpleRol = rol === 'todos' || u.rol === rol;
      const cumpleBusqueda = !termino || (u.nombre && u.nombre.toLowerCase().includes(termino)) || (u.email && u.email.toLowerCase().includes(termino));
      return cumpleRol && cumpleBusqueda;
    });
  });

  ngOnInit(): void {
    this.adminService.cargarDatosReales();
  }

  setFiltroRol(rol: string): void {
    this.filtroRol.set(rol);
  }

  eliminarUsuario(u: any): void {
    if (confirm(`¿Deseas retirar al usuario "${u.nombre}" del portal?`)) {
      this.adminService.eliminarUsuario(u.id);
    }
  }

  actualizarFiltros(): void {
    // El computed actualiza automáticamente
  }
}
