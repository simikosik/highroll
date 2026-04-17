import { Component, signal, inject } from '@angular/core';
import { BjCard, Card } from '../bjcard/bjcard';
import { Deck } from '../deck';
import { DeckVisualizer } from '../deck-visualizer/deck-visualizer';
import { RouterLink } from '@angular/router';
import { Stats } from '../stats';
import { UserData } from '../userdata';
import { Balance } from '../balance/balance';
import { Advisor } from '../advisor/advisor';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [BjCard, DeckVisualizer, RouterLink, Advisor],
  templateUrl: './blackjack.html',
  styleUrl: './blackjack.css'
})
export class Blackjack {


  deck = inject(Deck);
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

  bet = signal(0);
  currentBet = signal(0);
  doubleBet = signal(0);
  gameInProgress = signal(false);
  stats = inject(Stats);
  
  constructor() {
  this.userData.loadUserData();
}


  async startGame() {

  const betAmount = this.bet();
  if (betAmount <= 0 || betAmount > this.userData.balance()) {
    this.message.set('Invalid bet amount!');
    return;
  }

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

  this.updateActions();

}

hit() {

  if (this.gameOver()) return;

  const hands = [...this.playerHands()];
  const i = this.currentHandIndex();

  hands[i] = [...hands[i], this.deck.draw()];

  this.playerHands.set(hands);

  if (this.getTotal(hands[i]) > 21) {
    this.nextHand();
  }

  this.updateActions();

}

  async double() {

  if (!this.canDouble()) return;

  const betAmount = this.currentBet();
  const currentBalance = this.userData.balance();

  if (betAmount > currentBalance) {
    this.message.set('Not enough balance to double!');
    return;
  }

  await this.userData.updateBalance(-betAmount);
  this.doubleBet.set(betAmount);

  const hands = [...this.playerHands()];
  const i = this.currentHandIndex();

  hands[i] = [...hands[i], this.deck.draw()];

  this.playerHands.set(hands);

  this.nextHand();

}

split() {

  if (!this.canSplit()) return;

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

nextHand() {

  if (this.currentHandIndex() < this.playerHands().length - 1) {
    this.currentHandIndex.update(i => i + 1);
    this.updateActions();
    return;
  }

  this.stand();

}

updateActions() {

  const hand = this.currentHand();

  this.canDouble.set(hand.length === 2);

  this.canSplit.set(
    hand.length === 2 &&
    hand[0].rank === hand[1].rank
  );

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

  stand() {

    this.dealerHidden.set(false);

    while (this.getTotal(this.dealerHand()) < 17) {
      this.dealerHand.update(h => [...h, this.deck.draw()]);
    }

    this.finishGame();

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

  getAdvice(): string {

  const hand = this.currentHand();
  const dealerCard = this.dealerHand()[0];

  const total = this.getTotal(hand);

 
  if (hand.length === 2 && hand[0].rank === hand[1].rank) {
    if (hand[0].rank === 'A' || hand[0].rank === '8') return 'SPLIT';
    if (hand[0].rank === '10') return 'STAND';
  }

  
  const hasAce = hand.some(c => c.rank === 'A');

  if (hasAce && total <= 21) {
    if (total <= 17) return 'HIT';
    if (total === 18 && dealerCard.value >= 9) return 'HIT';
    return 'STAND';
  }

 
  if (total <= 11) return 'HIT';
  if (total >= 17) return 'STAND';

  if (total >= 13 && total <= 16) {
    if (dealerCard.value >= 7) return 'HIT';
    return 'STAND';
  }

  if (total === 12) {
    if (dealerCard.value >= 4 && dealerCard.value <= 6) return 'STAND';
    return 'HIT';
  }

  return 'HIT';
}

  addHundred = () => this.userData.updateBalance(100);
  addThousand = () => this.userData.updateBalance(1000);

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

  

