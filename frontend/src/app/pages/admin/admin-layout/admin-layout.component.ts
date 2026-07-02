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
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate">Dash Inicio</span>
          </button>

          <!-- 2. Analíticas -->
          <button (click)="setSeccion('analiticas')"
                  [ngClass]="seccionActiva() === 'analiticas' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate">Analíticas</span>
          </button>

          <!-- 3. CAD 2 -->
          <button (click)="setSeccion('cad2')"
                  [ngClass]="seccionActiva() === 'cad2' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 0 3.4Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>CAD 2</span>
              <span class="bg-blue-500/20 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </span>
          </button>

          <!-- 4. Estadísticas -->
          <button (click)="setSeccion('estadisticas')"
                  [ngClass]="seccionActiva() === 'estadisticas' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate">Estadísticas</span>
          </button>

          <!-- 5. Personalizar Sitio -->
          <button (click)="setSeccion('personalizar')"
                  [ngClass]="seccionActiva() === 'personalizar' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate">Personalizar Sitio</span>
          </button>

          <!-- 6. Usuarios -->
          <button (click)="setSeccion('usuarios')"
                  [ngClass]="seccionActiva() === 'usuarios' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>Usuarios</span>
              <span class="bg-white/10 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">{{ adminService.usuarios().length }}</span>
            </span>
          </button>

          <!-- 7. Mensajes -->
          <button (click)="setSeccion('mensajes')"
                  [ngClass]="seccionActiva() === 'mensajes' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full">
              <span>Mensajes</span>
              <span *ngIf="countMensajesSinLeer() > 0" class="bg-emerald-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">{{ countMensajesSinLeer() }}</span>
            </span>
          </button>

          <!-- 8. Reportes -->
          <button (click)="setSeccion('reportes')"
                  [ngClass]="seccionActiva() === 'reportes' ? 'bg-wood-accent text-[#111] font-bold shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs transition-all cursor-pointer group">
            <svg class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            <span *ngIf="sidebarAbierto()" class="truncate">Reportes</span>
          </button>

        </nav>

        <!-- Footer Sidebar (Regresar al sitio) -->
        <div class="p-4 border-t border-white/10">
          <a routerLink="/" 
             class="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs transition-colors group">
            <svg class="w-4 h-4 shrink-0 text-wood-light group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
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
            <svg class="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Buscar en el portal o catálogo..." 
                   class="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161616] border border-white/10 text-white text-xs placeholder-gray-500 focus:border-wood-accent focus:outline-none">
          </div>

          <!-- Acciones Derecha (Notificaciones & Perfil) -->
          <div class="flex items-center gap-4">
            
            <button (click)="setSeccion('mensajes')" title="Notificaciones" class="relative p-2.5 rounded-xl bg-[#161616] border border-white/10 text-gray-300 hover:text-white hover:border-wood-accent/50 transition-all group">
              <svg class="w-4 h-4 text-gray-300 group-hover:text-wood-light transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
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
              <button (click)="cerrarSesionAdmin()" title="Cerrar sesión o salir del Admin" class="text-gray-400 hover:text-red-400 ml-1 p-1 rounded hover:bg-white/5 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Dash Inicio</span>
            </button>
            <button (click)="setSeccion('analiticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span>Analíticas</span>
            </button>
            <button (click)="setSeccion('cad2'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between text-gray-300 hover:bg-white/5">
              <span class="flex items-center gap-3">
                <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 0 3.4Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
                <span>CAD 2</span>
              </span>
              <span class="bg-blue-500/20 text-blue-300 text-[9px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </button>
            <button (click)="setSeccion('estadisticas'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Estadísticas</span>
            </button>
            <button (click)="setSeccion('personalizar'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              <span>Personalizar Sitio</span>
            </button>
            <button (click)="setSeccion('usuarios'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Usuarios</span>
            </button>
            <button (click)="setSeccion('mensajes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Mensajes</span>
            </button>
            <button (click)="setSeccion('reportes'); toggleMenuMovil()" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-300 hover:bg-white/5">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
              <span>Reportes</span>
            </button>
          </nav>

          <div class="p-4 border-t border-white/10">
            <a routerLink="/" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs">
              <svg class="w-4 h-4 shrink-0 text-wood-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
