import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly STORAGE_KEY = 'app_cookie_consent_v1';

  readonly isVisible = signal<boolean>(true);
  readonly showModal = signal<boolean>(false);

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
    } catch (e) {
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
    } catch (e) {}
    this.isVisible.set(true);
    this.showModal.set(true);
  }
}
