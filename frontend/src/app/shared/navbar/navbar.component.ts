import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BRAND_CONFIG, NAV_LINKS } from '../../core/app.constants';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly brandName = BRAND_CONFIG.name;
  readonly navLinks = NAV_LINKS;

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly currentLang = signal<'ES' | 'EN'>('ES');

  constructor() {}

  setLang(lang: 'ES' | 'EN'): void {
    this.currentLang.set(lang);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
      document.body.style.overflow = '';
    }
  }

  onNavLinkClick(link: { label: string; path: string }): void {
    this.closeMobileMenu();
  }
}
