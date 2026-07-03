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

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    // Si la URL actual es /registro, activar pestaña de registro
    if (this.router.url.startsWith('/registro')) {
      this.tabActiva.set('registro');
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

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

  setTab(tab: 'login' | 'registro'): void {
    this.tabActiva.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
    // Actualizar URL sin recargar la página
    this.location.replaceState(tab === 'registro' ? '/registro' : '/login');
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.loginEmail) {
      this.loginEmail = 'director@sysmicon.com';
    }
    if (!this.loginPass) {
      this.loginPass = 'admin123456';
    }
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    await this.authService.login(this.loginEmail, this.loginPass);
    this.isSubmitting.set(false);
    this.successMessage.set('¡Autenticado con éxito! Redirigiéndote al Dashboard...');
    
    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 500);
  }

  async onRegister(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.regNombre) this.regNombre = 'Propietario Demo';
    if (!this.regEmail) this.regEmail = 'demo@sysmicon.com';
    if (!this.regTelefono) this.regTelefono = '+57 310 000 0000';
    if (!this.regPass) this.regPass = 'demo123456';
    
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    await this.authService.register(this.regNombre, this.regEmail, this.regTelefono, this.regRol);
    this.isSubmitting.set(false);
    this.successMessage.set('¡Cuenta creada con éxito! Redirigiéndote al Dashboard...');

    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 500);
  }

  loginConSocial(provedor: string): void {
    this.isSubmitting.set(true);
    setTimeout(async () => {
      await this.authService.login(`usuario_${provedor.toLowerCase()}@correo.com`, '123456');
      this.isSubmitting.set(false);
      this.successMessage.set(`¡Conectado con éxito a través de ${provedor}! Redirigiéndote al Dashboard...`);
      setTimeout(() => this.router.navigate(['/admin']), 800);
    }, 800);
  }
}
