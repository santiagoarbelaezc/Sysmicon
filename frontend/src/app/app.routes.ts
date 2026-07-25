import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreaTuDisenoComponent } from './pages/crea-tu-diseno/crea-tu-diseno.component';
import { CotizaConNosotrosComponent } from './pages/cotiza-con-nosotros/cotiza-con-nosotros.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { OlvideContrasenaComponent } from './pages/olvide-contrasena/olvide-contrasena.component';

import { ProyectosPageComponent } from './pages/proyectos-page/proyectos-page.component';
import { ProyectoDetalleComponent } from './pages/proyecto-detalle/proyecto-detalle.component';
import { AgendarCitaComponent } from './pages/agendar-cita/agendar-cita.component';

import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Sysmicon | Diseño y Construcción de Viviendas' },
  { path: 'proyectos', component: ProyectosPageComponent, title: 'Galería de Proyectos | Portafolio Sysmicon' },
  { path: 'proyecto/:id', component: ProyectoDetalleComponent, title: 'Dossier de Proyecto | Sysmicon Studio' },
  { path: 'agendar-cita', component: AgendarCitaComponent, title: 'Agendar Cita Privada | Consultoría Sysmicon' },
  { path: 'agendar', redirectTo: 'agendar-cita', pathMatch: 'full' },
  { path: 'cotiza-con-nosotros', component: CotizaConNosotrosComponent, title: 'Cotiza con Nosotros | Sysmicon Arquitectura & Construcción' },
  { path: 'crea-tu-diseno', redirectTo: 'cotiza-con-nosotros', pathMatch: 'full' },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros | Filosofía y Arquitectura Sysmicon' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | Sysmicon Arquitectura' },
  
  // Rutas de Autenticación (con GuestGuard)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard], title: 'Acceso Privado | Portal Sysmicon' },
  { path: 'registro', component: LoginComponent, canActivate: [guestGuard], title: 'Crear Cuenta | Portal Sysmicon' },
  { path: 'olvide-mi-contrasena', component: OlvideContrasenaComponent, title: 'Recuperar Contraseña | Portal Sysmicon' },
  
  // Ruta Privada de Administración (Protegida estrictamente con AuthGuard)
  { 
    path: 'admin', 
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent), 
    canActivate: [authGuard], 
    title: 'Portal Directivo | Sysmicon Admin' 
  },
  
  { path: '**', redirectTo: '' }
];
