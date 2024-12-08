import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAG7ECeN0wFNqKb2mZce4U1UERbHJKmg",
    authDomain: "animewatchlist-5b606.firebaseapp.com",
    projectId: "animewatchlist-5b606",
    storageBucket: "animewatchlist-5b606.appspot.com",
    messagingSenderId: "543726663327",
    appId: "1:543726663327:web:c6987dfcc1b81700c2ba6a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc };
