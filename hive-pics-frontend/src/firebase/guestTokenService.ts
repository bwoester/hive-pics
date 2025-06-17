import type { GuestToken } from '@shared'
import type { Unsubscribe } from 'firebase/firestore'
import {
  collection,
  onSnapshot,
  query,
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

}
