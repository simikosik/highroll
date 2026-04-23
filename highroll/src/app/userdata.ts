import { Injectable, signal, inject } from '@angular/core';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthService } from './auth';

const db = getFirestore();

@Injectable({
  providedIn: 'root'
})
export class UserData {

  auth = inject(AuthService);
  role = signal<'user' | 'admin'>('user');

  balance = signal(0);

async loadUserData() {

  const user = this.auth.user();
  if (!user) return;

  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();

    this.balance.set(data['chips'] ?? 0);

    this.role.set(data['role'] ?? 'user');
  }
}
  

  async updateBalance(amount: number) {

    const user = this.auth.user();
    if (!user) return;

    const ref = doc(db, 'users', user.uid);

    this.balance.update(b => b + amount);

    await updateDoc(ref, {
      chips: this.balance()
    });
  }

}