import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleGamingService {
  sessionStart = signal<Date | null>(null);
  gamesPlayed = signal(0);
  totalLoss = signal(0);
  lossStreak = signal(0);
  popupMessage = signal('');
  showPopup = signal(false);
  popupText = signal('');
  betClicks = signal(0);

  reminderMessages = [
    'Hazard môže viesť k finančným stratám. Hrajte s rozumom.',
    'Stávky sa môžu rýchlo navýšiť. Nastavte si limit.',
    'Hazard nie je istý spôsob zárobku. Váhajte pred ďalšou stávkou.',
    'Pravidelné prestávky pomáhajú udržať kontrolu nad hrou.',
    'Nehráte proti kasínu, ale proti vlastnej náklonnosti riskovať.',
    'Ak cítite napätie, zastavte sa a porozmýšľajte.',
    'Straty patria do hry, ale nemali by vám spôsobovať stres.',
    'Hazard môže ovplyvniť váš spánok a náladu. Buďte opatrní.',
    'Riziko sa zvyšuje pri väčších stávkach. Zostaňte disciplinovaní.',
    'Udržte stávky malé a nezabúdajte, že kasíno má vždy výhodu.'
  ];
  nextReminderIndex = 0;

  popupMessages = [
    'Pamätajte si, že hazard je zábava, nie spôsob ako zarobiť peniaze.',
    'Ak máte pocit, že hráte príliš veľa, zastavte sa a porozmýšľajte.',
    'Nastavte si denný limit a dodržiavajte ho.',
    'Hazard môže byť návykový. Hrajte zodpovedne.',
    'Ak stratíte viac ako ste si naplánovali, prestaňte hrať.',
    'Zvážte prestávku po niekoľkých hrách.',
    'Nezabúdajte na svoje povinnosti mimo hazardu.',
    'Ak máte problém s hazardom, vyhľadajte pomoc.',
    'Hrajte pre zábavu, nie pre peniaze.',
    'Buďte disciplinovaní vo svojich stávkach.'
  ];

  startSession() {
    if (!this.sessionStart()) {
      this.sessionStart.set(new Date());
    }
  }

  recordGame(loss: number) {
    this.gamesPlayed.update(g => g + 1);
    this.totalLoss.update(l => l + loss);
    if (loss > 0) {
      this.lossStreak.update(s => s + 1);
    } else {
      this.lossStreak.set(0);
    }
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

    if (this.lossStreak() >= 3) {
      this.showWarning('Máte stratovú sériu. Zvážte prestávku.');
    }
  }

  showWarning(message: string) {
    this.popupMessage.set(message);
  }

  showResponsibleReminder() {
    const message = this.reminderMessages[this.nextReminderIndex];
    this.nextReminderIndex = (this.nextReminderIndex + 1) % this.reminderMessages.length;
    this.showWarning(message);
  }

  recordBetClick() {
    this.betClicks.update(c => c + 1);
    if (this.betClicks() % 5 === 0) {
      this.showRandomPopup();
    }
  }

  showRandomPopup() {
    const randomIndex = Math.floor(Math.random() * this.popupMessages.length);
    this.popupText.set(this.popupMessages[randomIndex]);
    this.showPopup.set(true);
  }

  closePopup() {
    this.showPopup.set(false);
    this.popupText.set('');
  }
}
