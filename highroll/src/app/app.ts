import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { routes } from './app.routes';
import { Balance } from './balance/balance';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Balance],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('highroll');
}
