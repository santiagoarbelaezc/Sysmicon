import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-steps',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-steps.component.html',
  styleUrl: './contact-steps.component.css'
})
export class ContactStepsComponent {}
