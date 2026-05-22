import { Injectable, signal, inject } from '@angular/core';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

import { AuthService } from './auth';

const db = getFirestore();

@Injectable({
  providedIn: 'root'
})
export class Stats {

  auth = inject(AuthService);

  wins = signal(0);
  losses = signal(0);
  lossStreak = signal(0);

  async loadStats() {

    const user = this.auth.user();
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    this.wins.set(data['wins'] ?? 0);
    this.losses.set(data['losses'] ?? 0);
    this.lossStreak.set(data['lossStreak'] ?? 0);

  }

  async recordWin() {

    const user = this.auth.user();
    if (!user) return;

    this.wins.update(v => v + 1);
    this.lossStreak.set(0);

    const ref = doc(db, 'users', user.uid);

    await updateDoc(ref, {
      wins: this.wins(),
      lossStreak: 0
    });

  }

  async recordLoss() {

    const user = this.auth.user();
    if (!user) return;

    this.losses.update(v => v + 1);
    this.lossStreak.update(v => v + 1);

    const ref = doc(db, 'users', user.uid);

    await updateDoc(ref, {
      losses: this.losses(),
      lossStreak: this.lossStreak()
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