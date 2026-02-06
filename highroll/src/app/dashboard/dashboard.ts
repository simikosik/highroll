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
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>🎲 HIGHROLL CASINO</h1>
          <div class="header-info">
            <div class="user-info">
              <p>Hráč: <strong>{{ user()?.username }}</strong></p>
              <p>Balance: <span class="balance">{{ balanceService.currentBalance() }} €</span></p>
            </div>
            <button (click)="logout()" class="btn-logout">Odhlásiť sa</button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Games Section -->
        <section class="games-section">
          <h2>📊 Dostupné Hry</h2>
          <div class="games-grid">
            <!-- Plinko Card -->
            <div class="game-card">
              <div class="game-icon">🎮</div>
              <h3>PLINKO</h3>
              <p>Pohni loptičkou až do zátky s násobiteľmi!</p>
              <button 
                [routerLink]="['/plinko']"
                class="btn-play-game"
              >
                Hrať Teraz
              </button>
              <span class="badge coming-soon">DOSTUPNÉ</span>
            </div>

            <!-- Dice Card (Placeholder) -->
            <div class="game-card disabled">
              <div class="game-icon">🎲</div>
              <h3>DICE</h3>
              <p>Vsadíš na párne či nepárne číslo</p>
              <button disabled class="btn-play-game">Čoskoro</button>
              <span class="badge">ČOSKORO</span>
            </div>

            <!-- Slots Card (Placeholder) -->
            <div class="game-card disabled">
              <div class="game-icon">🎰</div>
              <h3>SLOTS</h3>
              <p>Klasické hranie s tromi valcami</p>
              <button disabled class="btn-play-game">Čoskoro</button>
              <span class="badge">ČOSKORO</span>
            </div>

            <!-- Roulette Card (Placeholder) -->
            <div class="game-card disabled">
              <div class="game-icon">🎡</div>
              <h3>ROULETTE</h3>
              <p>Otáčaj ruletou a vyhrávaj veľké peniaze</p>
              <button disabled class="btn-play-game">Čoskoro</button>
              <span class="badge">ČOSKORO</span>
            </div>
          </div>
        </section>

        <!-- Balance Info -->
        <section class="info-section">
          <div class="info-card">
            <h3>💰 Tvoj Balance</h3>
            <p class="balance-display">{{ balanceService.currentBalance() }} €</p>
            <p class="balance-note">Opatrne! Výhry sú rýchle ako blesk!</p>
          </div>

          <div class="info-card">
            <h3>🏆 Počet Hier</h3>
            <p class="stat-display">{{ gameHistory().length }}</p>
            <p class="stat-note">Celkovo odohraných hier</p>
          </div>

          <div class="info-card">
            <h3>💸 Celková Výhra</h3>
            <p class="stat-display">{{ totalWinnings().toFixed(2) }} €</p>
            <p class="stat-note">Od všetkých hier</p>
          </div>
        </section>

        <!-- Game History -->
        <section class="history-section">
          <h2>📈 História Hier</h2>
          <div class="history-table">
            <div *ngIf="gameHistory().length === 0" class="empty-state">
              <p>Ešte si nehrál žiadnu hru. Začni s Plinko! 🎮</p>
            </div>

            <div *ngIf="gameHistory().length > 0" class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Čas</th>
                    <th>Hra</th>
                    <th>Stávka</th>
                    <th>Multiplier</th>
                    <th>Výhra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let game of gameHistory().slice(0, 10)">
                    <td>{{ game.playedAt | date:'HH:mm:ss' }}</td>
                    <td><strong>{{ game.gameType | uppercase }}</strong></td>
                    <td>{{ game.bet }} €</td>
                    <td>{{ game.multiplier }}x</td>
                    <td class="win-amount">+{{ game.winAmount | number:'1.2-2' }} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
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
