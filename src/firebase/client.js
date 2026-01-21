// src/firebase/client.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDjgIeEPZMKKid8f6ThXI0ItMBNU7lhsWM',
  authDomain: 'https://baustein-oper-app.firebaseapp.com',
  projectId: 'baustein-oper-app',
  storageBucket: 'https://baustein-oper-app.firebasestorage.app',
  messagingSenderId: '1010075960785',
  appId: '1:1010075960785:web:258bc148c3d95ed7734cf0',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);