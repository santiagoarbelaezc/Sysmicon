import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
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
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.loginEmail || !this.loginPass) {
      this.errorMessage.set('Por favor ingresa tu correo y contraseña.');
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    await this.authService.login(this.loginEmail, this.loginPass);
    this.isSubmitting.set(false);
    this.successMessage.set('¡Autenticado con éxito! Redirigiéndote a tu portal Sysmicon...');
    
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }

  async onRegister(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.regNombre || !this.regEmail || !this.regTelefono || !this.regPass) {
      this.errorMessage.set('Por favor completa todos los campos obligatorios (*).');
      return;
    }
    if (this.regPass !== this.regPassConfirm) {
      this.errorMessage.set('Las contraseñas no coinciden. Verifícalas por favor.');
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    await this.authService.register(this.regNombre, this.regEmail, this.regTelefono, this.regRol);
    this.isSubmitting.set(false);
    this.successMessage.set('¡Cuenta de propietario creada con éxito! Redirigiéndote...');

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }

  loginConSocial(provedor: string): void {
    this.isSubmitting.set(true);
    setTimeout(async () => {
      await this.authService.login(`usuario_${provedor.toLowerCase()}@correo.com`, '123456');
      this.isSubmitting.set(false);
      this.successMessage.set(`¡Conectado con éxito a través de ${provedor}!`);
      setTimeout(() => this.router.navigate(['/']), 1200);
    }, 1000);
  }
}
