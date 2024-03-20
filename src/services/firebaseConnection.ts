
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCV3aRIAVQc275wT1ZYHv_Nk0YuH4R676c",
  authDomain: "gabiraposo2.firebaseapp.com",
  projectId: "gabiraposo2",
  storageBucket: "gabiraposo2.appspot.com",
  messagingSenderId: "157437268774",
  appId: "1:157437268774:web:c578ba5d66a2f4a31527e7",
  measurementId: "G-W2FEEYYGHF"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }