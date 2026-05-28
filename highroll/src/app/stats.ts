import { Injectable, signal, inject, effect } from '@angular/core';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

import { AuthService } from './auth';

const db = getFirestore();

export interface MatchHistoryEntry {
  id?: string;
  result: 'win' | 'loss';
  timestamp: Date;
  gameType: string;
  betAmount?: number;
  score?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Stats {

  auth = inject(AuthService);

  wins = signal(0);
  losses = signal(0);
  lossStreak = signal(0);
  history = signal<MatchHistoryEntry[]>([]);

  private statsUnsub: (() => void) | null = null;
  private historyUnsub: (() => void) | null = null;

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.startStatsSync(user.uid);
        this.startHistorySync(user.uid);
      } else {
        this.stopStatsSync();
        this.stopHistorySync();
        this.wins.set(0);
        this.losses.set(0);
        this.lossStreak.set(0);
        this.history.set([]);
      }
    });
  }

  private stopStatsSync() {
    if (this.statsUnsub) {
      this.statsUnsub();
      this.statsUnsub = null;
    }
  }

  private stopHistorySync() {
    if (this.historyUnsub) {
      this.historyUnsub();
      this.historyUnsub = null;
    }
  }

  private startHistorySync(uid: string) {
    this.stopHistorySync();

    const historyQuery = query(
      collection(db, 'users', uid, 'matchHistory'),
      orderBy('timestamp', 'desc')
    );

    this.historyUnsub = onSnapshot(historyQuery, (snap) => {
      const entries = snap.docs.map(docSnapshot => {
        const data = docSnapshot.data() as any;
        const rawTimestamp = data.timestamp;
        const timestamp = rawTimestamp && typeof rawTimestamp.toDate === 'function'
          ? rawTimestamp.toDate()
          : rawTimestamp instanceof Date
            ? rawTimestamp
            : new Date();

        return {
          id: docSnapshot.id,
          result: data.result,
          timestamp,
          gameType: data.gameType,
          betAmount: data.betAmount,
          score: data.score
        } as MatchHistoryEntry;
      });

      this.history.set(entries);
    }, (error) => {
      console.error('Match history realtime sync failed:', error);
    });
  }

  private async addMatchHistoryEntry(entry: Omit<MatchHistoryEntry, 'id'>) {
    const user = this.auth.user();
    if (!user) return;

    await addDoc(collection(db, 'users', user.uid, 'matchHistory'), entry);
  }

  private async startStatsSync(uid: string) {
    this.stopStatsSync();

    const userRef = doc(db, 'users', uid);
    this.statsUnsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        this.wins.set(data['wins'] ?? 0);
        this.losses.set(data['losses'] ?? 0);
        this.lossStreak.set(data['lossStreak'] ?? 0);
        return;
      }

      setDoc(userRef, {
        wins: 0,
        losses: 0,
        lossStreak: 0
      }, { merge: true }).catch(error => {
        console.error('Failed to initialize user stats:', error);
      });
    }, (error) => {
      console.error('Stats realtime sync failed:', error);
    });
  }

  async loadStats() {
    const user = this.auth.user();
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      this.wins.set(data['wins'] ?? 0);
      this.losses.set(data['losses'] ?? 0);
      this.lossStreak.set(data['lossStreak'] ?? 0);
      return;
    }

    await setDoc(userRef, {
      wins: 0,
      losses: 0,
      lossStreak: 0
    }, { merge: true });
  }

  async recordWin(details: { gameType: string; betAmount?: number; score?: number }) {
    const user = this.auth.user();
    if (!user) return;

    this.wins.update(v => v + 1);
    this.lossStreak.set(0);

    const userRef = doc(db, 'users', user.uid);

    await setDoc(userRef, {
      wins: this.wins(),
      losses: this.losses(),
      lossStreak: 0
    }, { merge: true });

    await this.addMatchHistoryEntry({
      result: 'win',
      timestamp: new Date(),
      gameType: details.gameType,
      betAmount: details.betAmount,
      score: details.score
    });
  }

  async recordLoss(details: { gameType: string; betAmount?: number; score?: number }) {
    const user = this.auth.user();
    if (!user) return;

    this.losses.update(v => v + 1);
    this.lossStreak.update(v => v + 1);

    const userRef = doc(db, 'users', user.uid);

    await setDoc(userRef, {
      wins: this.wins(),
      losses: this.losses(),
      lossStreak: this.lossStreak()
    }, { merge: true });

    await this.addMatchHistoryEntry({
      result: 'loss',
      timestamp: new Date(),
      gameType: details.gameType,
      betAmount: details.betAmount,
      score: details.score
    });
  }

  getWinRate(): number {

    const total = this.wins() + this.losses();

    if (total === 0) return 0;

    return Math.round((this.wins() / total) * 100);

  }

  getHouseEdge(): string {

    const total = this.wins() + this.losses();

    if (total === 0) return '0%';

    const edge = ((this.losses() - this.wins()) / total) * 100;

    return edge.toFixed(1) + '%';

  }

}