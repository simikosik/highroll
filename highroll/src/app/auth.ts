import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';

import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCyDTf47II7bTt7prK1KpfWE2O7xgVTcYE",
  authDomain: "highrollak.firebaseapp.com",
  projectId: "highrollak",
  storageBucket: "highrollak.firebasestorage.app",
  messagingSenderId: "204854273778",
  appId: "1:204854273778:web:20804876cbf4f96b33526b",
  measurementId: "G-HMT8ZKZCDD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (u) => {
      this.user.set(u);
    });
  }

  async register(email: string, password: string) {

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    this.user.set(cred.user);

    const userRef = doc(db, 'users', cred.user.uid);

    await setDoc(userRef, {
      email: cred.user.email,
      createdAt: new Date(),
      chips: 1000,
      role: 'user',
      wins: 0,
      losses: 0,
      lossStreak: 0
    }, { merge: true });

    return cred;
  }

  async login(email: string, password: string) {

    const cred = await signInWithEmailAndPassword(auth, email, password);
    this.user.set(cred.user);

    const userRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: cred.user.email,
        wins: 0,
        losses: 0,
        lossStreak: 0
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: cred.user.email,
        wins: userSnap.data()['wins'] ?? 0,
        losses: userSnap.data()['losses'] ?? 0,
        lossStreak: userSnap.data()['lossStreak'] ?? 0
      }, { merge: true });
    }

    return cred;
  }

  async loginWithGoogle() {

    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    this.user.set(cred.user);

    const userRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: cred.user.email,
        createdAt: new Date(),
        chips: 1000,
        role: 'user',
        wins: 0,
        losses: 0,
        lossStreak: 0
      });
    } else {
      await setDoc(userRef, {
        email: cred.user.email,
        wins: snap.data()['wins'] ?? 0,
        losses: snap.data()['losses'] ?? 0,
        lossStreak: snap.data()['lossStreak'] ?? 0
      }, { merge: true });
    }

    return cred;
  }

  async logout() {
    return signOut(auth);
  }

}