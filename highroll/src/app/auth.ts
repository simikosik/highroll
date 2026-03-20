import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
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
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async logout() {
    return signOut(auth);
  }

}