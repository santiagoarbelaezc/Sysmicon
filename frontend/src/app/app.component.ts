import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
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

    // Mostrar pantalla de carga SOLAMENTE si el ingreso inicial es directo al login o al dashboard (admin)
    const initialPath = window.location.pathname;
    if (initialPath.includes('/login') || initialPath.includes('/registro')) {
      this.loadingService.showTemporarily(1100, 'Accediendo al Portal Privado...');
    } else if (initialPath.includes('/admin')) {
      this.loadingService.showTemporarily(1100, 'Cargando Panel del Dashboard...');
    }

    // Interceptar navegaciones para mostrar el estado de carga únicamente al ingresar a login o al dashboard
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('/login') || event.url.includes('/registro')) {
          this.loadingService.showTemporarily(950, 'Accediendo al Portal Privado...');
        } else if (event.url.includes('/admin')) {
          this.loadingService.showTemporarily(950, 'Cargando Panel del Dashboard...');
        } else {
          this.loadingService.hide();
        }
      } else if (event instanceof NavigationEnd) {
        if (!event.urlAfterRedirects?.includes('#')) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        setTimeout(() => {
          AOS.refresh();
        }, 250);
      }
    });
  }
}
