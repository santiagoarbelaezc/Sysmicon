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
    <div [class]="'min-h-screen flex overflow-hidden font-sans ' + (theme() === 'light' ? 'light-theme' : '')"
         style="background-color: var(--admin-bg-primary); color: var(--admin-text-primary);">
      
      <!-- SIDEBAR EN ESCRITORIO -->
      <aside [ngClass]="sidebarAbierto() ? 'w-64' : 'w-20'" 
             class="hidden lg:flex flex-col border-r transition-all duration-300 z-30 shrink-0 select-none relative"
             style="background-color: var(--admin-bg-sidebar); border-color: var(--admin-border);">
        
        <!-- Trazos decorativos tipo plano -->
        <div *ngIf="sidebarAbierto()" class="absolute top-3 left-3 text-[7px] font-mono pointer-events-none" style="color: var(--admin-text-muted);">SYS_ADMIN_v2</div>
        
        <!-- Logo Header Sidebar -->
        <div class="h-20 border-b flex items-center justify-between px-4" style="border-color: var(--admin-border);">
          <a routerLink="/" class="flex items-center gap-3 overflow-hidden">
            <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" class="w-10 h-10 object-contain shrink-0" [style.filter]="theme() === 'dark' ? 'brightness(0) invert(1)' : 'none'">
            <div *ngIf="sidebarAbierto()" class="flex flex-col animate-fade">
              <span class="font-serif font-extrabold text-base tracking-wider" style="color: var(--admin-text-primary);">SYSMICON</span>
              <span class="text-[10px] uppercase tracking-widest font-bold font-mono" style="color: var(--admin-text-secondary);">Portal Directivo</span>
            </div>
          </a>
          <button (click)="toggleSidebar()" 
                  class="p-1.5 rounded-lg transition-colors text-xs cursor-pointer"
                  [style.color]="'var(--admin-text-secondary)'"
                  [style.backgroundColor]="'transparent'"
                  class="hover:bg-black/5 dark:hover:bg-white/5">
            {{ sidebarAbierto() ? '◀' : '▶' }}
          </button>
        </div>

        <!-- Menú de Navegación de 8 Secciones -->
        <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-thin font-sans">
          
          <!-- 1. Dash Inicio -->
          <button (click)="setSeccion('inicio')"
                  [style.backgroundColor]="seccionActiva() === 'inicio' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'inicio' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-sans">Dash Inicio</span>
          </button>

          <!-- 2. Analíticas -->
          <button (click)="setSeccion('analiticas')"
                  [style.backgroundColor]="seccionActiva() === 'analiticas' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'analiticas' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-sans">Analíticas</span>
          </button>

          <!-- 3. CAD 2 -->
          <button (click)="setSeccion('cad2')"
                  [style.backgroundColor]="seccionActiva() === 'cad2' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'cad2' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 0 3.4Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full font-sans">
              <span>CAD 2</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono" style="background-color: var(--admin-bg-primary); color: var(--admin-text-secondary); border: 1px solid var(--admin-border);">PRO</span>
            </span>
          </button>

          <!-- 4. Estadísticas -->
          <button (click)="setSeccion('estadisticas')"
                  [style.backgroundColor]="seccionActiva() === 'estadisticas' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'estadisticas' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-sans">Estadísticas</span>
          </button>

          <!-- 5. Personalizar Sitio -->
          <button (click)="setSeccion('personalizar')"
                  [style.backgroundColor]="seccionActiva() === 'personalizar' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'personalizar' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-sans">Personalizar Sitio</span>
          </button>

          <!-- 6. Usuarios -->
          <button (click)="setSeccion('usuarios')"
                  [style.backgroundColor]="seccionActiva() === 'usuarios' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'usuarios' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full font-sans">
              <span>Usuarios</span>
              <span class="text-xs px-1.5 py-0.5 rounded font-mono font-bold" style="background-color: var(--admin-bg-primary); color: var(--admin-text-secondary); border: 1px solid var(--admin-border);">{{ adminService.usuarios().length }}</span>
            </span>
          </button>

          <!-- 7. Mensajes -->
          <button (click)="setSeccion('mensajes')"
                  [style.backgroundColor]="seccionActiva() === 'mensajes' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'mensajes' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full font-sans">
              <span>Mensajes</span>
              <span *ngIf="countMensajesSinLeer() > 0" class="text-xs font-extrabold px-1.5 py-0.5 rounded-full font-mono" style="background-color: var(--admin-text-primary); color: var(--admin-bg-primary);">{{ countMensajesSinLeer() }}</span>
            </span>
          </button>

          <!-- 8. Reportes -->
          <button (click)="setSeccion('reportes')"
                  [style.backgroundColor]="seccionActiva() === 'reportes' ? 'var(--admin-text-primary)' : 'transparent'"
                  [style.color]="seccionActiva() === 'reportes' ? 'var(--admin-bg-primary)' : 'var(--admin-text-secondary)'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all cursor-pointer group font-extrabold shadow-sm hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-sans">Reportes</span>
          </button>

        </nav>

        <!-- Footer Sidebar (Regresar al sitio) -->
        <div class="p-4 border-t" style="border-color: var(--admin-border);">
          <a routerLink="/" 
             class="flex items-center gap-3 p-2.5 rounded-xl text-sm transition-colors group"
             style="background-color: var(--admin-bg-input); color: var(--admin-text-secondary);"
             class="hover:brightness-110">
            <svg class="w-[18px] h-[18px] shrink-0 group-hover:rotate-12 transition-transform" stroke="currentColor" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate font-bold">Ver Sitio Web</span>
          </a>
        </div>

      </aside>

      <!-- CONTENEDOR PRINCIPAL DERECHA -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- TOP NAVBAR ADMIN -->
        <header class="h-20 backdrop-blur-md border-b px-6 flex items-center justify-between gap-4 shrink-0 z-20 relative"
                style="background-color: rgba(var(--admin-bg-primary), 0.9); border-color: var(--admin-border);">
          
          <!-- Botón Menú Móvil -->
          <div class="flex items-center gap-4 pt-1">
            <button (click)="toggleMenuMovil()" class="lg:hidden p-2 rounded-lg text-lg" style="background-color: var(--admin-bg-card); color: var(--admin-text-primary);">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--admin-text-muted);">Sección:</span>
              <span class="text-sm font-serif font-extrabold capitalize px-3 py-1 rounded-lg border"
                    style="background-color: var(--admin-bg-card); border-color: var(--admin-border); color: var(--admin-text-primary);">
                {{ seccionActiva() === 'cad2' ? 'Studio CAD 2' : seccionActiva() }}
              </span>
            </div>
          </div>

          <!-- Buscador Rápido Top Header -->
          <div class="hidden md:flex items-center relative max-w-xs w-full">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style="color: var(--admin-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Buscar en el portal o catálogo..." 
                   class="w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:border-wood-accent focus:outline-none"
                   style="background-color: var(--admin-bg-input); border-color: var(--admin-border); color: var(--admin-text-primary);">
          </div>

          <!-- Acciones Derecha (Notificaciones & Perfil) -->
          <div class="flex items-center gap-4">
            
            <!-- Botón Tema (Light/Dark Mode Toggle) -->
            <button (click)="toggleTheme()" [title]="theme() === 'dark' ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro'" 
                    class="p-2.5 rounded-xl border transition-all"
                    style="background-color: var(--admin-bg-input); border-color: var(--admin-border); color: var(--admin-text-secondary);">
              <!-- Icono Sol (para pasar a claro) -->
              <svg *ngIf="theme() === 'dark'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <!-- Icono Luna (para pasar a oscuro) -->
              <svg *ngIf="theme() === 'light'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>

            <button (click)="setSeccion('mensajes')" title="Notificaciones" class="relative p-2.5 rounded-xl border transition-all group"
                    style="background-color: var(--admin-bg-input); border-color: var(--admin-border); color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span *ngIf="countMensajesSinLeer() > 0" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                {{ countMensajesSinLeer() }}
              </span>
            </button>

            <!-- Perfil Admin -->
            <div class="flex items-center gap-3 pl-4 border-l" style="border-color: var(--admin-border);">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-extrabold shadow-md"
                   style="background-color: var(--admin-text-primary); color: var(--admin-bg-primary);">
                AD
              </div>
              <div class="hidden sm:block">
                <span class="text-xs font-bold block leading-none" style="color: var(--admin-text-primary);">David Jaramillo</span>
                <span class="text-[10px] uppercase tracking-wider font-bold" style="color: var(--admin-text-secondary);">Director Senior</span>
              </div>
              <button (click)="cerrarSesionAdmin()" title="Cerrar sesión o salir del Admin" class="hover:text-red-400 ml-1 p-1 rounded transition-colors" style="color: var(--admin-text-secondary);">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>

          </div>

        </header>

        <!-- ÁREA DE CONTENIDO SCROLLEABLE -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin" style="background-color: var(--admin-bg-primary);">
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
        <aside class="w-64 border-r z-10 flex flex-col h-full relative" style="background-color: var(--admin-bg-sidebar); border-color: var(--admin-border);">
          
          <div class="h-20 border-b flex items-center justify-between px-5" style="border-color: var(--admin-border);">
            <a routerLink="/" class="flex items-center gap-3">
              <img src="assets/icons/logo-sysmico.png" alt="Sysmicon" class="w-9 h-9 object-contain" [style.filter]="theme() === 'dark' ? 'brightness(0) invert(1)' : 'none'">
              <span class="font-serif font-bold text-white">Sysmicon Admin</span>
            </a>
            <button (click)="toggleMenuMovil()" class="text-gray-400 text-lg font-bold">✕</button>
          </div>

          <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            <button (click)="setSeccion('inicio'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Dash Inicio</span>
            </button>
            <button (click)="setSeccion('analiticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span>Analíticas</span>
            </button>
            <button (click)="setSeccion('cad2'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <span class="flex items-center gap-3">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 0 3.4Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
                <span>CAD 2</span>
              </span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono" style="background-color: var(--admin-bg-primary); border: 1px solid var(--admin-border);">PRO</span>
            </button>
            <button (click)="setSeccion('estadisticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Estadísticas</span>
            </button>
            <button (click)="setSeccion('personalizar'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              <span>Personalizar Sitio</span>
            </button>
            <button (click)="setSeccion('usuarios'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Usuarios</span>
            </button>
            <button (click)="setSeccion('mensajes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Mensajes</span>
            </button>
            <button (click)="setSeccion('reportes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5" style="color: var(--admin-text-secondary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
              <span>Reportes</span>
            </button>
          </nav>

          <div class="p-4 border-t" style="border-color: var(--admin-border);">
            <a routerLink="/" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-bold text-xs" style="background-color: var(--admin-bg-input); color: var(--admin-text-primary);">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Regresar a Sysmicon</span>
            </a>
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

  readonly seccionActiva = signal<AdminSection>(
    (localStorage.getItem('sysmicon_admin_section') as AdminSection) || 'inicio'
  );
  readonly theme = signal<'light' | 'dark'>(
    (localStorage.getItem('sysmicon_admin_theme') as 'light' | 'dark') || 'dark'
  );
  readonly sidebarAbierto = signal<boolean>(true);
  readonly menuMovilAbierto = signal<boolean>(false);

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    localStorage.setItem('sysmicon_admin_theme', nextTheme);
  }

  setSeccion(seccion: AdminSection): void {
    this.seccionActiva.set(seccion);
    localStorage.setItem('sysmicon_admin_section', seccion);
    
    // Forzar scroll al inicio del contenedor de contenido principal y la ventana
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 10);
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

  async cerrarSesionAdmin(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
