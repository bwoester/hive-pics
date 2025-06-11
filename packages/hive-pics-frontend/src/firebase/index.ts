// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDkZauC3NYr9HYunbz3j_ziSRyS0YRDKdA',
  authDomain: 'hive-pics-bf360.firebaseapp.com',
  projectId: 'hive-pics-bf360',
  storageBucket: 'hive-pics-bf360.firebasestorage.app',
  messagingSenderId: '1083763322877',
  appId: '1:1083763322877:web:18812b16c45ca1eff7b394',
  measurementId: 'G-77PWSP2CWP',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
