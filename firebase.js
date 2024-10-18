
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Konfiguracja Firebase (skopiowana z konsoli Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAZiFvZ4LTNDYuiTi515USs9xXH75vzhLI",
  authDomain: "askbuchen.firebaseapp.com",
  projectId: "askbuchen",
  storageBucket: "askbuchen.appspot.com",
  messagingSenderId: "310309105518",
  appId: "1:310309105518:web:a1d3a33a70265f31f01b7f",
  measurementId: "G-BFNB1NQW28"
};

// Inicjalizacja Firebase - upewnij się, że inicjalizujemy tylko raz
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicjalizacja Firestore
export const db = getFirestore(app);

// Inicjalizacja Auth z wykorzystaniem AsyncStorage dla trwałej autoryzacji
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
