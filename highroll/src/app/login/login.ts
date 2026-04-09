import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { UserData } from '../userdata';
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
  userData = inject(UserData);
  router = inject(Router);

  email = signal('');
  password = signal('');

  async login() {
    try {
      await this.auth.login(this.email(), this.password());
      await this.userData.loadUserData();
      this.router.navigate(['/bj']);
    } catch (e) {
      alert('Login failed');
    }
  }

  async register() {
    try {
      await this.auth.register(this.email(), this.password());
      await this.userData.loadUserData();
      this.router.navigate(['/bj']);
    } catch (e) {
      alert('Registration failed');
    }
  }

  async google() {
    try {
      await this.auth.loginWithGoogle();
      await this.userData.loadUserData();
      this.router.navigate(['/bj']);
    } catch (e) {
      alert('Google login failed');
    }
  }

}