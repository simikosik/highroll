import { Component, signal, inject } from '@angular/core';
import { BjCard, Card } from '../bjcard/bjcard';
import { Deck } from '../deck';
import { DeckVisualizer } from '../deck-visualizer/deck-visualizer';
import { Home } from '../home/home';
import { RouterLink } from '@angular/router';
import { balance, changeBalance } from '../balance/balance.store';
import { ResponsibleGamingService } from '../responsible-gaming.service';
import { ResponsibleGamingPopup } from '../responsible-gaming-popup/responsible-gaming-popup';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [BjCard, DeckVisualizer, ResponsibleGamingPopup],
  templateUrl: './blackjack.html',
  styleUrl: './blackjack.css'
})
export class Blackjack {


  deck = inject(Deck);
  readonly balance = balance;
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

startGame() {

  if (this.balance() < this.bet()) {
    this.message.set('Nedostatok prostriedkov!');
    return;
  }

  this.rgService.startSession();

  changeBalance(-this.bet());

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

double() {

  if (!this.canDouble()) return;

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

currentHand(): Card[] {
  return this.playerHands()[this.currentHandIndex()];
}

  stand() {

    this.dealerHidden.set(false);

    while (this.getTotal(this.dealerHand()) < 17) {
      this.dealerHand.update(h => [...h, this.deck.draw()]);
    }

    this.finishGame();

  }
  

finishGame() {

  const dealer = this.getTotal(this.dealerHand());
  const hand = this.currentHand();
  const player = this.getTotal(hand);
  let loss = this.bet();

  if (player > 21) {
    this.message.set('Bust');
    // už odpočítané
  } else if (dealer > 21) {
    this.message.set('Dealer bust, W!');
    changeBalance(this.bet() * 2);
    loss = 0;
  } else if (player > dealer) {
    this.message.set('W!');
    changeBalance(this.bet() * 2);
    loss = 0;
  } else if (player < dealer) {
    this.message.set('Dealer W!');
    // už odpočítané
   } else if (player > 21 && dealer > 21) {
    this.message.set('Bust!');
  } else {
    this.message.set('Tie!');
    changeBalance(this.bet());
    loss = 0;
  }

  this.rgService.recordGame(loss);

  this.gameOver.set(true);

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

}