import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD56KNI-3ZV4LSneUQuEBJL5TITeFRG8Ck",
  authDomain: "chat-app-4e835.firebaseapp.com",
  projectId: "chat-app-4e835",
  storageBucket: "chat-app-4e835.appspot.com",
  messagingSenderId: "962763349503",
  appId: "1:962763349503:web:151e5ed7aa59d38a9e1bca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
const collectionRef = collection(db, 'users')