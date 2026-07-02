import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sysmicon';

  constructor(public router: Router) {}

  get showNavbar(): boolean {
    return !this.router.url.includes('/admin');
  }

  get showFooter(): boolean {
    return !this.router.url.includes('/login') && !this.router.url.includes('/registro') && !this.router.url.includes('/admin');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!event.urlAfterRedirects?.includes('#')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
  }
}
