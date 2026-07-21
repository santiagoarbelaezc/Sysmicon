import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-director-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './director-showcase.component.html',
  styleUrl: './director-showcase.component.css'
})
export class DirectorShowcaseComponent {
  private proyectosService = inject(ProyectosService);
  proyectosDestacados: Proyecto[] = this.proyectosService.getProyectos().slice(0, 3);
}
