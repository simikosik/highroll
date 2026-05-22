import { Component, signal, inject, OnDestroy, computed } from '@angular/core';
import { BjCard, Card } from '../bjcard/bjcard';
import { Deck } from '../deck';
import { DeckVisualizer } from '../deck-visualizer/deck-visualizer';
import { RouterLink } from '@angular/router';
import { Stats } from '../stats';
import { UserData } from '../userdata';
import { Balance } from '../balance/balance';
import { Advisor } from '../advisor/advisor';
import { ResponsibleGamingService } from '../responsible-gaming.service';
import { AdvisorService, AdviceResult } from '../advisor/advisor.service';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [BjCard, DeckVisualizer, RouterLink, Advisor],
  templateUrl: './blackjack.html',
  styleUrl: './blackjack.css'
})
export class Blackjack implements OnDestroy {


  deck = inject(Deck);
  bet = signal(10);
  rgService = inject(ResponsibleGamingService);
  canSplit = signal(false);
  canDouble = signal(false);
  playerHands = signal<Card[][]>([]);
  currentHandIndex = signal(0);
  dealerHand = signal<Card[]>([]);
  gameOver = signal(false);
  message = signal('');
  dealerHidden = signal(true);
  userData = inject(UserData);
  readonly balance = this.userData.balance;
  advisorOpen = signal(false);
  showAI = signal(true);
  advisorService = inject(AdvisorService);

  currentBet = signal(0);
  doubleBet = signal(0);
  gameInProgress = signal(false);
  stats = inject(Stats);
  isAnimating = signal(false);
  handResolved = signal(false);
  cachedAdvice = signal<AdviceResult>({ move: '', explanation: '' });
  
  constructor() {
  this.userData.loadUserData();
  this.rgService.startSession();
  this.rgService.showResponsibleReminder();
}

  ngOnDestroy() {
  }

  async startGame() {

  const betAmount = this.bet();
  if (betAmount <= 0 || betAmount > this.userData.balance()) {
    this.message.set('Invalid bet amount!');
    return;
  }

  this.rgService.recordBetClick();
  this.rgService.showResponsibleReminder();
  await this.userData.updateBalance(-betAmount);
  this.currentBet.set(betAmount);
  this.doubleBet.set(0);
  this.gameInProgress.set(true);

  const first = this.deck.draw();
  const second = this.deck.draw();

  this.playerHands.set([[first, second]]);
  this.currentHandIndex.set(0);

  this.dealerHand.set([
    this.deck.draw(),
    this.deck.draw()
  ]);

  this.dealerHidden.set(true);
  this.gameOver.set(false);
  this.message.set('');
  this.handResolved.set(false);

  this.updateActions();

}

hit() {

  if (this.gameOver() || this.handResolved()) return;

  const hands = [...this.playerHands()];
  const i = this.currentHandIndex();
  const newCard = this.deck.draw();
  
  hands[i] = [...hands[i], newCard];
  this.playerHands.set(hands);

  const total = this.getTotal(hands[i]);

  if (total > 21 || total === 21) {
    this.handResolved.set(true);
    setTimeout(() => this.completeHand(), 100);
  }

  this.updateActions();

}

  async double() {

  if (!this.canDouble() || this.handResolved()) return;

  const betAmount = this.currentBet();
  const currentBalance = this.userData.balance();

  if (betAmount > currentBalance) {
    this.message.set('Not enough balance to double!');
    return;
  }

  this.handResolved.set(true);

  await this.userData.updateBalance(-betAmount);
  this.doubleBet.set(betAmount);

  const hands = [...this.playerHands()];
  const i = this.currentHandIndex();
  const newCard = this.deck.draw();

  hands[i] = [...hands[i], newCard];
  this.playerHands.set(hands);
  this.updateActions();
  
  setTimeout(() => this.completeHand(), 100);

}

split() {

  if (!this.canSplit() || this.handResolved()) return;

  const hands = [...this.playerHands()];
  const i = this.currentHandIndex();

  const [card1, card2] = hands[i];

  hands.splice(i, 1,
    [card1, this.deck.draw()],
    [card2, this.deck.draw()]
  );

  this.playerHands.set(hands);

  this.updateActions();

}

completeHand() {

  if (this.currentHandIndex() < this.playerHands().length - 1) {
    this.currentHandIndex.update(i => i + 1);
    this.handResolved.set(false);
    this.updateActions();
    return;
  }

  this.handResolved.set(false);
  this.stand();

}

updateActions() {

  const hand = this.currentHand();

  this.canDouble.set(hand.length === 2);

  this.canSplit.set(
    hand.length === 2 &&
    hand[0].rank === hand[1].rank
  );

  this.updateAdvisorCache();

}

private updateAdvisorCache(): void {
  const advice = this.calculateAdvice();
  this.cachedAdvice.set(advice);
}

updateBet(value: string) {
  this.bet.set(Number(value));
}

currentHand(): Card[] {
  return this.playerHands()[this.currentHandIndex()];
}

isDoubleAvailable(): boolean {
  return this.canDouble() && this.currentBet() <= this.userData.balance();
}

isHitAvailable(): boolean {
  return !this.handResolved() && this.getTotal(this.currentHand()) < 21;
}

isStandAvailable(): boolean {
  return !this.handResolved();
}

  async stand() {

    if (!this.gameInProgress()) return;

    this.dealerHidden.set(false);

    while (this.getTotal(this.dealerHand()) < 17) {
      const newCard = this.deck.draw();
      this.dealerHand.update(h => [...h, newCard]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    await this.finishGame();

  }
  

  async finishGame() {

  const dealer = this.getTotal(this.dealerHand());
  const hand = this.currentHand();
  const player = this.getTotal(hand);
   const currentBet = this.currentBet();
  const doubleBet = this.doubleBet();
  const totalBet = currentBet + doubleBet;

  let winnings = 0;

  if (player > 21) {
    this.message.set('bust');
     this.stats.recordLoss();
    winnings = 0;
  } else if (dealer > 21) {
    this.message.set('dealer bust, w!');
    this.stats.recordWin();
    winnings = totalBet * 2;
  } else if (player > dealer) {
    this.message.set('w!');
    this.stats.recordWin();
    winnings = totalBet * 2;
  } else if (player < dealer) {
    this.message.set('dealer w!');
    this.stats.recordLoss();
    winnings = 0;
   } else if (player > 21 && dealer > 21) {
    this.message.set('bust!');
    winnings = 0;
    this.stats.recordLoss();
  } else {
    this.message.set('tie!');
    winnings = totalBet;
  }

    if (winnings > 0) {
    await this.userData.updateBalance(winnings);
  }

  const loss = totalBet - winnings;
  this.rgService.recordGame(loss);

  this.gameOver.set(true);
  this.gameInProgress.set(false);

}

  getTotal(hand: Card[]): number {

    let total = 0;
    let aces = 0;

    for (const card of hand) {

      total += card.value;

      if (card.rank === 'A') {
        aces++;
      }

    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;

  }

 
  getTotalDisplay(hand: Card[]): string {
    const hardTotal = this.getHardTotal(hand);
    const softTotal = this.getTotal(hand);
    
    if (hardTotal === softTotal) {
      return softTotal.toString();
    }
    return `${hardTotal}/${softTotal}`;
  }

 
  private getHardTotal(hand: Card[]): number {
    let total = 0;
    for (const card of hand) {
      if (card.rank === 'A') {
        total += 1;
      } else {
        total += card.value;
      }
    }
    return total;
  }

  private calculateAdvice(): AdviceResult {
  
    if (!this.gameInProgress() || this.dealerHand().length === 0) {
      return { move: '', explanation: '' };
    }

    const hand = this.currentHand();
    if (!hand || hand.length === 0) {
      return { move: '', explanation: '' };
    }

    const dealerCard = this.dealerHand()[0];
    const total = this.getTotal(hand);

    return this.advisorService.calculateAdvice(hand, dealerCard, total);
  }

  addHundred = () => this.userData.updateBalance(100);
  addThousand = () => this.userData.updateBalance(1000);

  getAdvice(): AdviceResult {
    return this.cachedAdvice();
  }

  toggleAdvisor(): void {
    this.advisorOpen.update(open => !open);
  }

  closeAdvisor(): void {
    this.advisorOpen.set(false);
  }

  toggleAI() {
  this.showAI.update(v => !v);
}

  

}

  

