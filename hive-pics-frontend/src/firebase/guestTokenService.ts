import type { GuestToken } from "@shared";
import type { Unsubscribe } from "firebase/firestore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
};
