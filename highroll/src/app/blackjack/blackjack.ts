import { Component, signal, inject } from '@angular/core';
import { BjCard, Card } from '../bjcard/bjcard';
import { Deck } from '../deck';
import { DeckVisualizer } from '../deck-visualizer/deck-visualizer';
import { Home } from '../home/home';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [BjCard, DeckVisualizer, Home, RouterLink],
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

startGame() {

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

  if (dealer > 21) {
    this.message.set('Dealer bust, W!');
  } else if (player > dealer) {
    this.message.set('W!');
  } else if (player < dealer) {
    this.message.set('Dealer W!');
  } else {
    this.message.set('Tie!');
  }

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