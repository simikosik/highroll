import { Component, signal } from '@angular/core';
import { BjCard, Card } from '../bjcard/bjcard';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [BjCard],
  templateUrl: './blackjack.html',
  styleUrl: './blackjack.css'
})
export class Blackjack {

  

  deck = signal<Card[]>([]);
  playerHand = signal<Card[]>([]);
  dealerHand = signal<Card[]>([]);
  gameOver = signal(false);
  message = signal('');



  createDeck(): Card[] {
    const suits: Card['suit'][] = ['♠', '♥', '♦', '♣'];

    const ranks = [
      { rank: 'A', value: 11 },
      { rank: '2', value: 2 },
      { rank: '3', value: 3 },
      { rank: '4', value: 4 },
      { rank: '5', value: 5 },
      { rank: '6', value: 6 },
      { rank: '7', value: 7 },
      { rank: '8', value: 8 },
      { rank: '9', value: 9 },
      { rank: '10', value: 10 },
      { rank: 'J', value: 10 },
      { rank: 'Q', value: 10 },
      { rank: 'K', value: 10 }
    ];

    const deck: Card[] = [];

    for (const suit of suits) {
      for (const r of ranks) {
        deck.push({
          suit,
          rank: r.rank,
          value: r.value
        });
      }
    }

    return deck;
  }

  shuffle(cards: Card[]): Card[] {
    return cards.sort(() => Math.random() - 0.5);
  }

  drawCard(): Card {
    const currentDeck = this.deck();
    const card = currentDeck.pop()!;
    this.deck.set([...currentDeck]);
    return card;
  }


  startGame() {
    const newDeck = this.shuffle(this.createDeck());
    this.deck.set(newDeck);

    this.playerHand.set([
      this.drawCard(),
      this.drawCard()
    ]);

    this.dealerHand.set([
      this.drawCard(),
      this.drawCard()
    ]);

    this.gameOver.set(false);
    this.message.set('');
  }

  hit() {
    if (this.gameOver()) return;

    this.playerHand.update(h => [...h, this.drawCard()]);

    if (this.getTotal(this.playerHand()) > 21) {
      this.gameOver.set(true);
      this.message.set('Bust!');
    }
  }

  stand() {
    while (this.getTotal(this.dealerHand()) < 17) {
      this.dealerHand.update(h => [...h, this.drawCard()]);
    }

    this.finishGame();
  }

  finishGame() {
    const player = this.getTotal(this.playerHand());
    const dealer = this.getTotal(this.dealerHand());

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
    return hand.reduce((sum, card) => sum + card.value, 0);
  }
}
