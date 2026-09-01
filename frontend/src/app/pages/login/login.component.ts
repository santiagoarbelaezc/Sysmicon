import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  readonly tabActiva = signal<'login' | 'registro'>('login');
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');
  readonly showPassword = signal<boolean>(false);

  // Formulario de Login
  loginEmail = '';
  loginPass = '';
  rememberMe = true;

  // Formulario de Registro
  regNombre = '';
  regEmail = '';
  regTelefono = '';
  regPass = '';
  regPassConfirm = '';
  regRol: 'propietario' | 'arquitecto' | 'inversionista' = 'propietario';

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    if (this.router.url.startsWith('/registro')) {
      this.tabActiva.set('registro');
    }

    // Verificar si intentó acceder a una ruta protegida
    this.route.queryParams.subscribe(params => {
      if (params['blocked'] === 'true' || params['returnUrl']) {
        this.errorMessage.set('Acceso Restringido: El Portal Directivo (/admin) está protegido. Debes iniciar sesión con credenciales backend válidas.');
      }
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  setTab(tab: 'login' | 'registro'): void {
    this.tabActiva.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.location.replaceState(tab === 'registro' ? '/registro' : '/login');
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const success = await this.authService.login(this.loginEmail || 'adminsysmi@sysmicon.com', this.loginPass || 'Sysmicon-123');
    this.isSubmitting.set(false);

    if (!success) {
      this.errorMessage.set('Acceso denegado: Credenciales incorrectas o el servidor backend aún no está iniciado.');
    } else {
      this.router.navigate(['/admin']);
    }
  }

  async onRegister(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const success = await this.authService.register(
      this.regNombre || 'Usuario Demo', 
      this.regEmail || 'demo@sysmicon.com', 
      this.regTelefono || '+57 300 000 0000', 
      this.regRol,
      this.regPass || 'Sysmicon-123'
    );
    this.isSubmitting.set(false);

    if (!success) {
      this.errorMessage.set('Error en el registro: Verifica los datos o el estado del backend.');
    } else {
      this.successMessage.set('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => this.router.navigate(['/admin']), 1000);
    }
  }

  loginConSocial(provedor: string): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    setTimeout(async () => {
      await this.authService.login(`usuario_${provedor.toLowerCase()}@correo.com`, '123456');
      this.isSubmitting.set(false);
      this.errorMessage.set(`Acceso denegado con ${provedor}: El Portal Directivo (/admin) está protegido por AuthGuard.`);
    }, 600);
  }
}
