import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BRAND_CONFIG, CONTACT_INFO } from '../../core/app.constants';

export type LegalSection = 'privacidad' | 'terminos' | 'datos';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.css'
})
export class LegalPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  readonly brand = BRAND_CONFIG;
  readonly contact = CONTACT_INFO;
  readonly activeSection = signal<LegalSection>('privacidad');

  readonly sections: Array<{ id: LegalSection; label: string; code: string }> = [
    { id: 'privacidad', label: 'Políticas de Privacidad', code: 'SEC • 01' },
    { id: 'terminos', label: 'Términos de Servicio', code: 'SEC • 02' },
    { id: 'datos', label: 'Tratamiento de Datos', code: 'SEC • 03' }
  ];

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'privacidad' || fragment === 'terminos' || fragment === 'datos') {
        this.activeSection.set(fragment);
        window.scrollTo(0, 0);
      }
    });
  }

  setSection(section: LegalSection): void {
    this.activeSection.set(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
