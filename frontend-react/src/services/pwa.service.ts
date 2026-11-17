import { createSignal, useSignal } from '../core/signal';

class PwaService {
  private deferredPrompt: any = null;

  readonly canInstallNative = createSignal<boolean>(false);
  readonly isModalOpen = createSignal<boolean>(false);
  readonly isInstalled = createSignal<boolean>(false);

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
    const isMobileDevice = this.isIos() || this.isAndroid() || window.innerWidth < 768;
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

export const pwaService = new PwaService();

export function usePwaService() {
  const canInstallNative = useSignal(pwaService.canInstallNative);
  const isModalOpen = useSignal(pwaService.isModalOpen);
  const isInstalled = useSignal(pwaService.isInstalled);

  return {
    canInstallNative,
    isModalOpen,
    isInstalled,
    isIos: () => pwaService.isIos(),
    isAndroid: () => pwaService.isAndroid(),
    openInstallModal: () => pwaService.openInstallModal(),
    closeInstallModal: () => pwaService.closeInstallModal(),
    promptNativeInstall: () => pwaService.promptNativeInstall(),
  };
}
