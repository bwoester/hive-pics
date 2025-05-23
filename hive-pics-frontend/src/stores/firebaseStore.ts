import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  query,
  orderBy,
  limit,
  Timestamp,
  QueryDocumentSnapshot,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore'
import type { StorageReference } from '@firebase/storage'

// Firebase configuration
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

export interface Image {
  id: string
  nickname: string
  challengeId: string
  description: string
  downloadURL: string
  likeCount: number
  reportCount: number
  createdAt: Timestamp | Date
  filename: string
}

export const useFirebaseStore = defineStore('firebase', () => {
  // State
  const eventId = ref('test-event') // TODO: Get from local storage
  const nickname = ref('nicky')
  const challengeId = ref('test-challenge')
  const images = ref<Image[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMoreImages = ref(true)
  const lastVisible = ref<QueryDocumentSnapshot | null>(null)
  const batchSize = 10 // Number of images to load per batch
  // Reference to unsubscribe function for real-time listeners
  const unsubscribe = ref<(() => void) | null>(null)

  /**
   * Uploads a photo to Firebase Storage and saves metadata to Firestore
   * @param file - The image file blob to upload
   * @param description - User provided description of the image
   * @returns Promise with the download URL
   */
  async function uploadPhotoToFirebase(file: Blob, description: string): Promise<string> {
    try {
      // Create a unique filename
      const uuid = crypto.randomUUID()
      const isoTimestamp = new Date().toISOString()
      const safeTimestamp = isoTimestamp.replace(/[:.]/g, '-')
      const filename = `images/${eventId.value}/${safeTimestamp}-${uuid}`

      // Create a reference to the storage location
      const fileRef: StorageReference = storageRef(storage, filename)

      // Upload the file
      const snapshot = await uploadBytes(fileRef, file)

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Save metadata to Firestore
      await addDoc(collection(db, `events/${eventId.value}/images`), {
        nickname: nickname.value,
        challengeId: challengeId.value,
        description,
        filename,
        downloadURL,
        likeCount: 0,
        reportCount: 0,
        createdAt: serverTimestamp(),
      })

      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Formats a timestamp for display
   * @param timestamp - The timestamp to format
   * @returns Formatted date string
   */
  function formatDate(timestamp: Timestamp | Date | null): string {
    if (!timestamp) return 'Unknown date'

    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp

    // Format: May 15, 2023 - 14:30
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  /**
   * Sets the event ID
   * @param id - The event ID to set
   */
  function setEventId(id: string) {
    eventId.value = id
    // Reset image loading state when event changes
    images.value = []
    lastVisible.value = null
    hasMoreImages.value = true

    // If we have an active subscription, refresh it for the new event
    if (unsubscribe.value) {
      unsubscribeFromImages()
      subscribeToImages()
    }
  }

  /**
   * Sets the user nickname
   * @param name - The nickname to set
   */
  function setNickname(name: string) {
    nickname.value = name
  }

  /**
   * Sets the challenge ID
   * @param id - The challenge ID to set
   */
  function setChallengeId(id: string) {
    challengeId.value = id
  }

  /**
   * Resets the error state
   */
  function clearError() {
    error.value = null
  }

  /**
   * Sets up a real-time listener for images
   */
  function subscribeToImages() {
    // Clear any existing subscription
    if (unsubscribe.value) {
      unsubscribe.value()
    }

    loading.value = true
    error.value = null

    try {
      const imagesRef = collection(db, `events/${eventId.value}/images`)
      const imagesQuery = query(imagesRef, orderBy('createdAt', 'desc'), limit(batchSize))

      // Set up the real-time listener
      unsubscribe.value = onSnapshot(
        imagesQuery,
        (snapshot: QuerySnapshot) => {
          // Map documents to our Image interface
          images.value = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              nickname: data.nickname && 'Anonymous',
              challengeId: data.challengeId && 'Unknown challenge',
              description: data.description && '',
              downloadURL: data.downloadURL && '',
              likeCount: data.likeCount && 0,
              reportCount: data.reportCount && 0,
              createdAt: data.createdAt && new Date(),
              filename: data.filename && '',
            } as Image
          })
          loading.value = false
        },
        (err) => {
          console.error('Error in snapshot listener:', err)
          error.value = 'Failed to listen to image updates. Please try again later.'
          loading.value = false
        },
      )
    } catch (err) {
      console.error('Error setting up snapshot listener:', err)
      error.value = 'Failed to set up image updates. Please try again later.'
      loading.value = false
    }
  }

  /**
   * Cleanup function to remove the subscription
   */
  function unsubscribeFromImages() {
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
  }

  return {
    // State
    eventId,
    nickname,
    challengeId,
    images,
    loading,
    error,
    hasMoreImages,

    // Actions
    uploadPhotoToFirebase,
    formatDate,
    setEventId,
    setNickname,
    setChallengeId,
    clearError,
    subscribeToImages,
    unsubscribeFromImages,
  }
})
