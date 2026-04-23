import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleGamingService {
  sessionStart = signal<Date | null>(null);
  gamesPlayed = signal(0);
  totalLoss = signal(0);
  showPopup = signal(false);
  popupMessage = signal('');

  startSession() {
    if (!this.sessionStart()) {
      this.sessionStart.set(new Date());
    }
  }

  recordGame(loss: number) {
    this.gamesPlayed.update(g => g + 1);
    this.totalLoss.update(l => l + loss);
    this.checkWarnings();
  }

  checkWarnings() {
    const now = new Date();
    const start = this.sessionStart();
    if (!start) return;

    const hoursPlayed = (now.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (hoursPlayed > 1) {
      this.showWarning('Hráte už viac ako hodinu. Zvážte prestávku.');
    }

    if (this.totalLoss() > 500) {
      this.showWarning('Stratili ste viac ako 500. Buďte opatrní.');
    }

    if (this.gamesPlayed() > 50) {
      this.showWarning('Odohrali ste veľa hier. Zvážte prestávku.');
    }
  }

  showWarning(message: string) {
    this.popupMessage.set(message);
    this.showPopup.set(true);
  }

  closePopup() {
    this.showPopup.set(false);
  }
}