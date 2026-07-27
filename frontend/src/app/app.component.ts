import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoadingService } from './services/loading.service';
import { ProyectosService } from './services/proyectos.service';
import AOS from 'aos';

import { PwaInstallModalComponent } from './shared/pwa-install-modal/pwa-install-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, PwaInstallModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sysmicon';
  readonly loadingService = inject(LoadingService);
  readonly proyectosService = inject(ProyectosService);

  constructor(public router: Router) {}

  get showNavbar(): boolean {
    if (this.router.url.includes('/proyecto/')) {
      return false;
    }
    if (this.proyectosService.proyectoModalActivo()) {
      return false;
    }
    return !this.router.url.includes('/admin') && !this.router.url.includes('/olvide-mi-contrasena');
  }

  get showFooter(): boolean {
    if (this.router.url.includes('/proyecto/')) {
      return false;
    }
    return !this.router.url.includes('/login')
      && !this.router.url.includes('/registro')
      && !this.router.url.includes('/admin')
      && !this.router.url.includes('/olvide-mi-contrasena');
  }

  ngOnInit() {
    // Mostrar pantalla de carga SOLAMENTE si el ingreso inicial es directo al login o al dashboard (admin)
    const initialPath = window.location.pathname;
    if (initialPath.includes('/login') || initialPath.includes('/registro')) {
      this.loadingService.showTemporarily(1100, 'Accediendo al Portal Privado...');
    } else if (initialPath.includes('/admin')) {
      this.loadingService.showTemporarily(1100, 'Cargando Panel del Dashboard...');
    }

    try {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-cubic'
      });
    } catch (e) {
      console.warn('AOS initialization warning:', e);
    }

    // Scroll automático al top (0,0) en cada cambio de ruta/componente
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
