import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Stats {

  wins = signal(0);
  losses = signal(0);
  lossStreak = signal(0);

  recordWin() {
    this.wins.update(v => v + 1);
    this.lossStreak.set(0);
  }

  recordLoss() {
    this.losses.update(v => v + 1);
    this.lossStreak.update(v => v + 1);
  }

  getWinRate(): number {
    const total = this.wins() + this.losses();
    if (total === 0) return 0;
    return Math.round((this.wins() / total) * 100);
  }

  getHouseEdge(): string {
    return '~2%'; 
  }

}