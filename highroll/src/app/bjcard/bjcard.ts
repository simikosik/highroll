import { Component, Input } from '@angular/core';

export type Card = {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  value: number;

};

@Component({
  selector: 'app-bjcard',
  standalone: true,
  templateUrl: './bjcard.html',
  styleUrl: './bjcard.css'
})
export class BjCard {
  @Input() card!: Card;

  get isRed() {
    return this.card.suit === '♥' || this.card.suit === '♦';
  }
}
