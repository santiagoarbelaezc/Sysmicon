import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly brandName = BRAND_CONFIG.name;
  readonly navLinks = NAV_LINKS;

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isScrolled = signal<boolean>(false);
  readonly isHoveredTop = signal<boolean>(false);
  readonly currentLang = signal<'ES' | 'EN'>('ES');

  constructor() {}

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (event.clientY <= 75) {
      this.isHoveredTop.set(true);
    } else if (event.clientY > 110) {
      this.isHoveredTop.set(false);
    }
  }

  private checkScroll(): void {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 40);
  }

  get isNavbarVisible(): boolean {
    if (this.isMobileMenuOpen()) return true;
    if (this.router.url !== '/' && this.router.url !== '') return true;
    return this.isScrolled() || this.isHoveredTop();
  }

  onMouseEnterHeader(): void {
    this.isHoveredTop.set(true);
  }

  onMouseLeaveHeader(): void {
    if (!this.isScrolled()) {
      this.isHoveredTop.set(false);
    }
  }

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
