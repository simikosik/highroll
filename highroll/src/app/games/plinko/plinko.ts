import { Component, OnInit, ViewChild, ElementRef, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BalanceService } from '../../services/balance.service';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Peg {
  x: number;
  y: number;
  radius: number;
}

@Component({
  selector: 'app-plinko',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="plinko-wrapper">
      <!-- Header Navigation -->
      <header class="plinko-nav">
        <div class="nav-container">
          <h3 class="nav-logo">🎲 HighRoll</h3>
          <nav class="nav-links">
            <a routerLink="/dashboard" class="nav-link">Dashboard</a>
            <a routerLink="/blog" class="nav-link">Blog</a>
            <a href="#contact" class="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <div class="plinko-container">
        <div class="plinko-header">
          <h1>🎲 PLINKO GAME</h1>
          <p class="balance-info">Balance: <span>{{ balanceService.currentBalance() }} €</span></p>
          <p class="game-description">Klikni na plátno a pousti loptičku do pekov! Dostaneš násobok svojej stávky!</p>
        </div>

        <div class="plinko-content">
          <div class="plinko-game">
            <canvas 
              #gameCanvas 
              (click)="onCanvasClick($event)"
              class="game-canvas"
              width="600"
              height="700"
            ></canvas>
          </div>

          <div class="plinko-sidebar">
            <div class="controls-panel">
              <h3>Kontroly</h3>
              
              <div class="control-group">
                <label>Stávka (€)</label>
                <input 
                  type="number" 
                  [(ngModel)]="currentBet" 
                  [disabled]="isPlaying()"
                  min="1"
                  max="1000"
                  class="bet-input"
                />
              </div>

              <button 
                (click)="playGame()" 
                [disabled]="!canPlayAction()"
                class="btn-play"
              >
                {{ isPlaying() ? '⏳ Hrám...' : '▶ Spustiť Hru' }}
              </button>

              <div class="stats-panel">
                <h4>📊 Štatistika</h4>
                <div class="stat-item">
                  <span>Posledný Výsledok:</span>
                  <strong>{{ lastResult() || '—' }}</strong>
                </div>
                <div class="stat-item">
                  <span>Celkem hier:</span>
                  <strong>{{ totalGames() }}</strong>
                </div>
                <div class="stat-item">
                  <span>Celkem výhier:</span>
                  <strong>{{ totalWinnings() }} €</strong>
                </div>
              </div>

              <div class="info-box">
                <h4>💡 Ako hrať</h4>
                <ul>
                  <li>Nastav svoju stávku (€)</li>
                  <li>Klikni na tlačítko "Spustiť Hru"</li>
                  <li>Loptička padá dole cez pegy</li>
                  <li>Dostaneš násobok ako ceny!</li>
                </ul>
              </div>

              <div class="multipliers-info">
                <h4>🎯 Násobiteľy</h4>
                <div class="multiplier-grid">
                  <span class="mult-badge">0.5x</span>
                  <span class="mult-badge">1x</span>
                  <span class="mult-badge">2x</span>
                  <span class="mult-badge">3x</span>
                  <span class="mult-badge">1.5x</span>
                  <span class="mult-badge">2.5x</span>
                  <span class="mult-badge">1x</span>
                  <span class="mult-badge">2x</span>
                  <span class="mult-badge highlight">4x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <section id="contact" class="contact-section">
        <div class="contact-container">
          <h2>Kontaktujte Nás 📧</h2>
          <p class="contact-subtitle">Máte otázky? Radi vám pomôžeme!</p>
          
          <div class="contact-grid">
            <div class="contact-card">
              <div class="contact-icon">💬</div>
              <h3>Živý Chat</h3>
              <p>Pohovori si s našim tímom v reálnom čase</p>
              <button class="btn-contact">Spustiť Chat</button>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📧</div>
              <h3>Email</h3>
              <p>support@highrollcasino.com</p>
              <button class="btn-contact">Poslať Email</button>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">💬</div>
              <h3>Discord</h3>
              <p>Pripoj sa k našej komunite na Discorde</p>
              <button class="btn-contact">Prejsť na Discord</button>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📱</div>
              <h3>Telefón</h3>
              <p>+421 2 1234 5678 (24/7)</p>
              <button class="btn-contact">Zavolať</button>
            </div>
          </div>

          <div class="contact-form-section">
            <h3>Pošli nám Správu</h3>
            <form class="contact-form">
              <div class="form-group">
                <input type="text" placeholder="Tvoj meno" required />
              </div>
              <div class="form-group">
                <input type="email" placeholder="Tvoj email" required />
              </div>
              <div class="form-group">
                <textarea placeholder="Tvoja správa..." rows="5" required></textarea>
              </div>
              <button type="submit" class="btn-contact btn-submit">Poslať Správu</button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="plinko-footer">
        <div class="footer-container">
          <p>&copy; 2026 HighRoll Casino. Všetky práva vyhradené.</p>
          <p>Toto je DEMO aplikácia. Zodpovedný hazard! 🎲</p>
        </div>
      </footer>
    </div>
  `,
  styleUrl: './plinko-new.css'
})
export class PlinkoComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  currentBet = 10;
  isPlaying = signal(false);
  lastResult = signal<string | null>(null);
  // reactive signals
  totalGames = signal(0);
  totalWinnings = signal(0);

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private ball: Ball | null = null;
  private pegs: Peg[] = [];
  private multipliers = [0.5, 1, 2, 3, 1.5, 2.5, 1, 2, 4];
  private animationFrameId: number | null = null;
  private gravity = 0.3;

  constructor(
    public balanceService: BalanceService,
    private gameService: GameService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initCanvas();
    this.createPegs();
    this.draw();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initCanvas(): void {
    this.canvas = this.canvasRef.nativeElement;
    const parent = this.canvas.parentElement!;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = 500;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    this.ctx = ctx;
  }

  // create a centered triangular peg grid based on canvas width
  private createPegs(): void {
    this.pegs = [];
    const pegRadius = 8;
    const spacing = 48;
    const rows = 8;
    const totalWidth = (rows + 1) * spacing; // rough width
    const centerX = this.canvas.width / 2;
    const startY = 80;

    for (let row = 0; row < rows; row++) {
      const cols = row + 1;
      const rowWidth = cols * spacing;
      const offsetX = centerX - rowWidth / 2;

      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing + (row % 2) * (spacing / 2);
        const y = startY + row * spacing;
        this.pegs.push({ x, y, radius: pegRadius });
      }
    }
  }

  private createBall(x: number): void {
    // clamp x inside canvas
    const cx = Math.max(8, Math.min(this.canvas.width - 8, x));
    this.ball = {
      x: cx,
      y: 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0,
      radius: 8
    };
  }

  private updateBall(): void {
    if (!this.ball) return;

    // Gravity
    this.ball.vy += this.gravity;

    // Apply gravity and friction
    this.ball.vy += this.gravity;
    this.ball.vx *= 0.999; // very small air resistance

    // Integrate
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Hranice
    if (this.ball.x - this.ball.radius < 0) {
      this.ball.x = this.ball.radius;
      this.ball.vx *= -0.8;
    }
    if (this.ball.x + this.ball.radius > this.canvas.width) {
      this.ball.x = this.canvas.width - this.ball.radius;
      this.ball.vx *= -0.8;
    }

    // Kolízia so stupmi
    for (const peg of this.pegs) {
      const dx = this.ball.x - peg.x;
      const dy = this.ball.y - peg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.ball.radius + peg.radius) {
        // Normal vector from peg to ball
        const nx = dx / dist;
        const ny = dy / dist;

        // Relative velocity
        const rvx = this.ball.vx;
        const rvy = this.ball.vy;

        // Velocity dot normal
        const velAlongNormal = rvx * nx + rvy * ny;

        // If moving into the peg, reflect
        if (velAlongNormal < 0) {
          const restitution = 0.9; // bounciness
          // v' = v - 2*(v·n)*n
          this.ball.vx = rvx - 2 * velAlongNormal * nx;
          this.ball.vy = rvy - 2 * velAlongNormal * ny;

          // apply restitution
          this.ball.vx *= restitution;
          this.ball.vy *= restitution;

          // small random tweak to avoid perfectly deterministic paths
          this.ball.vx += (Math.random() - 0.5) * 0.4;

          // push ball out of collision
          const overlap = this.ball.radius + peg.radius - dist + 0.5;
          this.ball.x += nx * overlap;
          this.ball.y += ny * overlap;
        }
      }
    }

    // Koniec hry
    if (this.ball.y - this.ball.radius > this.canvas.height - 5) {
      this.endGame();
    }
  }

  private draw(): void {
    // Vymazať canvas
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Kresliť stupňoch
    this.ctx.fillStyle = '#8b5cf6';
    for (const peg of this.pegs) {
      this.ctx.beginPath();
      this.ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Nakresliť násobiteľov
    this.ctx.fillStyle = '#10b981';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const multiplierY = this.canvas.height - 30;
    for (let i = 0; i < this.multipliers.length; i++) {
      const x = (i + 1) * (this.canvas.width / (this.multipliers.length + 1));
      this.ctx.fillRect(x - 20, multiplierY, 40, 30);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(`${this.multipliers[i]}x`, x, multiplierY + 15);
      this.ctx.fillStyle = '#10b981';
    }

    // Nakresliť lopu
    if (this.ball) {
      this.ctx.fillStyle = '#ec4899';
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.isPlaying()) {
      this.updateBall();
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  }

  playGame(): void {
    if (!this.canPlayAction()) return;

    const bet = this.currentBet;
    if (!this.balanceService.deductBet(bet)) {
      this.lastResult.set('❌ Nedostatočný balancio!');
      return;
    }

    this.isPlaying.set(true);
    this.lastResult.set('🎲 Hra beží...');
    this.createBall(this.canvas.width / 2);
    this.draw();
  }

  private endGame(): void {
    this.isPlaying.set(false);

    if (!this.ball) return;

    // Vypočítať multiplier
    // Determine slot by dividing canvas width into equal slots
    const slotWidth = this.canvas.width / this.multipliers.length;
    let multiplierIndex = Math.floor(this.ball.x / slotWidth);
    multiplierIndex = Math.max(0, Math.min(this.multipliers.length - 1, multiplierIndex));
    const multiplier = this.multipliers[multiplierIndex];

    const winnings = this.currentBet * multiplier;
    this.balanceService.addWinnings(winnings);

    // Uložiť výsledok
    this.gameService.recordGame('plinko', this.currentBet, multiplier);
  // Aktualizovať štatistiky
  this.totalGames.update(g => g + 1);
  this.totalWinnings.update(w => w + winnings);

  this.lastResult.set(
      `✅ Vyhral si ${winnings.toFixed(2)} € (Multiplier: ${multiplier}x)`
    );

    this.ball = null;
  }

  onCanvasClick(event: MouseEvent): void {
    if (this.isPlaying()) return;
    // compute click X relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    // attempt to play using click position as drop
    if (!this.canPlayAction()) return;
    const bet = this.currentBet;
    if (!this.balanceService.deductBet(bet)) {
      this.lastResult.set('❌ Nedostatočný balancio!');
      return;
    }

    this.isPlaying.set(true);
    this.lastResult.set('🎲 Hra beží...');
    this.createBall(x);
    this.draw();
  }

  // helper to determine if play is allowed
  canPlayAction(): boolean {
    return !this.isPlaying() && this.balanceService.currentBalance() >= this.currentBet && this.currentBet > 0;
  }
}
