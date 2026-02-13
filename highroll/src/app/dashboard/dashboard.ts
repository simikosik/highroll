import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template:  './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  constructor() {};
}
