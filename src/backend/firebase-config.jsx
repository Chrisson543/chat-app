import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
const collectionRef = collection(db, 'users')
