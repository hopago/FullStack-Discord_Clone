import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "devboard-9fb90.firebaseapp.com",
  projectId: "devboard-9fb90",
  storageBucket: "devboard-9fb90.appspot.com",
  messagingSenderId: "92604946504",
  appId: "1:92604946504:web:317ac3c28e4d4ca318a07d"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;