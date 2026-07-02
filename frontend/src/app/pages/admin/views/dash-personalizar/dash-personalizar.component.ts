import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, CmsConfig } from '../../../../services/admin.service';

@Component({
  selector: 'app-dash-personalizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade">
      
      <!-- Encabezado de Sección -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 class="font-serif text-2xl font-bold text-white tracking-tight">Personalizar Sitio Web (CMS en Tiempo Real)</h2>
          <p class="text-xs text-gray-400 mt-1">Configura textos promocionales, información de contacto directa y alertas globales del portal.</p>
        </div>
        <button (click)="guardarConfiguracion()" 
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-lg scale-100 hover:scale-105 cursor-pointer">
          <span>✓ Guardar y Publicar Cambios</span>
        </button>
      </div>

      <!-- Alerta de éxito -->
      <div *ngIf="guardadoExitoso()" class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between animate-fade">
        <div class="flex items-center gap-2 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>¡Cambios publicados en vivo exitosamente! La configuración del sitio se ha actualizado.</span>
        </div>
        <button (click)="guardadoExitoso.set(false)" class="text-gray-400 hover:text-white font-bold">✕</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Formulario de Configuración (Col 1) -->
        <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 text-xs font-sans">
          <h3 class="font-serif text-lg font-bold text-white pb-2 border-b border-white/10">1. Textos Principales del Banner (Hero)</h3>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Tagline Superior (Hero) *</label>
            <input type="text" [(ngModel)]="formConfig.heroTagline" name="heroTagline"
                   class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Subtítulo Descriptivo (Hero) *</label>
            <textarea [(ngModel)]="formConfig.heroSubtagline" name="heroSubtagline" rows="2"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none"></textarea>
          </div>

          <h3 class="font-serif text-lg font-bold text-white pt-4 pb-2 border-b border-white/10">2. Información de Contacto y Redes</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Teléfono Directo *</label>
              <input type="text" [(ngModel)]="formConfig.telefonoContacto" name="telefono"
                     class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>
            <div>
              <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Email de Soporte / Arquitectura *</label>
              <input type="email" [(ngModel)]="formConfig.emailSoporte" name="email"
                     class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Cuenta de Instagram *</label>
            <input type="text" [(ngModel)]="formConfig.instagramHandle" name="instagram"
                   class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
          </div>

          <h3 class="font-serif text-lg font-bold text-white pt-4 pb-2 border-b border-white/10">3. Alerta Global en Vivo</h3>

          <div class="flex items-center gap-3 py-1">
            <input type="checkbox" [(ngModel)]="formConfig.mostrarBannerAlerta" id="chkBanner" name="mostrarBanner"
                   class="w-4 h-4 rounded bg-[#222] border-white/20 text-wood-accent focus:ring-0 cursor-pointer">
            <label for="chkBanner" class="text-white font-bold cursor-pointer">Activar Banner Superior de Anuncios</label>
          </div>

          <div *ngIf="formConfig.mostrarBannerAlerta">
            <label class="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1.5">Texto del Banner de Alerta *</label>
            <input type="text" [(ngModel)]="formConfig.textoBannerAlerta" name="textoBanner"
                   class="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white focus:border-wood-accent focus:outline-none">
          </div>

        </div>

        <!-- Previsualización en Vivo (Col 2) -->
        <div class="space-y-6">
          <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span class="text-xs font-bold uppercase tracking-wider text-wood-light flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-wood-accent animate-ping"></span>
                Previsualización del Banner
              </span>
              <span class="text-[10px] text-gray-500">Vista previa en tiempo real</span>
            </div>

            <!-- Muestra del Banner de Alerta -->
            <div *ngIf="formConfig.mostrarBannerAlerta" class="p-3 rounded-xl bg-wood-accent/20 border border-wood-accent/40 text-wood-light text-xs font-serif mb-4 flex items-center justify-between">
              <span>{{ formConfig.textoBannerAlerta }}</span>
              <span class="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded">ALERTA</span>
            </div>

            <!-- Muestra del Hero -->
            <div class="p-6 rounded-2xl bg-[#0A0D14] border border-white/5 space-y-3 text-center">
              <span class="inline-block px-3 py-1 rounded-full border border-black/10 bg-[#F8F8F8] text-black text-[10px] font-bold tracking-widest uppercase">
                {{ formConfig.heroTagline }}
              </span>
              <h4 class="font-serif text-2xl font-bold text-white">Construimos la Residencia <br/><span class="text-wood-light">de tus Sueños</span></h4>
              <p class="text-xs text-gray-400 max-w-sm mx-auto">{{ formConfig.heroSubtagline }}</p>
            </div>
          </div>

          <!-- Muestra de Contacto -->
          <div class="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            <h4 class="font-serif text-sm font-bold text-white uppercase tracking-wider text-gray-400">Canales Directos en Footer</h4>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between p-2.5 rounded-lg bg-[#161616]">
                <span class="text-gray-400">Teléfono:</span>
                <span class="text-white font-bold">{{ formConfig.telefonoContacto }}</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-[#161616]">
                <span class="text-gray-400">Correo Electrónico:</span>
                <span class="text-white font-bold">{{ formConfig.emailSoporte }}</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-[#161616]">
                <span class="text-gray-400">Instagram:</span>
                <span class="text-wood-light font-bold">{{ formConfig.instagramHandle }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashPersonalizarComponent {
  readonly adminService = inject(AdminService);
  readonly guardadoExitoso = signal<boolean>(false);

  formConfig: CmsConfig = { ...this.adminService.cmsConfig() };

  guardarConfiguracion(): void {
    this.adminService.actualizarCms(this.formConfig);
    this.guardadoExitoso.set(true);
    setTimeout(() => {
      this.guardadoExitoso.set(false);
    }, 4000);
  }
}
