import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10 animate-fade-in font-sans">
      
      <!-- ENCABEZADO DE SECCIÓN -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span class="font-mono text-xs sm:text-sm tracking-ultra text-neutral-400 font-black uppercase block mb-2">
            DIRECTORIO INSTITUCIONAL
          </span>
          <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 uppercase tracking-tight leading-[1.05]">
            COMUNIDAD & <span class="font-light">USUARIOS DEL PORTAL</span>
          </h1>
          <p class="font-sans text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mt-3 max-w-3xl">
            Gestión de propietarios, arquitectos, colaboradores y administradores con acceso a la plataforma.
          </p>
        </div>
        
        <div class="flex items-center gap-3 shrink-0">
          <span class="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-neutral-950 bg-white px-6 py-3.5 rounded-2xl border border-neutral-200 shadow-xs">
            TOTAL REGISTRADOS: {{ adminService.usuarios().length }}
          </span>
        </div>
      </div>

      <!-- BARRA DE BÚSQUEDA Y FILTROS MONOCROMÁTICOS -->
      <div class="bg-white border border-neutral-200 rounded-3xl p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <!-- Buscador -->
        <div class="relative w-full sm:w-[460px]">
          <svg class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" [(ngModel)]="terminoBusqueda" (ngModelChange)="actualizarFiltros()" placeholder="Buscar por nombre o correo electrónico..." 
                 class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-950 text-sm sm:text-base placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-sans">
        </div>

        <!-- Filtros de Rol Monocromáticos -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-sans">
          <button (click)="setFiltroRol('todos')"
                  [ngClass]="filtroRol() === 'todos' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'"
                  class="px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap">
            TODOS
          </button>
          <button (click)="setFiltroRol('propietario')"
                  [ngClass]="filtroRol() === 'propietario' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'"
                  class="px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap">
            PROPIETARIOS
          </button>
          <button (click)="setFiltroRol('arquitecto')"
                  [ngClass]="filtroRol() === 'arquitecto' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'"
                  class="px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap">
            ARQUITECTOS
          </button>
          <button (click)="setFiltroRol('inversionista')"
                  [ngClass]="filtroRol() === 'inversionista' ? 'bg-neutral-950 text-white font-black shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/80 font-bold'"
                  class="px-5 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap">
            INVERSIONISTAS
          </button>
        </div>

      </div>

      <!-- TABLA DE USUARIOS BLANCA Y MODERNA -->
      <div class="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
        <div class="overflow-x-auto scrollbar-thin">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50/90 text-xs font-black text-neutral-500 uppercase tracking-widest font-mono">
                <th class="py-5 px-8">USUARIO & CONTACTO</th>
                <th class="py-5 px-6">ROL EN PORTAL</th>
                <th class="py-5 px-6">PROYECTOS NUBE</th>
                <th class="py-5 px-6">FECHA REGISTRO</th>
                <th class="py-5 px-6">ESTADO</th>
                <th class="py-5 px-8 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-sm font-sans">
              <tr *ngFor="let u of usuariosFiltrados()" class="hover:bg-neutral-50/80 transition-colors group">
                
                <!-- Col 1: Nombre y Email -->
                <td class="py-5 px-8">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif font-black text-neutral-950 shrink-0 text-base shadow-xs">
                      {{ u.nombre.charAt(0) }}
                    </div>
                    <div>
                      <span class="font-black text-neutral-950 text-base block leading-tight uppercase tracking-wide">{{ u.nombre }}</span>
                      <span class="text-neutral-600 text-sm block font-normal mt-1">{{ u.email }}</span>
                      <span class="text-neutral-400 text-xs font-mono mt-0.5 block">{{ u.telefono }}</span>
                    </div>
                  </div>
                </td>

                <!-- Col 2: Rol -->
                <td class="py-5 px-6 font-mono">
                  <span [ngClass]="u.rol === 'admin' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900 border border-neutral-200'"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                    {{ u.rol }}
                  </span>
                </td>

                <!-- Col 3: Proyectos -->
                <td class="py-5 px-6 font-mono font-bold text-neutral-800">
                  <span class="bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold uppercase">{{ u.proyectosGuardados }} OBRAS</span>
                </td>

                <!-- Col 4: Fecha -->
                <td class="py-5 px-6 text-neutral-600 font-mono text-sm font-medium">
                  {{ u.fechaRegistro }}
                </td>

                <!-- Col 5: Estado -->
                <td class="py-5 px-6">
                  <button (click)="adminService.toggleEstadoUsuario(u.id)"
                          [ngClass]="{
                            'bg-emerald-50 text-emerald-950 border-emerald-300': u.estado === 'activo',
                            'bg-amber-50 text-amber-950 border-amber-300': u.estado === 'pendiente',
                            'bg-neutral-100 text-neutral-700 border-neutral-300': u.estado === 'suspendido'
                          }"
                          class="px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                    <span class="w-2 h-2 rounded-full" [ngClass]="u.estado === 'activo' ? 'bg-emerald-500' : 'bg-neutral-400'"></span>
                    <span>{{ u.estado }}</span>
                  </button>
                </td>

                <!-- Col 6: Acciones -->
                <td class="py-5 px-8 text-right">
                  <button (click)="eliminarUsuario(u)" title="Retirar Usuario" 
                          class="px-4 py-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50/80 transition-colors cursor-pointer text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>RETIRAR</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>

          <div *ngIf="usuariosFiltrados().length === 0" class="py-24 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
            <svg class="w-12 h-12 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span class="text-base text-neutral-500 font-sans">No se encontraron usuarios registrados en la base de datos.</span>
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
