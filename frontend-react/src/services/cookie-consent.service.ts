import { createSignal, useSignal } from '../core/signal';

class CookieConsentService {
  private readonly STORAGE_KEY = 'app_cookie_consent_v1';

  readonly isVisible = createSignal<boolean>(true);
  readonly showModal = createSignal<boolean>(false);

  constructor() {
    this.checkConsent();
    if (typeof window !== 'undefined') {
      window.addEventListener('open-cookie-consent', () => this.openModal());
      (window as any).openCookieConsent = () => this.openModal();
      (window as any).resetCookieConsent = () => this.resetConsent();
    }
  }

  checkConsent(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          this.isVisible.set(false);
        } else {
          this.isVisible.set(true);
        }
      } else {
        this.isVisible.set(true);
      }
    } catch {
      this.isVisible.set(true);
    }
  }

  openBanner(): void {
    this.isVisible.set(true);
  }

  openModal(): void {
    this.isVisible.set(true);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  hideBanner(): void {
    this.isVisible.set(false);
    this.showModal.set(false);
  }

  resetConsent(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {}
    this.isVisible.set(true);
    this.showModal.set(true);
  }
}

export const cookieConsentService = new CookieConsentService();

export function useCookieConsentService() {
  const isVisible = useSignal(cookieConsentService.isVisible);
  const showModal = useSignal(cookieConsentService.showModal);
  return {
    isVisible,
    showModal,
    checkConsent: () => cookieConsentService.checkConsent(),
    openBanner: () => cookieConsentService.openBanner(),
    openModal: () => cookieConsentService.openModal(),
    closeModal: () => cookieConsentService.closeModal(),
    hideBanner: () => cookieConsentService.hideBanner(),
    resetConsent: () => cookieConsentService.resetConsent(),
  };
}
