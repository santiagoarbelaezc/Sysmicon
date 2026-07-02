import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

// Importación de las 8 vistas
import { DashInicioComponent } from '../views/dash-inicio/dash-inicio.component';
import { DashAnaliticasComponent } from '../views/dash-analiticas/dash-analiticas.component';
import { DashCad2Component } from '../views/dash-cad2/dash-cad2.component';
import { DashEstadisticasComponent } from '../views/dash-estadisticas/dash-estadisticas.component';
import { DashPersonalizarComponent } from '../views/dash-personalizar/dash-personalizar.component';
import { DashUsuariosComponent } from '../views/dash-usuarios/dash-usuarios.component';
import { DashMensajesComponent } from '../views/dash-mensajes/dash-mensajes.component';
import { DashReportesComponent } from '../views/dash-reportes/dash-reportes.component';

export type AdminSection = 'inicio' | 'analiticas' | 'cad2' | 'estadisticas' | 'personalizar' | 'usuarios' | 'mensajes' | 'reportes';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashInicioComponent,
    DashAnaliticasComponent,
    DashCad2Component,
    DashEstadisticasComponent,
    DashPersonalizarComponent,
    DashUsuariosComponent,
    DashMensajesComponent,
    DashReportesComponent
  ],
  template: `
    <div class="min-h-screen bg-[#080808] text-white flex overflow-hidden font-sans">
      
      <!-- SIDEBAR EN ESCRITORIO -->
      <aside [ngClass]="sidebarAbierto() ? 'w-64' : 'w-20'" 
             class="hidden lg:flex flex-col bg-[#0A0D12] border-r border-white/10 transition-all duration-300 z-30 shrink-0 select-none">
        
        <!-- Logo Header Sidebar -->
        <div class="h-20 border-b border-white/10 flex items-center justify-between px-4">
          <a routerLink="/" class="flex items-center gap-3 overflow-hidden">
            <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" class="w-10 h-10 object-contain shrink-0">
            <div *ngIf="sidebarAbierto()" class="flex flex-col animate-fade">
              <span class="font-serif font-extrabold text-base text-white tracking-wider">SYSMICON</span>
              <span class="text-[9px] text-wood-light uppercase tracking-widest font-bold">Portal Directivo</span>
            </div>
          </a>
          <button (click)="toggleSidebar()" 
                  class="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs cursor-pointer">
            {{ sidebarAbierto() ? '◀' : '▶' }}
          </button>
        </div>

        <!-- Menú de Navegación de 8 Secciones -->
        <nav class="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
          
          <!-- 1. Dash Inicio -->
          <button (click)="setSeccion('inicio')"
                  [ngClass]="seccionActiva() === 'inicio' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">🏠</span>
            <span *ngIf="sidebarAbierto()" class="truncate">Dash Inicio</span>
          </button>

          <!-- 2. Analíticas -->
          <button (click)="setSeccion('analiticas')"
                  [ngClass]="seccionActiva() === 'analiticas' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">📈</span>
            <span *ngIf="sidebarAbierto()" class="truncate">Analíticas</span>
          </button>

          <!-- 3. CAD 2 -->
          <button (click)="setSeccion('cad2')"
                  [ngClass]="seccionActiva() === 'cad2' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">📐</span>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>CAD 2</span>
              <span class="bg-blue-500/20 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </span>
          </button>

          <!-- 4. Estadísticas -->
          <button (click)="setSeccion('estadisticas')"
                  [ngClass]="seccionActiva() === 'estadisticas' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">📊</span>
            <span *ngIf="sidebarAbierto()" class="truncate">Estadísticas</span>
          </button>

          <!-- 5. Personalizar Sitio -->
          <button (click)="setSeccion('personalizar')"
                  [ngClass]="seccionActiva() === 'personalizar' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">🎨</span>
            <span *ngIf="sidebarAbierto()" class="truncate">Personalizar Sitio</span>
          </button>

          <!-- 6. Usuarios -->
          <button (click)="setSeccion('usuarios')"
                  [ngClass]="seccionActiva() === 'usuarios' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">👥</span>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>Usuarios</span>
              <span class="bg-white/10 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">{{ adminService.usuarios().length }}</span>
            </span>
          </button>

          <!-- 7. Mensajes -->
          <button (click)="setSeccion('mensajes')"
                  [ngClass]="seccionActiva() === 'mensajes' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">💬</span>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>Mensajes</span>
              <span *ngIf="countMensajesSinLeer() > 0" class="bg-emerald-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">{{ countMensajesSinLeer() }}</span>
            </span>
          </button>

          <!-- 8. Reportes -->
          <button (click)="setSeccion('reportes')"
                  [ngClass]="seccionActiva() === 'reportes' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <span class="text-base shrink-0">📑</span>
            <span *ngIf="sidebarAbierto()" class="truncate">Reportes</span>
          </button>

        </nav>

        <!-- Footer Sidebar (Regresar al sitio) -->
        <div class="p-4 border-t border-white/10">
          <a routerLink="/" 
             class="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs transition-colors">
            <span class="text-base shrink-0">🌐</span>
            <span *ngIf="sidebarAbierto()" class="truncate font-bold">Ver Sitio Web</span>
          </a>
        </div>

      </aside>

      <!-- CONTENEDOR PRINCIPAL DERECHA -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- TOP NAVBAR ADMIN -->
        <header class="h-20 bg-[#0A0D12]/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between gap-4 shrink-0 z-20">
          
          <!-- Botón Menú Móvil -->
          <div class="flex items-center gap-4">
            <button (click)="toggleMenuMovil()" class="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg bg-white/5 text-lg">
              ☰
            </button>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Sección:</span>
              <span class="text-sm font-serif font-extrabold text-white capitalize bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                {{ seccionActiva() === 'cad2' ? 'Studio CAD 2' : seccionActiva() }}
              </span>
            </div>
          </div>

          <!-- Buscador Rápido Top Header -->
          <div class="hidden md:flex items-center relative max-w-xs w-full">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
            <input type="text" placeholder="Buscar en el portal o catálogo..." 
                   class="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161616] border border-white/10 text-white text-xs placeholder-gray-500 focus:border-wood-accent focus:outline-none">
          </div>

          <!-- Acciones Derecha (Notificaciones & Perfil) -->
          <div class="flex items-center gap-4">
            
            <button (click)="setSeccion('mensajes')" title="Notificaciones" class="relative p-2.5 rounded-xl bg-[#161616] border border-white/10 text-gray-300 hover:text-white hover:border-wood-accent/50 transition-all">
              <span>🔔</span>
              <span *ngIf="countMensajesSinLeer() > 0" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                {{ countMensajesSinLeer() }}
              </span>
            </button>

            <!-- Perfil Admin -->
            <div class="flex items-center gap-3 pl-4 border-l border-white/10">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-wood-accent to-[#0F254B] p-0.5 shadow-md flex items-center justify-center font-serif font-extrabold text-white">
                AD
              </div>
              <div class="hidden sm:block">
                <span class="text-xs font-bold text-white block leading-none">David Jaramillo</span>
                <span class="text-[10px] text-wood-light uppercase tracking-wider font-bold">Director Senior</span>
              </div>
              <button (click)="cerrarSesionAdmin()" title="Cerrar sesión o salir del Admin" class="text-gray-400 hover:text-red-400 ml-1 text-sm font-bold">
                ✕
              </button>
            </div>

          </div>

        </header>

        <!-- ÁREA DE CONTENIDO SCROLLEABLE -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin bg-[#080808]">
          <div class="max-w-[1600px] mx-auto pb-12">
            
            <!-- RENDER DE LAS 8 SECCIONES -->
            <app-dash-inicio *ngIf="seccionActiva() === 'inicio'"></app-dash-inicio>
            <app-dash-analiticas *ngIf="seccionActiva() === 'analiticas'"></app-dash-analiticas>
            <app-dash-cad2 *ngIf="seccionActiva() === 'cad2'"></app-dash-cad2>
            <app-dash-estadisticas *ngIf="seccionActiva() === 'estadisticas'"></app-dash-estadisticas>
            <app-dash-personalizar *ngIf="seccionActiva() === 'personalizar'"></app-dash-personalizar>
            <app-dash-usuarios *ngIf="seccionActiva() === 'usuarios'"></app-dash-usuarios>
            <app-dash-mensajes *ngIf="seccionActiva() === 'mensajes'"></app-dash-mensajes>
            <app-dash-reportes *ngIf="seccionActiva() === 'reportes'"></app-dash-reportes>

          </div>
        </main>

      </div>

      <!-- DRAWER MÓVIL (SIDEBAR EN CELULARES) -->
      <div *ngIf="menuMovilAbierto()" class="fixed inset-0 z-50 lg:hidden flex animate-fade">
        <div (click)="toggleMenuMovil()" class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
        <aside class="w-64 bg-[#0A0D12] border-r border-white/10 z-10 flex flex-col h-full relative">
          
          <div class="h-20 border-b border-white/10 flex items-center justify-between px-5">
            <a routerLink="/" class="flex items-center gap-3">
              <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" class="w-9 h-9 object-contain">
              <span class="font-serif font-bold text-white">Sysmicon Admin</span>
            </a>
            <button (click)="toggleMenuMovil()" class="text-gray-400 text-lg font-bold">✕</button>
          </div>

          <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            <button (click)="setSeccion('inicio'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>🏠</span> Dash Inicio
            </button>
            <button (click)="setSeccion('analiticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>📈</span> Analíticas
            </button>
            <button (click)="setSeccion('cad2'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between text-gray-300 hover:bg-white/5">
              <span class="flex items-center gap-3"><span>📐</span> CAD 2</span>
              <span class="bg-blue-500/20 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </button>
            <button (click)="setSeccion('estadisticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>📊</span> Estadísticas
            </button>
            <button (click)="setSeccion('personalizar'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>🎨</span> Personalizar Sitio
            </button>
            <button (click)="setSeccion('usuarios'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>👥</span> Usuarios
            </button>
            <button (click)="setSeccion('mensajes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>💬</span> Mensajes
            </button>
            <button (click)="setSeccion('reportes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <span>📑</span> Reportes
            </button>
          </nav>

          <div class="p-4 border-t border-white/10">
            <a routerLink="/" class="block w-full text-center py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs">🌐 Regresar a Sysmicon</a>
          </div>
        </aside>
      </div>

    </div>
  `
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly adminService = inject(AdminService);
  readonly router = inject(Router);

  readonly seccionActiva = signal<AdminSection>('inicio');
  readonly sidebarAbierto = signal<boolean>(true);
  readonly menuMovilAbierto = signal<boolean>(false);

  setSeccion(seccion: AdminSection): void {
    this.seccionActiva.set(seccion);
  }

  toggleSidebar(): void {
    this.sidebarAbierto.update(v => !v);
  }

  toggleMenuMovil(): void {
    this.menuMovilAbierto.update(v => !v);
  }

  countMensajesSinLeer(): number {
    return this.adminService.mensajes().filter((m: any) => !m.leido).length;
  }

  cerrarSesionAdmin(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
