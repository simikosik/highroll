import { Injectable } from '@angular/core';
import { Card } from '../bjcard/bjcard';

export interface AdviceResult {
  move: string;
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  calculateAdvice(hand: Card[], dealerCard: Card, total: number): AdviceResult {

    if (!hand || hand.length === 0 || !dealerCard) {
      return { move: '', explanation: '' };
    }

    if (hand.length === 2 && hand[0].rank === hand[1].rank) {
      return this.handlePairStrategy(hand[0].rank, dealerCard, total);
    }

    // Check if this is a soft hand (Ace counts as 11)
    const isSoft = this.isSoftHand(hand);
    const hardTotal = this.getHardTotal(hand);
    const totalDisplay = this.getTotalDisplay(hardTotal, total);
    
    if (isSoft) {
      return this.handleSoftHandStrategy(total, dealerCard, totalDisplay);
    }

    return this.handleHardHandStrategy(total, dealerCard, totalDisplay);
  }

  /**
   * Get formatted total display (e.g., "5/15" for A+4)
   */
  private getTotalDisplay(hardTotal: number, softTotal: number): string {
    if (hardTotal === softTotal) {
      return softTotal.toString();
    }
    return `${hardTotal}/${softTotal}`;
  }

  /**
   * Calculate the hard total (all Aces count as 1)
   */
  private getHardTotal(hand: Card[]): number {
    let total = 0;
    for (const card of hand) {
      if (card.rank === 'A') {
        total += 1;
      } else {
        total += card.value;
      }
    }
    return total;
  }

  /**
   * Determine if a hand is "soft" (has an Ace that counts as 11)
   * A hand is soft if it has an Ace and the minimum total + 10 <= 21
   */
  private isSoftHand(hand: Card[]): boolean {
    const hasAce = hand.some(c => c.rank === 'A');
    if (!hasAce) return false;

    // Calculate minimum total (all Aces count as 1)
    let minTotal = 0;
    for (const card of hand) {
      if (card.rank === 'A') {
        minTotal += 1;
      } else {
        minTotal += card.value;
      }
    }

    // If we can count one Ace as 11 without busting, it's soft
    return (minTotal + 10) <= 21;
  }

  private handlePairStrategy(rank: string, dealerCard: Card, total: number): AdviceResult {
    switch (rank) {
      case 'A':
        return {
          move: 'SPLIT',
          explanation: 'A-A split (win ~56%). Silná dlhodobá stratégia – 2 silné soft hands.'
        };
      case '8':
        return {
          move: 'SPLIT',
          explanation: '8-8 split (win ~54%). Vyhýbaš sa 16, jednej z najhorších rúk.'
        };
      case '9':
        return this.handleNinesPair(dealerCard);
      case '7':
        return this.handleSevensPair(dealerCard);
      case '6':
        return this.handleSixesPair(dealerCard);
      case '5':
        return {
          move: 'DOUBLE',
          explanation: '5-5 → total 10 (win ~63% vs dealer). Double je silnejší než split.'
        };
      case '4':
        return this.handleFoursPair(dealerCard);
      case '3':
      case '2':
        return this.handleTwosThreesPair(dealerCard);
      case '10':
        return {
          move: 'STAND',
          explanation: '10-10 (win ~82%). Nikdy nesplituj – extrémne silná ruka.'
        };
      default:
        return { move: 'HIT', explanation: 'Neznáma situácia.' };
    }
  }

  private handleNinesPair(dealerCard: Card): AdviceResult {
    if (dealerCard.rank === 'A' || dealerCard.rank === '10') {
      return {
        move: 'STAND',
        explanation: '9-9 vs silná karta (win ~53%). Split by zhoršil EV.'
      };
    }
    if (dealerCard.rank === '7') {
      return {
        move: 'STAND',
        explanation: '9-9 vs 7 (win ~57%). Silná standing pozícia.'
      };
    }
    return {
      move: 'SPLIT',
      explanation: '9-9 split (win ~60%). Silná výhoda proti slabším kartám.'
    };
  }

  private handleSevensPair(dealerCard: Card): AdviceResult {
    if (dealerCard.rank === '8' || dealerCard.rank === '9' || dealerCard.rank === '10' || dealerCard.rank === 'A') {
      return {
        move: 'HIT',
        explanation: '7-7 vs silný dealer (win ~41%). Split nie je výhodný.'
      };
    }
    return {
      move: 'SPLIT',
      explanation: '7-7 vs slabší dealer (win ~62%). Dobrá split situácia.'
    };
  }

  private handleSixesPair(dealerCard: Card): AdviceResult {
    if (dealerCard.rank === '2' || dealerCard.rank === '3' || dealerCard.rank === '4' ||
        dealerCard.rank === '5' || dealerCard.rank === '6') {
      return {
        move: 'SPLIT',
        explanation: '6-6 vs slabý dealer (win ~64%). Silná split situácia.'
      };
    }
    return {
      move: 'HIT',
      explanation: '6-6 vs silný dealer (win ~42%). Split by zvýšil risk.'
    };
  }

  private handleFoursPair(dealerCard: Card): AdviceResult {
    if (dealerCard.rank === '5' || dealerCard.rank === '6') {
      return {
        move: 'SPLIT',
        explanation: '4-4 vs 5-6 (win ~55%). Situácia kde split dáva zmysel.'
      };
    }
    return {
      move: 'HIT',
      explanation: '4-4 (win ~49%). Split väčšinou nie je výhodný.'
    };
  }

  private handleTwosThreesPair(dealerCard: Card): AdviceResult {
    if (dealerCard.rank === '4' || dealerCard.rank === '5' || dealerCard.rank === '6') {
      return {
        move: 'SPLIT',
        explanation: '2-2 / 3-3 vs slabý dealer (win ~58%). Výhodný split.'
      };
    }
    return {
      move: 'HIT',
      explanation: '2-2 / 3-3 vs silný dealer (win ~44%). Hit je bezpečnejší.'
    };
  }

  private handleSoftHandStrategy(total: number, dealerCard: Card, totalDisplay: string): AdviceResult {

    if (total === 21) {
      return { move: 'STAND', explanation: `Soft 21 (${totalDisplay}, win ~100%). Blackjack / max value.` };
    }

    if (total === 20) {
      return { move: 'STAND', explanation: `Soft 20 (${totalDisplay}, win ~94%). Takmer neprehrávaš.` };
    }

    if (total === 19) {
      if (dealerCard.rank === '6') {
        return { move: 'DOUBLE', explanation: `Soft 19 (${totalDisplay}) vs 6 (win ~72%). Double má vysoké EV.` };
      }
      return { move: 'STAND', explanation: `Soft 19 (${totalDisplay}, win ~87%). Veľmi silná ruka.` };
    }

    if (total === 18) {
      if (dealerCard.rank === '9' || dealerCard.rank === '10' || dealerCard.rank === 'A') {
        return { move: 'HIT', explanation: `Soft 18 (${totalDisplay}) vs silný dealer (win ~48%). Hit je lepší.` };
      }
      if (dealerCard.rank === '6') {
        return { move: 'DOUBLE', explanation: `Soft 18 (${totalDisplay}) vs 6 (win ~69%). Silný double spot.` };
      }
      return { move: 'STAND', explanation: `Soft 18 (${totalDisplay}, win ~72%). Stabilná ruka.` };
    }

    if (total === 17) {
      if (dealerCard.rank === '3' || dealerCard.rank === '4' || dealerCard.rank === '5' || dealerCard.rank === '6') {
        return { move: 'DOUBLE', explanation: `Soft 17 (${totalDisplay}) vs slabý dealer (win ~61%). Double je +EV.` };
      }
      return { move: 'HIT', explanation: `Soft 17 (${totalDisplay}, win ~52%). Hit na zlepšenie.` };
    }

    return {
      move: 'HIT',
      explanation: `Soft hand (${totalDisplay}, win ~45–55%). Snaha o zlepšenie ruky.`
    };
  }

  private handleHardHandStrategy(total: number, dealerCard: Card, totalDisplay: string): AdviceResult {

    if (total === 21) return { move: 'STAND', explanation: `Hard 21 (${totalDisplay}, win ~100%).` };
    if (total === 20) return { move: 'STAND', explanation: `Hard 20 (${totalDisplay}, win ~92%).` };
    if (total === 19) return { move: 'STAND', explanation: `Hard 19 (${totalDisplay}, win ~88%).` };
    if (total === 18) return { move: 'STAND', explanation: `Hard 18 (${totalDisplay}, win ~82%).` };

    if (total === 17) return { move: 'STAND', explanation: `Hard 17 (${totalDisplay}, win ~78%).` };

    if (total === 16) {
      if (dealerCard.value <= 6) {
        return { move: 'STAND', explanation: `Hard 16 (${totalDisplay}) vs slabý dealer (win ~58%).` };
      }
      return { move: 'HIT', explanation: `Hard 16 (${totalDisplay}) vs silný dealer (win ~42%).` };
    }

    if (total === 15) {
      if (dealerCard.value <= 6) {
        return { move: 'STAND', explanation: `Hard 15 (${totalDisplay}, win ~55%).` };
      }
      return { move: 'HIT', explanation: `Hard 15 (${totalDisplay}, win ~40%).` };
    }

    if (total === 14) {
      if (dealerCard.value <= 6) {
        return { move: 'STAND', explanation: `Hard 14 (${totalDisplay}, win ~52%).` };
      }
      return { move: 'HIT', explanation: `Hard 14 (${totalDisplay}, win ~38%).` };
    }

    if (total === 13) {
      if (dealerCard.value <= 6) {
        return { move: 'STAND', explanation: `Hard 13 (${totalDisplay}, win ~50%).` };
      }
      return { move: 'HIT', explanation: `Hard 13 (${totalDisplay}, win ~36%).` };
    }

    if (total === 12) {
      if (dealerCard.value === 4 || dealerCard.value === 5 || dealerCard.value === 6) {
        return { move: 'STAND', explanation: `Hard 12 (${totalDisplay}, win ~54%).` };
      }
      return { move: 'HIT', explanation: `Hard 12 (${totalDisplay}, win ~41%).` };
    }

    if (total === 11) {
      return { move: 'DOUBLE', explanation: `Hard 11 (${totalDisplay}, win ~64%). BEST double spot.` };
    }

    if (total === 10) {
      return { move: 'DOUBLE', explanation: `Hard 10 (${totalDisplay}, win ~61%). Silný double spot.` };
    }

    return { move: 'HIT', explanation: `Low hand (${totalDisplay}, win ~30–45%).` };
  }
}