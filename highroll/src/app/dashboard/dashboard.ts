import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BalanceService } from '../services/balance.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  styleUrl: './dashboard.css'
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  user = signal<any>(null);
  gameHistory = signal<any[]>([]);

  get totalWinnings(): () => number {
    return () => {
      return this.gameService.history().reduce((sum: number, game: any) => sum + game.winAmount, 0);
    };
  }

  constructor(
    private authService: AuthService,
    public balanceService: BalanceService,
    private gameService: GameService,
    private router: Router
  ) {
    this.user.set(this.authService.user());
    this.gameHistory.set(this.gameService.history());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
