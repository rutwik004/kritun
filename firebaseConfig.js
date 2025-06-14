// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAyG6xm1VVUlVX0wAONmluzsAqnLAYtP34",
    authDomain: "kritun-bbbe9.firebaseapp.com",
    projectId: "kritun-bbbe9",
    storageBucket: "kritun-bbbe9.firebasestorage.app",
    messagingSenderId: "731872072349",
    appId: "1:731872072349:web:18e3ab26ad6c3d9e863a74"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
