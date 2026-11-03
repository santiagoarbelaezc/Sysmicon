import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-olvide-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './olvide-contrasena.component.html',
  styleUrl: './olvide-contrasena.component.css'
})
export class OlvideContrasenaComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  // Estado del formulario
  readonly paso = signal<'email' | 'enviado'>('email');
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');

  // Campos
  email = '';

  async onEnviarRecuperacion(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.email) {
      this.errorMessage.set('Por favor ingresa tu correo electrónico registrado.');
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulación de envío de email (reemplazar con llamada real al backend)
    await new Promise(resolve => setTimeout(resolve, 1800));

    this.isSubmitting.set(false);
    this.paso.set('enviado');
  }

  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }

  reenviarCorreo(): void {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set('Correo reenviado exitosamente. Revisa tu bandeja de entrada.');
    }, 1500);
  }
}
