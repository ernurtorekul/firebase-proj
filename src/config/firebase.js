// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA3DxNEvZlTwXNAF6HmFXLu8fB4OiAiyLA",
  authDomain: "first-project-28915.firebaseapp.com",
  projectId: "first-project-28915",
  storageBucket: "first-project-28915.appspot.com",
  messagingSenderId: "415941096067",
  appId: "1:415941096067:web:e7aedf083fa69caafde1b6",
  measurementId: "G-G5TZ910YNN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)