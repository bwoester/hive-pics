import type { GuestToken } from '@hivepics/shared'
import type { Unsubscribe } from 'firebase/firestore'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase/index'

type TokenListener = (tokens: GuestToken[]) => void

export const guestTokenService = {
  // Map to store active subscriptions by userId
  _subscriptions: new Map<string, {
    unsubscribe: Unsubscribe
    listeners: Set<TokenListener>
  }>(),

  /**
   * Subscribe to tokens for a user
   * @param userId - The ID of the user
   * @param listener - Callback function that receives the updated tokens array
   * @returns Unsubscribe function
   */
  subscribeToTokens (userId: string, listener: TokenListener): () => void {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Check if we already have a subscription for this userId
    const existingSubscription = this._subscriptions.get(userId)

    if (existingSubscription) {
      // Add the new listener
      existingSubscription.listeners.add(listener)

      // Immediately invoke the listener with current data
      // This is handled by the onSnapshot callback when a new subscription is created
      return () => {
        // Remove this listener
        existingSubscription.listeners.delete(listener)

        // If no more listeners, unsubscribe from Firestore
        if (existingSubscription.listeners.size === 0) {
          existingSubscription.unsubscribe()
          this._subscriptions.delete(userId)
        }
      }
    }

    // Create a new subscription
    const tokensCollection = collection(db, 'guestTokens')
    const q = query(tokensCollection, where('userId', '==', userId))

    const unsubscribe = onSnapshot(q, snapshot => {
      const tokens = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate(), // Convert Timestamp to Date
          token: doc.id,
        } as GuestToken
      })

      // Notify all listeners
      const subscription = this._subscriptions.get(userId)
      if (subscription) {
        for (const listener of subscription.listeners) {
          listener(tokens)
        }
      }
    })

    // Store the subscription and listener
    this._subscriptions.set(userId, {
      unsubscribe,
      listeners: new Set([listener]),
    })

    // Return a function to unsubscribe this specific listener
    return () => {
      const subscription = this._subscriptions.get(userId)
      if (subscription) {
        subscription.listeners.delete(listener)

        // If no more listeners, unsubscribe from Firestore
        if (subscription.listeners.size === 0) {
          subscription.unsubscribe()
          this._subscriptions.delete(userId)
        }
      }
    }
  },

  /**
   * Create a new token for an event
   * @param eventId - The ID of the event
   * @param userId - The ID of the user
   * @returns The created token
   */
  createNewToken (eventId: string, userId: string): GuestToken {
    if (!eventId) {
      throw new Error('Event ID is required')
    }
    if (!userId) {
      throw new Error('User ID is required')
    }

    const tokenRef = doc(collection(db, 'guestTokens'))
    return {
      token: tokenRef.id,
      userId,
      eventId,
      createdAt: new Date(),
    }
  },

  /**
   * Save a token to Firestore
   * @param token - The token to save
   * @returns Promise that resolves when the token is saved
   */
  async saveToken (token: GuestToken): Promise<void> {
    if (!token.token) {
      throw new Error('Token ID is required')
    }

    const tokenDoc = doc(db, 'guestTokens', token.token)
    await setDoc(tokenDoc, token)
  },

  /**
   * Delete a token from Firestore
   * @param tokenId - The ID of the token to delete
   * @returns Promise that resolves when the token is deleted
   */
  async deleteToken (tokenId: string): Promise<void> {
    if (!tokenId) {
      throw new Error('Token ID is required')
    }

    const tokenDoc = doc(db, 'guestTokens', tokenId)
    await deleteDoc(tokenDoc)
  },
}
