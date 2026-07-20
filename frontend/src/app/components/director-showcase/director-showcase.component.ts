import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-director-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './director-showcase.component.html',
  styleUrl: './director-showcase.component.css'
})
export class DirectorShowcaseComponent {
}
