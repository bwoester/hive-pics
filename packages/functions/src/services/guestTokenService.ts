import type { GuestToken } from "@hivepics/shared";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

export const guestTokenService = {
  /**
   * Create a new token for an event
   * @param eventId - The ID of the event
   * @param userId - The ID of the user
   * @returns The created token
   */
  createNewToken(eventId: string, userId: string): GuestToken {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }

    const db = getFirestore();
    const tokenRef = db.collection("guestTokens").doc();

    return {
      token: tokenRef.id,
      userId,
      eventId,
      createdAt: new Date(),
    };
  },

  /**
   * Save a token to Firestore
   * @param token - The token to save
   * @returns Promise that resolves when the token is saved
   */
  async saveToken(token: GuestToken): Promise<void> {
    if (!token.token) {
      throw new Error("Token ID is required");
    }

    const db = getFirestore();
    await db.collection("guestTokens").doc(token.token).set({
      token,
      createdAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a token from Firestore
   * @param tokenId - The ID of the token to delete
   * @returns Promise that resolves when the token is deleted
   */
  async deleteToken(tokenId: string): Promise<void> {
    if (!tokenId) {
      throw new Error("Token ID is required");
    }

    const db = getFirestore();
    await db.doc(`guestTokens/${tokenId}`).delete();
  },
};
