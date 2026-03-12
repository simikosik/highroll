import { Injectable, signal } from '@angular/core';
import { Card } from './bjcard/bjcard';

@Injectable({
  providedIn: 'root'
})
export class Deck {

  deck = signal<Card[]>([]);

  constructor() {
    this.resetDeck();
  }

  private createDeck(): Card[] {
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

  private shuffle(cards: Card[]): Card[] {
    return cards.sort(() => Math.random() - 0.5);
  }

  resetDeck() {
    this.deck.set(this.shuffle(this.createDeck()));
  }

  draw(): Card {

    const current = this.deck();

    // If deck empty → recreate and shuffle
    if (current.length === 0) {
      this.resetDeck();
    }

    const newDeck = [...this.deck()];
    const card = newDeck.pop()!;

    this.deck.set(newDeck);

    return card;
  }

}