import { Component, inject, signal, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { collection, doc, getDoc, getDocs, getFirestore, increment, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { MatchHistoryEntry } from '../stats';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  db = getFirestore();
  private ngZone = inject(NgZone);

  userId = signal('');
  amount = signal(0);
  message = signal('');
  userData = signal<any | null>(null);
  matchHistory = signal<MatchHistoryEntry[]>([]);
  historyMessage = signal('');
  historyLoading = signal(false);

  private async resolveUserRef(identifier: string) {
    if (identifier.includes('@')) {
      const q = query(collection(this.db, 'users'), where('email', '==', identifier));
      const snap = await getDocs(q);
      return snap.docs[0]?.ref ?? null;
    }

    return doc(this.db, 'users', identifier);
  }

  async addBalance() {

    const identifier = this.userId().trim();
    const value = this.amount();

    if (!identifier || value <= 0) {
      this.message.set('Please enter a valid UID or email and a positive amount.');
      return;
    }

    const ref = await this.resolveUserRef(identifier);
    if (!ref) {
      this.message.set('User not found. Use the user UID or registered email.');
      return;
    }

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.message.set('User document not found.');
      return;
    }

    await updateDoc(ref, {
      chips: increment(value)
    });

    this.message.set(`Added $${value} to user ${identifier}.`);
    // refresh user info if visible
    if (this.userData()) {
      await this.ngZone.run(() => this.getUser());
    }
  }

  async clearBalance() {
    const identifier = this.userId().trim();

    if (!identifier) {
      this.message.set('Please enter a valid UID or email.');
      return;
    }

    const ref = await this.resolveUserRef(identifier);
    if (!ref) {
      this.message.set('User not found. Use the user UID or registered email.');
      return;
    }

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.message.set('User document not found.');
      return;
    }

    await updateDoc(ref, {
      chips: 0
    });

    this.message.set(`Cleared balance for user ${identifier}.`);
    if (this.userData()) {
      await this.ngZone.run(() => this.getUser());
    }
  }

  async getUser() {
    const identifier = this.userId().trim();
    if (!identifier) {
      this.message.set('Enter UID or email to fetch user.');
      return;
    }

    const ref = await this.resolveUserRef(identifier);
    if (!ref) {
      this.message.set('User not found.');
      this.userData.set(null);
      return;
    }

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.message.set('User document not found.');
      this.userData.set(null);
      this.matchHistory.set([]);
      this.historyMessage.set('');
      return;
    }

    const data = snap.data();
    this.userData.set({ uid: snap.id, email: data?.['email'], chips: data?.['chips'] ?? 0 });
    this.message.set('User loaded.');
    await this.loadMatchHistory(snap.id);
  }

  private async loadMatchHistory(uid: string) {
    this.matchHistory.set([]);
    this.historyLoading.set(true);
    this.historyMessage.set('Loading match history...');

    try {
      const historyQuery = query(
        collection(this.db, 'users', uid, 'matchHistory'),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(historyQuery);
      const history = snap.docs.map(docSnapshot => {
        const data = docSnapshot.data() as any;
        const rawTimestamp = data.timestamp;
        const timestamp = rawTimestamp && typeof rawTimestamp.toDate === 'function'
          ? rawTimestamp.toDate()
          : rawTimestamp instanceof Date
            ? rawTimestamp
            : new Date();

        return {
          ...data,
          id: docSnapshot.id,
          result: data.result,
          timestamp,
          gameType: data.gameType,
          betAmount: data.betAmount,
          score: data.score
        } as MatchHistoryEntry;
      });

      this.matchHistory.set(history);
      this.historyMessage.set(history.length ? '' : 'No match history found for this user.');
    } catch (error) {
      console.error('Failed to load match history:', error);
      this.matchHistory.set([]);
      this.historyMessage.set('Unable to load match history at this time.');
    } finally {
      this.historyLoading.set(false);
    }
  }

}