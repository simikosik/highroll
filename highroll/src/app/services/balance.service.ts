import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balance = signal<number>(0);
  public currentBalance = this.balance.asReadonly();

  constructor(private authService: AuthService) {
    this.initializeBalance();
  }

  private initializeBalance(): void {
    const user = this.authService.user();
    if (user) {
      this.balance.set(user.balance);
    }
  }

  updateBalance(amount: number): void {
    const currentBalance = this.balance();
    const newBalance = Math.max(0, currentBalance + amount);
    this.balance.set(newBalance);
    this.syncWithLocalStorage();
  }

  deductBet(betAmount: number): boolean {
    const currentBalance = this.balance();
    if (currentBalance < betAmount) {
      return false; // Nedostatočný balance
    }
    this.updateBalance(-betAmount);
    return true;
  }

  addWinnings(winAmount: number): void {
    this.updateBalance(winAmount);
  }

  getBalance(): number {
    return this.balance();
  }

  resetBalance(): void {
    this.balance.set(1000); // Default úvodný balance
    this.syncWithLocalStorage();
  }

  private syncWithLocalStorage(): void {
    const userStr = localStorage.getItem('casino_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.balance = this.balance();
      localStorage.setItem('casino_user', JSON.stringify(user));
    }
  }
}
