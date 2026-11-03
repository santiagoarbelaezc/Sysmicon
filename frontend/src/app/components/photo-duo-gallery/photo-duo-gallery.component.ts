import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollageItem } from '../photo-collage/photo-collage.component';

@Component({
  selector: 'app-photo-duo-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-duo-gallery.component.html',
  styleUrl: './photo-duo-gallery.component.css'
})
export class PhotoDuoGalleryComponent {
  @Input() items: CollageItem[] = [];

  /** Agrupa los items en pares de 2 */
  get pairs(): CollageItem[][] {
    const pairs: CollageItem[][] = [];
    for (let i = 0; i < this.items.length; i += 2) {
      pairs.push(this.items.slice(i, i + 2));
    }
    return pairs;
  }
}
