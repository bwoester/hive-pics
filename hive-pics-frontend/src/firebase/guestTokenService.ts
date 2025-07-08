import type { GuestToken } from "@shared";
import type { Unsubscribe } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/index";

export const guestTokenService = {
  /**
   * Subscribe to tokens for a user
   * @param userId - The ID of the user
   * @param onTokensUpdate - Callback function that receives the updated tokens array
   * @returns Unsubscribe function
   */
  subscribeToTokens(
    userId: string,
    onTokensUpdate: (tokens: GuestToken[]) => void,
  ): Unsubscribe {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const tokensCollection = collection(db, "guestTokens");
    const q = query(tokensCollection, where("userId", "==", userId));

    return onSnapshot(q, (snapshot) => {
      const tokens = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate(), // Convert Timestamp to Date
        };
      }) as GuestToken[];
      onTokensUpdate(tokens);
    });
  },

  /**
   * Get a token by its ID
   * @param tokenId - The ID of the token to fetch
   * @returns Promise that resolves with the token or null if not found
   */
  async getTokenById(tokenId: string): Promise<GuestToken | null> {
    if (!tokenId) {
      throw new Error("Token ID is required");
    }

    const tokenDoc = doc(db, "guestTokens", tokenId);
    const snapshot = await getDoc(tokenDoc);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      ...data.token,
      createdAt: data.createdAt?.toDate() || data.token.createdAt, // Convert Timestamp to Date
    } as GuestToken;
  },

  /**
   * Check if a token is expired
   * @param token - The token to check
   * @param expirationDays - Number of days after which a token expires (default: 7)
   * @returns True if the token is expired, false otherwise
   */
  isTokenExpired(token: GuestToken, expirationDays = 7): boolean {
    if (!token || !token.createdAt) {
      return true;
    }

    const now = new Date();
    const expirationDate = new Date(token.createdAt);
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    return now > expirationDate;
  },

  /**
   * Check if a user is already a guest of an event
   * @param eventId - The ID of the event
   * @param userId - The ID of the user
   * @returns Promise that resolves with true if the user is a guest, false otherwise
   */
  async isUserEventGuest(eventId: string, userId: string): Promise<boolean> {
    if (!eventId || !userId) {
      return false;
    }

    const guestDoc = doc(db, `events/${eventId}/guests/${userId}`);
    const snapshot = await getDoc(guestDoc);

    return snapshot.exists();
  },
};
