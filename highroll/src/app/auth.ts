import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {getFirestore, doc, setDoc} from 'firebase/firestore';
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

    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      createdAt: new Date(),
      chips: 1000,
      wins: 0,
      losses: 0
    });

    return cred;
  }

  async login(email: string, password: string) {

    const cred = await signInWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email
    }, { merge: true });

    return cred;
  }

  async loginWithGoogle() {

    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      chips: 1000,
      wins: 0,
      losses: 0
    }, { merge: true });

    return cred;
  }

  async logout() {
    return signOut(auth);
  }

}