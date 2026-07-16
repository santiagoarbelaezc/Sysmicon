import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoadingService } from './services/loading.service';
import { filter } from 'rxjs/operators';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sysmicon';
  readonly loadingService = inject(LoadingService);

  constructor(public router: Router) {}

  get showNavbar(): boolean {
    return !this.router.url.includes('/admin') && !this.router.url.includes('/olvide-mi-contrasena');
  }

  get showFooter(): boolean {
    return !this.router.url.includes('/login')
      && !this.router.url.includes('/registro')
      && !this.router.url.includes('/admin')
      && !this.router.url.includes('/olvide-mi-contrasena');
  }

  ngOnInit() {
    // Inicializar AOS para animaciones de scroll profesionales
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });

    // Mostrar pantalla de carga elegante en el primer ingreso al sitio
    this.loadingService.showTemporarily(2200, 'Inicializando Sysmicon Studio...');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!event.urlAfterRedirects?.includes('#')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      setTimeout(() => {
        AOS.refresh();
      }, 250);
    });
  }
}
