
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCvn80prdmFwj-v0n32-nlTnocZCteDVIo",
  authDomain: "gabi-raposo.firebaseapp.com",
  projectId: "gabi-raposo",
  storageBucket: "gabi-raposo.appspot.com",
  messagingSenderId: "378008628738",
  appId: "1:378008628738:web:f173e043d0f7479682c11b",
  measurementId: "G-K3CES1P4P2"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }