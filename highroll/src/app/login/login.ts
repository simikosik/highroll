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
    } catch (e) {
      alert('Login failed');
      return;
    }

    this.userData.loadUserData().catch(error => {
      console.error('User data load failed after login:', error);
    });

    this.router.navigate(['/bj']);
  }

  async register() {
    try {
      await this.auth.register(this.email(), this.password());
    } catch (e) {
      alert('Registration failed');
      return;
    }

    this.userData.loadUserData().catch(error => {
      console.error('User data load failed after registration:', error);
    });

    this.router.navigate(['/bj']);
  }

  async google() {
    try {
      await this.auth.loginWithGoogle();
    } catch (e) {
      alert('Google login failed');
      return;
    }

    this.userData.loadUserData().catch(error => {
      console.error('User data load failed after Google login:', error);
    });

    this.router.navigate(['/bj']);
  }

}