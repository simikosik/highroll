export interface GameResult {
  id: string;
  userId: string;
  gameType: 'plinko' | 'dice' | 'slots' | 'roulette';
  bet: number;
  multiplier: number;
  winAmount: number;
  playedAt: Date;
}

export interface PlinkoGame {
  bet: number;
  multiplier: number;
  ballX: number;
  ballY: number;
}
