import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architectural-scroll-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './architectural-scroll-block.component.html',
  styleUrl: './architectural-scroll-block.component.css'
})
export class ArchitecturalScrollBlockComponent {
  @Input() title: string = 'INGENIERÍA & ESTRUCTURACIÓN 360°';
  @Input() code: string = 'EJE ESTRUCTURAL // 01';
}
