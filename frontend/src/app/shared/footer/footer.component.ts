import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BRAND_CONFIG, CONTACT_INFO, NAV_LINKS, LEGAL_LINKS } from '../../core/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly brand = BRAND_CONFIG;
  readonly contact = CONTACT_INFO;
  readonly navLinks = NAV_LINKS;
  readonly legalLinks = LEGAL_LINKS;

  readonly currentYear = new Date().getFullYear();
  readonly newsletterEmail = signal<string>('');
  readonly isSubscribed = signal<boolean>(false);

  subscribeNewsletter(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail().trim() && this.newsletterEmail().includes('@')) {
      this.isSubscribed.set(true);
      this.newsletterEmail.set('');
      setTimeout(() => {
        this.isSubscribed.set(false);
      }, 5000);
    }
  }
}
