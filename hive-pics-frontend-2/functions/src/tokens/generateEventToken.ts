import { CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { GuestToken } from '@shared/guestToken'

admin.initializeApp();

/**
 * Interface for the data required to generate an event token
 */
interface InputData {
  eventId: string;
}

interface OutputData {
  message: string;
  userId: string;
  eventId: string;
}

/**
 * Generates a secure, non-guessable token for a specific event.
 *
 * This Firebase callable function creates a unique token associated with an event ID.
 * The token is generated using cryptographically secure methods and stored in Firestore
 * with a timestamp for when it was issued.
 *
 * @param request - CallableRequest containing the eventId in the data property and auth information
 * @returns Object containing the generated token
 * @throws HttpsError if the user is not authenticated or if eventId is invalid
 */
export const generateEventToken = onCall<InputData, Promise<OutputData>>(async (request: CallableRequest<InputData>) => {
  // Validate authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Only authenticated hosts can generate tokens.'
    );
  }

  const userId = request.auth.uid;

  // Extract and validate eventId
  const { eventId } = request.data;

  // TODO verify the event exists and belongs to the user
  //  firestore location: users/${userId}/events/${eventId}

  if (!eventId || eventId.trim() === '') {
    throw new HttpsError(
      'invalid-argument',
      'Event ID must be a non-empty string.'
    );
  }

  // TODO change to 20-char wide, base62 encoded string. Should be ~119 bits of entropy
  // Generate a secure random token using crypto
  // Using 32 bytes (256 bits) of randomness encoded as a hex string
  const token = crypto.randomBytes(32).toString('hex');

  // Create the guest token object
  const guestToken: GuestToken = {
    token,
    eventId,
    issuedAt: Date.now(),
  };

  // Store the token in Firestore
  await admin.firestore()
    .collection('guestTokens')
    .doc(token)
    .set({
      guestToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  // TODO unsure about meaningful response.
  //  - success/ failure
  //  - eventId
  //  - token, to associate the event with it
  //  - anything else?
  return {
    message: 'Event accessed successfully',
    userId,
    eventId,
  };
});
