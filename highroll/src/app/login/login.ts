import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>🎲 HIGHROLL CASINO</h1>
        <h2>Prihlásenie</h2>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="tvoj@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Heslo</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Zadaj heslo"
              required
            />
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading()">
            {{ isLoading() ? 'Prihlasovám...' : 'Prihlásiť sa' }}
          </button>
        </form>

        <p class="auth-link">
          Ešte nemáš účet? 
          <a (click)="goToRegister()">Zaregistruj sa</a>
        </p>

        <div *ngIf="error()" class="error-message">
          {{ error() }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Vyplň všetky polia');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.login({ email: this.email, password: this.password });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set('Nesprávne prihlasovacie údaje');
    } finally {
      this.isLoading.set(false);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
