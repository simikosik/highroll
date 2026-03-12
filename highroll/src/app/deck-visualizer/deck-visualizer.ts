import { Component, inject, computed } from '@angular/core';
import { Deck } from '../deck';

@Component({
  selector: 'deck-visualizer',
  standalone: true,
  templateUrl: './deck-visualizer.html',
  styleUrl: './deck-visualizer.css'
})
export class DeckVisualizer {

  deck = inject(Deck);

  cardsLeft = computed(() => this.deck.deck().length);

  stackSize = computed(() => Math.ceil(this.cardsLeft() / 10));

}