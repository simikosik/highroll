import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advisor.html',
  styleUrl: './advisor.css',
})
export class Advisor {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  userInput = signal('');
  isLoading = signal(false);

  messages = signal<Message[]>([
    {
      role: 'assistant',
      text: 'Ahoj! Som Mgr. Ing. Generál Geňo Pálenik, tvoj osobný poradca pre blackjack.',
    },
  ]);

  constructor() {
    console.log('Advisor component created');
  }

  private readonly apiEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey = environment.groqApiKey;
  

  onTextChange(value: string): void {
    this.userInput.set(value);
  }

  async sendMessage(): Promise<void> {
    console.log('sendMessage called with input:', this.userInput());

    const prompt = this.userInput().trim();
    if (!prompt) {
      console.warn('Empty input');
      return;
    }

    // add user message
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', text: prompt },
    ]);

    this.userInput.set('');
    this.isLoading.set(true);

    try {
      const answer = await this.fetchGrokResponse();
      
      this.messages.update(msgs => [
        ...msgs,
        { role: 'assistant', text: answer },
      ]);
    } catch (error) {
      console.error(error);

      this.messages.update(msgs => [
        ...msgs,
        {
          role: 'assistant',
          text: 'Chyba pri komunikácii s API.',
        },
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async fetchGrokResponse(): Promise<string> {
    const conversationMessages = this.messages().slice(1);

    const messages = [
      {
        role: 'system' as const,
        content: `Si odborný poradca na blackjack so skúsenosťami. Tvoja úloha je dávať presné a užitočné rady založené na basic strategy.

PRAVIDLÁ:
1. Vždy odpovedaj iba v SLOVENČINE
2. Buď stručný a jasný (max 2-3 vety)
3. Rady dávaj podľa hernej situácie hráča

BASIC STRATEGY:
- Pod 12: Hit vždy
- 12-16: Záleží na dealeroej karte. Ako dealer ukazuje 2-6, Stand. Ako 7-Ace, Hit.
- 17+: Stand vždy
- Soft 17 (A+6): Hit
- Pár 8s, 9s, Aces: Split vždy
- Pár 2s, 3s, 7s: Split ak dealer ukazuje 2-7
- Pár 4s, 6s: Hit (nerozdeľuj)
- Pár 5s: Nikdy nerozdeľuj, Double Down
- Pár 10s: Nikdy nerozdeľuj, Stand
- Double Down: Len pri 11 (vždy), pri 10 (ak dealer <10), pri 9 (ak dealer 3-6)

Odpovedaj ako skúsený poradca, nie ako robot. Používaj bežné výrazy a buď priateľský.
Medzi symboly kariet používaš: 2-10, J, Q, K, A, a farby: ♠, ♥, ♦, ♣ (Spades, Hearts, Diamonds, Clubs).
Znaky kariet a symbolov neprekladáš, ale nechávaš v pôvodnej angličtine (Spades, Hearts, Diamonds, Clubs).`.trim(),
      },
      ...conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.text,
      })),
    ];

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        messages,
        //model: 'llama-3.1-8b-instant',
        model: 'llama-3.3-70b-versatile',
        temperature: 1.2,
        top_p: 1,
        max_tokens: 2048,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;

    if (!content || content.trim() === '') {
      return 'AI nevrátilo odpoveď, skús znova.';
    }

    return content;
  }

  onClose(): void {
    this.close.emit();
  }
}