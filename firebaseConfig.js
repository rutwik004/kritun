// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyG6xm1VVUlVX0wAONmluzsAqnLAYtP34",
  authDomain: "kritun-bbbe9.firebaseapp.com",
  projectId: "kritun-bbbe9",
  storageBucket: "kritun-bbbe9.appspot.com",
  messagingSenderId: "731872072349",
  appId: "1:731872072349:web:18e3ab26ad6c3d9e863a74"
};

// Initialize Firebase app first
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Verify services are initialized
if (!auth || !db || !storage) {
  console.error('Firebase services not initialized properly');
  throw new Error('Firebase services not initialized properly');
}

console.log('Firebase app and services initialized successfully');

export { auth, db, storage };
