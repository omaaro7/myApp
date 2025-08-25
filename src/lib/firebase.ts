import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    "projectId": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "quizwise-t8v1g",
    "appId": process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:484235234110:web:a5fe535505fe054791ba6f",
    "storageBucket": process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "quizwise-t8v1g.appspot.com",
    "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCt-GLtX5HEsmlBsktEPJ-BiBg8dJusC0Y",
    "authDomain": process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "quizwise-t8v1g.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "484235234110"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
