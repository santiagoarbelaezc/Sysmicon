import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieConsentService } from '../../services/cookie-consent.service';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp?: string;
}

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.css'
})
export class CookieConsentComponent implements OnInit {
  private readonly STORAGE_KEY = 'app_cookie_consent_v1';
  readonly consentService = inject(CookieConsentService);

  activeTab: 'preferences' | 'legal' = 'preferences';

  preferences: CookiePreferences = {
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false
  };

  get isVisible(): boolean {
    return this.consentService.isVisible();
  }

  get showModal(): boolean {
    return this.consentService.showModal();
  }

  ngOnInit(): void {
    this.consentService.checkConsent();
    this.loadSavedPreferences();
  }

  loadSavedPreferences(): void {
    try {
      const savedConsent = localStorage.getItem(this.STORAGE_KEY);
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        this.preferences = {
          necessary: true,
          analytics: !!parsed.analytics,
          preferences: !!parsed.preferences,
          marketing: !!parsed.marketing
        };
      }
    } catch (e) {
      console.warn('Error reading cookie consent from localStorage:', e);
    }
  }

  acceptAll(): void {
    this.preferences = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true
    };
    this.persistAndClose();
  }

  acceptEssential(): void {
    this.preferences = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false
    };
    this.persistAndClose();
  }

  saveCustomPreferences(): void {
    this.preferences.necessary = true;
    this.persistAndClose();
  }

  openModal(): void {
    this.consentService.openModal();
  }

  closeModal(): void {
    this.consentService.closeModal();
  }

  setTab(tab: 'preferences' | 'legal'): void {
    this.activeTab = tab;
  }

  private persistAndClose(): void {
    try {
      const dataToSave: CookiePreferences = {
        ...this.preferences,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving cookie consent to localStorage:', e);
    }
    this.consentService.hideBanner();
  }
}
