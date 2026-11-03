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
  template: `
    <div class="min-h-screen flex overflow-hidden font-sans bg-[#fafafa] text-neutral-900 selection:bg-neutral-950 selection:text-white">
      
      <!-- =====================================================
           SIDEBAR MONOCROMÁTICO (TIPOGRAFÍA AMPLIA Y MAYÚSCULAS)
           ===================================================== -->
      <aside [ngClass]="sidebarAbierto() ? 'w-72' : 'w-24'" 
             class="hidden lg:flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 z-30 shrink-0 select-none relative font-sans">
        
        <!-- Header del Sidebar con Logo Institucional -->
        <div class="h-24 border-b border-neutral-200 flex items-center justify-between px-6">
          <a routerLink="/" class="flex items-center gap-3.5 overflow-hidden group">
            <div class="w-12 h-12 rounded-2xl bg-neutral-950 flex items-center justify-center text-white shrink-0 font-serif font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div *ngIf="sidebarAbierto()" class="flex flex-col animate-fade-in">
              <span class="font-serif font-black text-xl tracking-[0.18em] text-neutral-950 uppercase leading-none">SYSMICON</span>
              <span class="text-xs uppercase tracking-[0.25em] font-mono font-bold text-neutral-400 mt-1.5">STUDIO ADMIN</span>
            </div>
          </a>
          <button (click)="toggleSidebar()" 
                  class="p-2.5 rounded-xl transition-colors text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
                  [title]="sidebarAbierto() ? 'Colapsar menú' : 'Expandir menú'">
            <svg class="w-5 h-5 transition-transform" [class.rotate-180]="!sidebarAbierto()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Menú de Navegación Organizado -->
        <nav class="flex-1 py-8 px-4 space-y-7 overflow-y-auto scrollbar-thin">
          
          <!-- SECCIÓN: NAVEGACIÓN PRINCIPAL -->
          <div class="space-y-2">
            <span *ngIf="sidebarAbierto()" class="px-3.5 font-mono text-xs font-black tracking-[0.25em] uppercase block mb-3 text-neutral-400">
              CONSOLA DE CONTROL
            </span>

            <!-- 1. Inicio -->
            <button (click)="setSeccion('inicio')"
                    [ngClass]="seccionActiva() === 'inicio' 
                      ? 'bg-neutral-950 text-white shadow-sm font-bold' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'"
                    class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate tracking-wider uppercase">INICIO</span>
            </button>

            <!-- 2. Analíticas -->
            <button (click)="setSeccion('analiticas')"
                    [ngClass]="seccionActiva() === 'analiticas' 
                      ? 'bg-neutral-950 text-white shadow-sm font-bold' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'"
                    class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate tracking-wider uppercase">ANALÍTICAS</span>
            </button>

            <!-- 3. Mensajes & Cotizaciones -->
            <button (click)="setSeccion('mensajes')"
                    [ngClass]="seccionActiva() === 'mensajes' 
                      ? 'bg-neutral-950 text-white shadow-sm font-bold' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'"
                    class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full tracking-wider uppercase">
                <span>MENSAJES</span>
                <span *ngIf="countMensajesSinLeer() > 0" 
                      [ngClass]="seccionActiva() === 'mensajes' ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'"
                      class="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono transition-colors shadow-xs">
                  {{ countMensajesSinLeer() }}
                </span>
              </span>
            </button>

            <!-- 4. Usuarios -->
            <button (click)="setSeccion('usuarios')"
                    [ngClass]="seccionActiva() === 'usuarios' 
                      ? 'bg-neutral-950 text-white shadow-sm font-bold' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'"
                    class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate flex items-center justify-between w-full tracking-wider uppercase">
                <span>USUARIOS</span>
                <span [ngClass]="seccionActiva() === 'usuarios' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'"
                      class="text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                  {{ adminService.usuarios().length }}
                </span>
              </span>
            </button>

            <!-- 5. Configuración (Personalizar) -->
            <button (click)="setSeccion('personalizar')"
                    [ngClass]="seccionActiva() === 'personalizar' 
                      ? 'bg-neutral-950 text-white shadow-sm font-bold' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 font-semibold'"
                    class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all cursor-pointer group">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate tracking-wider uppercase">CONFIGURACIÓN</span>
            </button>

          </div>

          <!-- SECCIÓN: ACCIONES Y SALIDA -->
          <div class="space-y-2 pt-6 border-t border-neutral-200">
            <span *ngIf="sidebarAbierto()" class="px-3.5 font-mono text-xs font-black tracking-[0.25em] uppercase block mb-3 text-neutral-400">
              SITIO PÚBLICO
            </span>

            <a routerLink="/" 
               class="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all group uppercase tracking-wider">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate">VER SITIO WEB</span>
            </a>

            <button (click)="cerrarSesionAdmin()"
                    class="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50/80 transition-all group cursor-pointer uppercase tracking-wider">
              <svg class="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span *ngIf="sidebarAbierto()" class="truncate">CERRAR SESIÓN</span>
            </button>
          </div>

        </nav>

        <!-- Footer Sidebar con Versión -->
        <div *ngIf="sidebarAbierto()" class="p-5 border-t border-neutral-200 text-center font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold">
          SYSMICON PORTAL • v2.4
        </div>

      </aside>

      <!-- =====================================================
           CONTENEDOR PRINCIPAL DERECHA (HEADER + VISTAS)
           ===================================================== -->
      <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <!-- TOP NAVBAR ADMIN (BREADCRUMB & ACCIONES TOP) -->
        <header class="h-24 border-b border-neutral-200 bg-white px-6 sm:px-12 flex items-center justify-between gap-6 shrink-0 z-20 relative font-sans">
          
          <!-- Migas de Pan (Breadcrumbs) & Botón Móvil -->
          <div class="flex items-center gap-5">
            <button (click)="toggleMenuMovil()" class="lg:hidden p-3 rounded-xl text-lg border border-neutral-200 bg-neutral-50 text-neutral-900 cursor-pointer hover:bg-neutral-100">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            <!-- Breadcrumbs Estilo Arquitectónico con Letras Claras -->
            <div class="flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-wider">
              <span class="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-950 transition-colors" (click)="setSeccion('inicio')">
                <span>CONSOLA</span>
              </span>
              <span class="text-neutral-300 font-light">/</span>
              <span class="text-neutral-950 font-black tracking-widest text-sm sm:text-base">
                {{ seccionActiva() === 'personalizar' ? 'CONFIGURACIÓN Y CMS' : (seccionActiva() | uppercase) }}
              </span>
            </div>
          </div>

          <!-- Acciones Derecha (Ver Sitio en Vivo + Perfil) -->
          <div class="flex items-center gap-5">
            
            <!-- Botón Destacado: VER SITIO EN VIVO -->
            <a routerLink="/" 
               class="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-950 hover:bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:scale-105 cursor-pointer whitespace-nowrap">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VER SITIO EN VIVO</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>

            <!-- Perfil Admin Monocromático -->
            <div class="flex items-center gap-3.5 pl-5 border-l border-neutral-200">
              <div class="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-serif font-black text-base shadow-sm">
                AD
              </div>
              <div class="hidden sm:block text-left">
                <span class="text-sm font-black text-neutral-950 block leading-tight uppercase tracking-wider">ADMINISTRADOR</span>
                <span class="text-xs font-mono font-bold text-neutral-400 block mt-0.5 uppercase tracking-wider">DIRECTOR GENERAL</span>
              </div>
            </div>

          </div>

        </header>

        <!-- ÁREA DE CONTENIDO (ADAPTABLE SIN SCROLL EXTERNO EN MENSAJES) -->
        <main [ngClass]="seccionActiva() === 'mensajes' ? 'flex-1 overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col min-h-0 bg-[#fafafa]' : 'flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 scrollbar-thin bg-[#fafafa]'">
          <div [ngClass]="seccionActiva() === 'mensajes' ? 'max-w-[1750px] w-full mx-auto h-full flex flex-col flex-1 min-h-0' : 'max-w-[1750px] mx-auto pb-20'">
            
            <!-- RENDER DE LAS 5 SECCIONES ACTIVAS -->
            <app-dash-inicio *ngIf="seccionActiva() === 'inicio'"></app-dash-inicio>
            <app-dash-analiticas *ngIf="seccionActiva() === 'analiticas'"></app-dash-analiticas>
            <app-dash-personalizar *ngIf="seccionActiva() === 'personalizar'"></app-dash-personalizar>
            <app-dash-usuarios *ngIf="seccionActiva() === 'usuarios'"></app-dash-usuarios>
            <app-dash-mensajes *ngIf="seccionActiva() === 'mensajes'" class="h-full flex flex-col flex-1 min-h-0"></app-dash-mensajes>

          </div>
        </main>

      </div>

      <!-- DRAWER MÓVIL MONOCROMÁTICO -->
      <div *ngIf="menuMovilAbierto()" class="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
        <div (click)="toggleMenuMovil()" class="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
        <aside class="w-72 border-r border-neutral-200 bg-white z-10 flex flex-col h-full relative font-sans">
          
          <div class="h-24 border-b border-neutral-200 flex items-center justify-between px-6">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold text-base">S</div>
              <span class="font-serif font-black text-base text-neutral-950 uppercase tracking-widest">SYSMICON ADMIN</span>
            </div>
            <button (click)="toggleMenuMovil()" class="text-neutral-400 hover:text-neutral-950 font-bold text-xl p-2">✕</button>
          </div>

          <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <button (click)="setSeccion('inicio'); toggleMenuMovil()" 
                    [ngClass]="seccionActiva() === 'inicio' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 font-semibold'"
                    class="w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider">
              <span>INICIO</span>
            </button>
            <button (click)="setSeccion('analiticas'); toggleMenuMovil()" 
                    [ngClass]="seccionActiva() === 'analiticas' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 font-semibold'"
                    class="w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider">
              <span>ANALÍTICAS</span>
            </button>
            <button (click)="setSeccion('mensajes'); toggleMenuMovil()" 
                    [ngClass]="seccionActiva() === 'mensajes' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 font-semibold'"
                    class="w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider">
              <span>MENSAJES</span>
            </button>
            <button (click)="setSeccion('usuarios'); toggleMenuMovil()" 
                    [ngClass]="seccionActiva() === 'usuarios' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 font-semibold'"
                    class="w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider">
              <span>USUARIOS</span>
            </button>
            <button (click)="setSeccion('personalizar'); toggleMenuMovil()" 
                    [ngClass]="seccionActiva() === 'personalizar' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100 font-semibold'"
                    class="w-full text-left px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3.5 transition-colors uppercase tracking-wider">
              <span>CONFIGURACIÓN</span>
            </button>
          </nav>

          <div class="p-6 border-t border-neutral-200">
            <a routerLink="/" class="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-neutral-950 text-white font-bold text-sm uppercase tracking-wider">
              <span>REGRESAR AL SITIO WEB</span>
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
  readonly sidebarAbierto = signal<boolean>(true);
  readonly menuMovilAbierto = signal<boolean>(false);

  ngOnInit(): void {
    this.adminService.cargarDatosReales();
  }

  private getInitialSection(): AdminSection {
    const saved = localStorage.getItem('sysmicon_admin_section') as AdminSection;
    const validSections: AdminSection[] = ['inicio', 'analiticas', 'personalizar', 'usuarios', 'mensajes'];
    return validSections.includes(saved) ? saved : 'inicio';
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

