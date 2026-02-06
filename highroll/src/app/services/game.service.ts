import { Injectable, signal } from '@angular/core';
import { GameResult } from '../models/game.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameHistory = signal<GameResult[]>([]);
  public history = this.gameHistory.asReadonly();

  constructor(private authService: AuthService) {
    this.loadHistory();
  }

  recordGame(gameType: 'plinko' | 'dice' | 'slots' | 'roulette', bet: number, multiplier: number): GameResult {
    const user = this.authService.user();
    if (!user) throw new Error('User not authenticated');

    const winAmount = bet * multiplier;
    const result: GameResult = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      gameType,
      bet,
      multiplier,
      winAmount,
      playedAt: new Date()
    };

    const currentHistory = this.gameHistory();
    this.gameHistory.set([result, ...currentHistory]);
    this.saveHistory();

    return result;
  }

  getHistory(): GameResult[] {
    return this.gameHistory();
  }

  clearHistory(): void {
    this.gameHistory.set([]);
    localStorage.removeItem('casino_game_history');
  }

  private saveHistory(): void {
    localStorage.setItem('casino_game_history', JSON.stringify(this.gameHistory()));
  }

  private loadHistory(): void {
    const historyStr = localStorage.getItem('casino_game_history');
    if (historyStr) {
      this.gameHistory.set(JSON.parse(historyStr));
    }
  }
}
