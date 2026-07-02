import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreaTuDisenoComponent } from './pages/crea-tu-diseno/crea-tu-diseno.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Sysmicon | Diseño y Construcción de Viviendas' },
  { path: 'crea-tu-diseno', component: CreaTuDisenoComponent, title: 'Crea Tu Diseño | Cotizador Sysmicon' },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros | Filosofía y Arquitectura Sysmicon' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | Sysmicon Arquitectura' },
  { path: 'login', component: LoginComponent, title: 'Acceso Privado | Portal Sysmicon' },
  { path: 'registro', component: LoginComponent, title: 'Crear Cuenta | Portal Sysmicon' },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent), title: 'Portal Directivo | Sysmicon Admin' },
  { path: '**', redirectTo: '' }
];
