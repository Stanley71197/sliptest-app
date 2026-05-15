import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU0-JO5O4lG-N2s4-8nFxAgxyylh0BsqQ",
  authDomain: "sliptest-manager-b4da4.firebaseapp.com",
  projectId: "sliptest-manager-b4da4",
  storageBucket: "sliptest-manager-b4da4.firebasestorage.app",
  messagingSenderId: "925521868107",
  appId: "1:925521868107:web:7a50948b387835757724ce",
  measurementId: "G-WC2M3FVJE2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
