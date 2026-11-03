import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-mission-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mission-section.component.html',
  styleUrl: './mission-section.component.css'
})
export class MissionSectionComponent {
  readonly cmsService = inject(CmsService);

  readonly valoresFila1 = [
    { nombre: 'RESPONSABILIDAD', destacado: false },
    { nombre: 'HONESTIDAD', destacado: true },
    { nombre: 'RESPETO', destacado: false }
  ];

  readonly valoresFila2 = [
    { nombre: 'ÉTICA', destacado: false },
    { nombre: 'JUSTICIA', destacado: false },
    { nombre: 'DISCIPLINA', destacado: false }
  ];
}
