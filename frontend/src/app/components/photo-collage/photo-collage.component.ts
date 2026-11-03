import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CollageItem {
  url: string;
  projectLabel: string;
  projectId: string;
  span?: 'normal' | 'wide' | 'tall';
}

@Component({
  selector: 'app-photo-collage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-collage.component.html',
  styleUrl: './photo-collage.component.css'
})
export class PhotoCollageComponent {
  @Input() collageItems: CollageItem[] = [];
}
