import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './auth';
import { inject } from '@angular/core';
import { UserData } from './userdata';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('highroll');
  userData = inject(UserData);
  auth = inject(AuthService);
}
