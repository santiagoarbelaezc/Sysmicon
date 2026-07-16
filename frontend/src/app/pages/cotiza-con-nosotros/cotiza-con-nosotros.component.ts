import { Component, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CONTACT_INFO, BRAND_CONFIG } from '../../core/app.constants';
import AOS from 'aos';

@Component({
  selector: 'app-cotiza-con-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cotiza-con-nosotros.component.html',
  styleUrl: './cotiza-con-nosotros.component.css'
})
export class CotizaConNosotrosComponent implements AfterViewInit {
  readonly contact = CONTACT_INFO;
  readonly brand = BRAND_CONFIG;

  // Form Model
  nombre = signal<string>('');
  telefono = signal<string>('');
  asunto = signal<string>('');
  mensaje = signal<string>('');

  // UI States
  cargando = signal<boolean>(false);
  enviado = signal<boolean>(false);
  errorMsg = signal<string>('');

  get whatsappUrl(): string {
    const text = `Hola Sysmicon, me gustaría cotizar mi proyecto arquitectónico. Mi nombre es ${this.nombre() || 'un cliente interesado'}.`;
    return `https://wa.me/573108459210?text=${encodeURIComponent(text)}`;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }

  enviarMensaje(event: Event): void {
    event.preventDefault();
    if (!this.nombre().trim() || !this.telefono().trim() || !this.asunto().trim()) {
      this.errorMsg.set('Por favor completa al menos tu nombre, teléfono y asunto.');
      return;
    }

    this.errorMsg.set('');
    this.cargando.set(true);

    // Simulación de envío del formulario al sistema de contacto de Sysmicon
    setTimeout(() => {
      this.cargando.set(false);
      this.enviado.set(true);
      // Limpiar campos para nueva consulta
      this.nombre.set('');
      this.telefono.set('');
      this.asunto.set('');
      this.mensaje.set('');
    }, 1200);
  }

  nuevaConsulta(): void {
    this.enviado.set(false);
  }
}
