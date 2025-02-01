import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA25ML8c5XLVB3iPC4f3APflsz9hPUe-hs",
  authDomain: "amana-ca738.firebaseapp.com",
  projectId: "amana-ca738",
  storageBucket: "amana-ca738.firebasestorage.app",
  messagingSenderId: "911070886874",
  appId: "1:911070886874:web:ed9fb0c6833fef894d9ee3",
  measurementId: "G-LJ8KSVGZEH"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

