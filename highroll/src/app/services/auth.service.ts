import { Injectable, signal } from '@angular/core';
import { User, AuthCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  public user = this.currentUser.asReadonly();
  public isAuthenticated = this.currentUser.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  register(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulácia API volania
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: credentials.username || credentials.email,
          email: credentials.email,
          balance: 1000, // Úvodný balance
          createdAt: new Date()
        };
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36);
        
        this.currentUser.set(newUser);
        this.token.set(mockToken);
        this.saveToLocalStorage(newUser, mockToken);

        resolve({ token: mockToken, user: newUser });
      }, 500);
    });
  }

  login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulácia API volania
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: credentials.email.split('@')[0],
          email: credentials.email,
          balance: 500,
          createdAt: new Date()
        };
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36);
        
        this.currentUser.set(user);
        this.token.set(mockToken);
        this.saveToLocalStorage(user, mockToken);

        resolve({ token: mockToken, user });
      }, 500);
    });
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('casino_user');
    localStorage.removeItem('casino_token');
  }

  private saveToLocalStorage(user: User, token: string): void {
    localStorage.setItem('casino_user', JSON.stringify(user));
    localStorage.setItem('casino_token', token);
  }

  private loadFromLocalStorage(): void {
    const userStr = localStorage.getItem('casino_user');
    const tokenStr = localStorage.getItem('casino_token');
    
    if (userStr && tokenStr) {
      this.currentUser.set(JSON.parse(userStr));
      this.token.set(tokenStr);
    }
  }

  getToken(): string | null {
    return this.token();
  }
}
