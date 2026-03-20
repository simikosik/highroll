import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  auth = inject(AuthService);
  router = inject(Router);

  email = signal('');
  password = signal('');

  async login() {
    try {
      await this.auth.login(this.email(), this.password());
      this.router.navigate(['/bj']);
    } catch (error) {
      alert('Login failed: ' + error);
    }
  }

  async register() {
    try {
      await this.auth.register(this.email(), this.password());
      this.router.navigate(['/bj']);
    } catch (error) {
      alert('Registration failed: ' + error);
    }
  }

  async google() {
    try {
      await this.auth.loginWithGoogle();
      this.router.navigate(['/bj']);
    } catch (error) {
      alert('Google login failed: ' + error);
    }
  }

}