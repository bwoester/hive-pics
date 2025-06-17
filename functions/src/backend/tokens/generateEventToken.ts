import {
  CallableRequest,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import { getFirestore } from "firebase-admin/firestore";
import { guestTokenService } from "@/services/guestTokenService";
import type { GuestToken } from "@shared";

/**
 * Interface for the data required to generate an event token
 */
interface InputData {
  eventId: string;
}

interface OutputData {
  success: boolean;
  message: string;
  eventId: string;
}

/**
 * Generates a secure, non-guessable token for a specific event.
 *
 * This Firebase callable function creates a unique token associated with an event ID.
 * The token is generated using cryptographically secure methods and stored in Firestore
 * with a timestamp for when it was issued. Tokens do not expire automatically.
 *
 * @param request - CallableRequest containing the eventId in the data property and auth information
 * @returns Object containing success status, message, and eventId
 * @throws HttpsError if the user is not authenticated or if eventId is invalid
 */
export const generateEventToken = onCall<InputData, Promise<OutputData>>(
  {
    region: "europe-west1",
  },
  async (request: CallableRequest<InputData>) => {
    // Validate authentication
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Only authenticated hosts can generate tokens.",
      );
    }

    const userId = request.auth.uid;

    // Extract and validate eventId
    const { eventId } = request.data;

    if (!eventId || eventId.trim() === "") {
      throw new HttpsError(
        "invalid-argument",
        "Event ID must be a non-empty string.",
      );
    }

    const db = getFirestore();

    // Verify the event exists and belongs to the user
    const eventRef = db.doc(`users/${userId}/events/${eventId}`);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      throw new HttpsError(
        "not-found",
        "Event not found or you do not have permission to access it.",
      );
    }

    // Create a new token
    const token: GuestToken = guestTokenService.createNewToken(eventId, userId);

    // Save the created token
    await guestTokenService.saveToken(token);

    // Return a meaningful response without the token
    return {
      success: true,
      message: "Event token generated successfully",
      eventId,
    };
  },
);
