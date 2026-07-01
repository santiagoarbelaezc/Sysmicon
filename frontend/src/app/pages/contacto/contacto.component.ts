import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CONTACT_INFO } from '../../core/app.constants';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly contact = CONTACT_INFO;

  nombre: string = '';
  email: string = '';
  telefono: string = '';
  tipoServicio: string = 'Diseño Arquitectónico';
  ubicacionProyecto: string = '';
  presupuestoAprox: string = '$200,000 - $500,000 USD';
  mensaje: string = '';
  aceptaPoliticas: boolean = false;

  readonly isSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.tipoServicio = params['servicio'];
      }
      if (params['proyecto']) {
        this.mensaje = `Hola, estoy interesado/a en un proyecto arquitectónico con características similares a la obra "${params['proyecto']}". Quisiera agendar una consulta técnica.`;
      }
    });
  }

  onSubmitContacto(event: Event): void {
    event.preventDefault();
    if (this.nombre.trim() && this.email.includes('@') && this.telefono.trim() && this.aceptaPoliticas) {
      this.isSubmitted.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetForm(): void {
    this.isSubmitted.set(false);
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.ubicacionProyecto = '';
    this.mensaje = '';
    this.aceptaPoliticas = false;
  }
}
