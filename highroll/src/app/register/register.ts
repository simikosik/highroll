import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>🎲 HIGHROLL CASINO</h1>
        <h2>Registrácia</h2>
        
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Prezývka</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Tvoj herný nick"
              required
            />
          </div>

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
              placeholder="Minimálne 6 znakov"
              required
            />
          </div>

          <div class="form-group">
            <label>Potvrd Heslo</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              placeholder="Potvrd heslo"
              required
            />
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading()">
            {{ isLoading() ? 'Registrujem...' : 'Zaregistruj sa' }}
          </button>
        </form>

        <p class="auth-link">
          Už máš účet? 
          <a (click)="goToLogin()">Prihláś sa</a>
        </p>

        <div *ngIf="error()" class="error-message">
          {{ error() }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister(): Promise<void> {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error.set('Vyplň všetky polia');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Heslá sa nezhodujú');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Heslo musí mať minimálne 6 znakov');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.register({ 
        username: this.username,
        email: this.email, 
        password: this.password 
      });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set('Registrácia zlyhala, skús znova');
    } finally {
      this.isLoading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
