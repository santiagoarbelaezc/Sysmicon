import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG, NAV_LINKS } from '../../core/app.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly brandName = BRAND_CONFIG.name;
  readonly navLinks = NAV_LINKS;

  readonly isScrolled = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(currentScroll > 30);
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
}
