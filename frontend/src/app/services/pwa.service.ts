import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  
  readonly canInstallNative = signal<boolean>(false);
  readonly isModalOpen = signal<boolean>(false);
  readonly isInstalled = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkIfInstalled();

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.canInstallNative.set(true);
      });

      window.addEventListener('appinstalled', () => {
        this.isInstalled.set(true);
        this.canInstallNative.set(false);
        this.deferredPrompt = null;
      });

      // Lanzar aviso automático en móviles si no está instalada la PWA
      this.autoPromptMobileIfUninstalled();
    }
  }

  private checkIfInstalled(): void {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone === true;
      this.isInstalled.set(isStandalone);
    }
  }

  autoPromptMobileIfUninstalled(): void {
    if (typeof window === 'undefined') return;

    // Detectar si es dispositivo móvil por UserAgent o resolución
    const isMobileDevice = this.isIos() || this.isAndroid() || window.innerWidth < 768;

    // Si es dispositivo móvil y la app NO está instalada en modo standalone, abrir modal automáticamente
    if (isMobileDevice && !this.isInstalled()) {
      setTimeout(() => {
        this.openInstallModal();
      }, 1200);
    }
  }

  isIos(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  }

  isAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android/.test(window.navigator.userAgent);
  }

  openInstallModal(): void {
    this.isModalOpen.set(true);
  }

  closeInstallModal(): void {
    this.isModalOpen.set(false);
  }

  async promptNativeInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      this.openInstallModal();
      return false;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      this.canInstallNative.set(false);
      this.deferredPrompt = null;
      return true;
    }
    return false;
  }
}
