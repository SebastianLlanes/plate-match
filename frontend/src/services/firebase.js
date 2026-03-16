import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4CG-odGVYZVn3cTsA4pW-GxP7ysQkYc0",
  authDomain: "plate-match-8f9a7.firebaseapp.com",
  projectId: "plate-match-8f9a7",
  storageBucket: "plate-match-8f9a7.firebasestorage.app",
  messagingSenderId: "566197008452",
  appId: "1:566197008452:web:9654c55bdb6f1788032411",
  measurementId: "G-1NJ0PP0YF1"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
