import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BRAND_CONFIG } from '../../core/app.constants';
import AOS from 'aos';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  readonly brand = BRAND_CONFIG;

  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.refresh();
    }, 150);
  }
}
