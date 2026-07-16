import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-banner-crearplano',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner-crearplano.component.html',
  styleUrls: ['./banner-crearplano.component.css']
})
export class BannerCrearplanoComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.refresh();
    }, 150);
  }
}
