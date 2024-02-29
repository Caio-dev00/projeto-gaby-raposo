
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAzJGrL2vj1BI3_yrH3yDoKJiCwtrk2hjc",
  authDomain: "gabiraposo.firebaseapp.com",
  projectId: "gabiraposo",
  storageBucket: "gabiraposo.appspot.com",
  messagingSenderId: "987227765581",
  appId: "1:987227765581:web:a19b3f2dfdf4f0e0b8d504",
  measurementId: "G-3PBCGZHLEC"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }