
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs, query, where, updateDoc,
arrayUnion, arrayRemove, onSnapshot, serverTimestamp, orderBy, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCasO9957ikrOm7nw5tCf-U27RQOrLq-EU",
  authDomain: "project-1-e38c4.firebaseapp.com",
  projectId: "project-1-e38c4",
  storageBucket: "project-1-e38c4.appspot.com",
  messagingSenderId: "824697359973",
  appId: "1:824697359973:web:9c80e8e6db74ab233dc08c",
  measurementId: "G-VTJWYM6KGW"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, createUserWithEmailAndPassword, db, collection, addDoc, onAuthStateChanged, 
signInWithEmailAndPassword, setDoc, doc, getDoc, signOut, getDocs, query, where, updateDoc, 
arrayUnion, arrayRemove, onSnapshot, serverTimestamp, orderBy, increment}