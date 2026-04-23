import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { collection, doc, getDoc, getDocs, getFirestore, increment, query, updateDoc, where } from 'firebase/firestore';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  db = getFirestore();

  userId = signal('');
  amount = signal(0);
  message = signal('');

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
  }

}