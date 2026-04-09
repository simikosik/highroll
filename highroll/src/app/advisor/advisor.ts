import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
      text: 'Ahoj! Som tvoj AI poradca. Napíš mi otázku a ja ti pomôžem s tipmi na blackjack alebo hazard.',
    },
  ]);

  constructor() {
    console.log('Advisor component created');
  }



  onTextChange(value: string): void {
    this.userInput.set(value);
  }

  async sendMessage(): Promise<void> {
    console.log('sendMessage called with input:', this.userInput(), 'isLoading:', this.isLoading());
    
    const prompt = this.userInput().trim();
    if (!prompt || prompt === '') {
      console.warn('Input is empty');
      return;
    }

    this.messages.update(msgs => [...msgs, { role: 'user', text: prompt }]);
    this.userInput.set('');
    this.isLoading.set(true);
    console.log('Message added, waiting for response...');

    try {
      const answer = await this.fetchGrokResponse(prompt);
      this.messages.update(msgs => [...msgs, { role: 'assistant', text: answer }]);
    } catch (error) {
      console.error(error);
      this.messages.update(msgs => [...msgs, {
        role: 'assistant',
        text: 'Nastala chyba pri komunikácii s AI službou. Skontroluj API kľúč a sieťové pripojenie.',
      }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async fetchGrokResponse(prompt: string): Promise<string> {
    const conversationMessages = this.messages().slice(1); // skip initial assistant message
    const messages = [
      { role: 'system' as const, content: 'Si užitočný AI poradca pre blackjack a hazard.' },
      ...conversationMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.text })),
    ];

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        messages,
        model: 'llama-3.1-8b-instant',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result?.choices?.[0]?.message?.content || 'AI nedodal žiadnu odpoveď.';
  }

  onClose(): void {
    this.close.emit();
  }
}