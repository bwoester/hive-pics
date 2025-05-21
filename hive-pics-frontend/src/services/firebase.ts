import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'
import type { StorageReference } from '@firebase/storage'

// Your Firebase configuration.
// Replace it with your actual Firebase config when available
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

/**
 * Uploads a photo to Firebase Storage and saves metadata to Firestore
 * @param file - The image file blob to upload
 * @param description - User provided description of the image
 * @returns Promise with the download URL
 */
export async function uploadPhotoToFirebase(file: Blob, description: string): Promise<string> {
  try {
    // Create a unique filename
    const filename = `photos/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    // Create a reference to the storage location
    const storageRef: StorageReference = ref(storage, filename)

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    // Save metadata to Firestore
    await addDoc(collection(db, 'photos'), {
      url: downloadURL,
      description: description,
      createdAt: serverTimestamp(),
      filename: filename,
    })

    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
