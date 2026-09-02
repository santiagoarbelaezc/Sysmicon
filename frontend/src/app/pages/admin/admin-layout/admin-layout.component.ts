import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

// Importación de las 5 vistas activas
import { DashInicioComponent } from '../views/dash-inicio/dash-inicio.component';
import { DashAnaliticasComponent } from '../views/dash-analiticas/dash-analiticas.component';
import { DashPersonalizarComponent } from '../views/dash-personalizar/dash-personalizar.component';
import { DashUsuariosComponent } from '../views/dash-usuarios/dash-usuarios.component';
import { DashMensajesComponent } from '../views/dash-mensajes/dash-mensajes.component';

export type AdminSection = 'inicio' | 'analiticas' | 'personalizar' | 'usuarios' | 'mensajes';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashInicioComponent,
    DashAnaliticasComponent,
    DashPersonalizarComponent,
    DashUsuariosComponent,
    DashMensajesComponent
  ],
  styles: [`
    :host {
      --admin-bg: #fbfbfb;
      --admin-sidebar-bg: #ffffff;
      --admin-header-bg: #ffffff;
      --admin-card-bg: #ffffff;
      --admin-border: #e2e8f0;
      --admin-text-main: #0f172a;
      --admin-text-muted: #64748b;
      --admin-text-sub: #94a3b8;
      --admin-active-bg: #000000;
      --admin-active-text: #ffffff;
      --admin-hover-bg: #f1f5f9;
      --admin-input-bg: #f8fafc;
    }

    .dark-admin {
      --admin-bg: #09090b;
      --admin-sidebar-bg: #0d0d10;
      --admin-header-bg: #0d0d10;
      --admin-card-bg: #131316;
      --admin-border: #27272a;
      --admin-text-main: #f8fafc;
      --admin-text-muted: #a1a1aa;
      --admin-text-sub: #71717a;
      --admin-active-bg: #ffffff;
      --admin-active-text: #09090b;
      --admin-hover-bg: #1c1c22;
      --admin-input-bg: #18181b;
    }
  `],
  template: `
    <div [class]="'min-h-screen flex overflow-hidden font-sans ' + (theme() === 'dark' ? 'dark-admin' : '')"
         style="background-color: var(--admin-bg); color: var(--admin-text-main);">
      
      <!-- =====================================================
           SIDEBAR MODERNO & MINIMALISTA (TEMA CLARO ELEGANTE)
           ===================================================== -->
      <aside [ngClass]="sidebarAbierto() ? 'w-64' : 'w-20'" 
             class="hidden lg:flex flex-col border-r transition-all duration-300 z-30 shrink-0 select-none relative font-sans"
             style="background-color: var(--admin-sidebar-bg); border-color: var(--admin-border);">
        
        <!-- Header del Sidebar con Logo -->
        <div class="h-20 border-b flex items-center justify-between px-5" style="border-color: var(--admin-border);">
          <a routerLink="/" class="flex items-center gap-3 overflow-hidden group">
            <div class="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shrink-0 font-serif font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div *ngIf="sidebarAbierto()" class="flex flex-col animate-fade">
              <span class="font-serif font-black text-lg tracking-wider" style="color: var(--admin-text-main);">SYSMICON</span>
              <span class="text-[9px] uppercase tracking-[0.2em] font-mono font-bold" style="color: var(--admin-text-sub);">Studio Admin</span>
            </div>
          </a>
          <button (click)="toggleSidebar()" 
                  class="p-1.5 rounded-lg transition-colors text-xs cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  style="color: var(--admin-text-muted);">
            {{ sidebarAbierto() ? '◀' : '▶' }}
          </button>
        </div>

        <!-- Menú de Navegación Organizado por Categorías -->
        <nav class="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-thin">
          
          <!-- SECCIÓN: PRINCIPAL -->
          <div class="space-y-1.5">
            <span *ngIf="sidebarAbierto()" class="px-3 font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style="color: var(--admin-text-sub);">
              PRINCIPAL
            </span>

            <!-- 1. Inicio -->
            <button (click)="setSeccion('inicio')"
                    [style.backgroundColor]="seccionActiva() === 'inicio' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'inicio' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group font-semibold shadow-2xs hover:scale-[1.01]">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate font-sans font-bold">Inicio</span>
            </button>

            <!-- 2. Analíticas -->
            <button (click)="setSeccion('analiticas')"
                    [style.backgroundColor]="seccionActiva() === 'analiticas' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'analiticas' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group font-semibold shadow-2xs hover:scale-[1.01]">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate font-sans font-bold">Analíticas</span>
            </button>

            <!-- 3. Mensajes -->
            <button (click)="setSeccion('mensajes')"
                    [style.backgroundColor]="seccionActiva() === 'mensajes' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'mensajes' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group font-semibold shadow-2xs hover:scale-[1.01]">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full font-sans font-bold">
                <span>Mensajes</span>
                <span *ngIf="countMensajesSinLeer() > 0" class="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono" [style.backgroundColor]="seccionActiva() === 'mensajes' ? '#ffffff' : '#000000'" [style.color]="seccionActiva() === 'mensajes' ? '#000000' : '#ffffff'">
                  {{ countMensajesSinLeer() }}
                </span>
              </span>
            </button>

            <!-- 4. Usuarios -->
            <button (click)="setSeccion('usuarios')"
                    [style.backgroundColor]="seccionActiva() === 'usuarios' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'usuarios' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group font-semibold shadow-2xs hover:scale-[1.01]">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full font-sans font-bold">
                <span>Usuarios</span>
                <span class="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold" style="background-color: var(--admin-input-bg); color: var(--admin-text-muted); border: 1px solid var(--admin-border);">
                  {{ adminService.usuarios().length }}
                </span>
              </span>
            </button>

            <!-- 5. Configuración (Personalizar) -->
            <button (click)="setSeccion('personalizar')"
                    [style.backgroundColor]="seccionActiva() === 'personalizar' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'personalizar' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer group font-semibold shadow-2xs hover:scale-[1.01]">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate font-sans font-bold">Configuración</span>
            </button>

          </div>

          <!-- SECCIÓN: ACCIONES Y SALIDA -->
          <div class="space-y-1.5 pt-4 border-t" style="border-color: var(--admin-border);">
            <span *ngIf="sidebarAbierto()" class="px-3 font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style="color: var(--admin-text-sub);">
              ACCIONES
            </span>

            <a routerLink="/" 
               class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group hover:bg-neutral-100 dark:hover:bg-neutral-800"
               style="color: var(--admin-text-muted);">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate font-sans font-bold">Ver Sitio Web</span>
            </a>

            <button (click)="cerrarSesionAdmin()"
                    class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-neutral-500 cursor-pointer">
              <svg class="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate font-sans font-bold">Cerrar Sesión</span>
            </button>
          </div>

        </nav>

        <!-- Footer Sidebar con Versión -->
        <div *ngIf="sidebarAbierto()" class="p-4 border-t text-center font-mono text-[10px] uppercase tracking-wider" style="border-color: var(--admin-border); color: var(--admin-text-sub);">
          Sysmicon Portal v2.4
        </div>

      </aside>

      <!-- =====================================================
           CONTENEDOR PRINCIPAL DERECHA (TOP NAVBAR + CONTENIDO)
           ===================================================== -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- TOP NAVBAR ADMIN (BREADCRUMB & ACCIONES TOP) -->
        <header class="h-20 border-b px-6 sm:px-10 flex items-center justify-between gap-4 shrink-0 z-20 relative font-sans"
                style="background-color: var(--admin-header-bg); border-color: var(--admin-border);">
          
          <!-- Migas de Pan (Breadcrumbs) & Botón Móvil -->
          <div class="flex items-center gap-4">
            <button (click)="toggleMenuMovil()" class="lg:hidden p-2 rounded-lg text-lg border cursor-pointer" style="border-color: var(--admin-border); background-color: var(--admin-input-bg); color: var(--admin-text-main);">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            <!-- Breadcrumbs Estilo Referencia -->
            <div class="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider">
              <span class="flex items-center gap-2 cursor-pointer hover:opacity-75" (click)="setSeccion('inicio')" style="color: var(--admin-text-muted);">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <span>CONSOLA</span>
              </span>
              <span style="color: var(--admin-text-sub);">&gt;</span>
              <span class="font-extrabold" style="color: var(--admin-text-main);">
                {{ seccionActiva() === 'personalizar' ? 'CONFIGURACIÓN' : (seccionActiva() | uppercase) }}
              </span>
            </div>
          </div>

          <!-- Acciones Derecha (Ver Sitio en Vivo + Selector de Tema + Perfil) -->
          <div class="flex items-center gap-3 sm:gap-4">
            
            <!-- Botón Destacado: VER SITIO EN VIVO -->
            <a routerLink="/" 
               class="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-black text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm hover:scale-105 cursor-pointer whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VER SITIO EN VIVO</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>

            <!-- Selector de Tema Claro / Oscuro -->
            <button (click)="toggleTheme()" [title]="theme() === 'dark' ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro'" 
                    class="p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                    style="background-color: var(--admin-input-bg); border-color: var(--admin-border); color: var(--admin-text-main);">
              <!-- Icono Sol (si está oscuro) -->
              <svg *ngIf="theme() === 'dark'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <!-- Icono Luna (si está claro) -->
              <svg *ngIf="theme() === 'light'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>

            <!-- Perfil Admin -->
            <div class="flex items-center gap-3 pl-3 border-l" style="border-color: var(--admin-border);">
              <div class="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-serif font-black text-sm shadow-xs">
                AD
              </div>
              <div class="hidden xl:block text-left">
                <span class="text-xs font-bold block leading-tight" style="color: var(--admin-text-main);">Administrador Sysmicon</span>
                <span class="text-[10px] font-mono font-semibold block" style="color: var(--admin-text-muted);">Director General</span>
              </div>
            </div>

          </div>

        </header>

        <!-- ÁREA DE CONTENIDO (ADAPTABLE SIN SCROLL EXTERNO EN MENSAJES) -->
        <main [ngClass]="seccionActiva() === 'mensajes' ? 'flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 flex flex-col min-h-0' : 'flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12 scrollbar-thin'" 
              style="background-color: var(--admin-bg);">
          <div [ngClass]="seccionActiva() === 'mensajes' ? 'max-w-[1680px] w-full mx-auto h-full flex flex-col flex-1 min-h-0' : 'max-w-[1680px] mx-auto pb-16'">
            
            <!-- RENDER DE LAS 5 SECCIONES ACTIVAS -->
            <app-dash-inicio *ngIf="seccionActiva() === 'inicio'"></app-dash-inicio>
            <app-dash-analiticas *ngIf="seccionActiva() === 'analiticas'"></app-dash-analiticas>
            <app-dash-personalizar *ngIf="seccionActiva() === 'personalizar'"></app-dash-personalizar>
            <app-dash-usuarios *ngIf="seccionActiva() === 'usuarios'"></app-dash-usuarios>
            <app-dash-mensajes *ngIf="seccionActiva() === 'mensajes'" class="h-full flex flex-col flex-1 min-h-0"></app-dash-mensajes>

          </div>
        </main>

      </div>

      <!-- DRAWER MÓVIL -->
      <div *ngIf="menuMovilAbierto()" class="fixed inset-0 z-50 lg:hidden flex animate-fade">
        <div (click)="toggleMenuMovil()" class="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
        <aside class="w-64 border-r z-10 flex flex-col h-full relative font-sans" style="background-color: var(--admin-sidebar-bg); border-color: var(--admin-border);">
          
          <div class="h-20 border-b flex items-center justify-between px-5" style="border-color: var(--admin-border);">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">S</div>
              <span class="font-serif font-bold text-sm" style="color: var(--admin-text-main);">Sysmicon Admin</span>
            </div>
            <button (click)="toggleMenuMovil()" class="text-neutral-400 hover:text-black font-bold text-lg p-1">✕</button>
          </div>

          <nav class="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
            <button (click)="setSeccion('inicio'); toggleMenuMovil()" 
                    [style.backgroundColor]="seccionActiva() === 'inicio' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'inicio' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3">
              <span>Inicio</span>
            </button>
            <button (click)="setSeccion('analiticas'); toggleMenuMovil()" 
                    [style.backgroundColor]="seccionActiva() === 'analiticas' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'analiticas' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3">
              <span>Analíticas</span>
            </button>
            <button (click)="setSeccion('mensajes'); toggleMenuMovil()" 
                    [style.backgroundColor]="seccionActiva() === 'mensajes' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'mensajes' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3">
              <span>Mensajes</span>
            </button>
            <button (click)="setSeccion('usuarios'); toggleMenuMovil()" 
                    [style.backgroundColor]="seccionActiva() === 'usuarios' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'usuarios' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3">
              <span>Usuarios</span>
            </button>
            <button (click)="setSeccion('personalizar'); toggleMenuMovil()" 
                    [style.backgroundColor]="seccionActiva() === 'personalizar' ? 'var(--admin-active-bg)' : 'transparent'"
                    [style.color]="seccionActiva() === 'personalizar' ? 'var(--admin-active-text)' : 'var(--admin-text-muted)'"
                    class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3">
              <span>Configuración</span>
            </button>
          </nav>

          <div class="p-4 border-t" style="border-color: var(--admin-border);">
            <a routerLink="/" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs">
              <span>Regresar al Sitio</span>
            </a>
          </div>
        </aside>
      </div>

    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly adminService = inject(AdminService);
  readonly router = inject(Router);

  readonly seccionActiva = signal<AdminSection>(
    this.getInitialSection()
  );
  readonly theme = signal<'light' | 'dark'>(
    (localStorage.getItem('sysmicon_admin_theme') as 'light' | 'dark') || 'light'
  );
  readonly sidebarAbierto = signal<boolean>(true);
  readonly menuMovilAbierto = signal<boolean>(false);

  ngOnInit(): void {
    // Sincronizar datos reales desde el Backend PHP
    this.adminService.cargarDatosReales();
  }

  private getInitialSection(): AdminSection {
    const saved = localStorage.getItem('sysmicon_admin_section') as AdminSection;
    const validSections: AdminSection[] = ['inicio', 'analiticas', 'personalizar', 'usuarios', 'mensajes'];
    return validSections.includes(saved) ? saved : 'personalizar';
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    localStorage.setItem('sysmicon_admin_theme', nextTheme);
  }

  setSeccion(seccion: AdminSection): void {
    this.seccionActiva.set(seccion);
    localStorage.setItem('sysmicon_admin_section', seccion);
    
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
