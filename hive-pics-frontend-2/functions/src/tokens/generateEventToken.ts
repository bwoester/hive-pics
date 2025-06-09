import { CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { GuestToken } from '@shared/guestToken'
import basex from 'base-x';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

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
 * with a timestamp for when it was issued. The token is also directly updated in the event document.
 * Tokens do not expire automatically.
 *
 * @param request - CallableRequest containing the eventId in the data property and auth information
 * @returns Object containing success status, message, and eventId
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

  if (!eventId || eventId.trim() === '') {
    throw new HttpsError(
      'invalid-argument',
      'Event ID must be a non-empty string.'
    );
  }

  // Verify the event exists and belongs to the user
  const eventRef = admin.firestore().doc(`users/${userId}/events/${eventId}`);
  const eventDoc = await eventRef.get();

  if (!eventDoc.exists) {
    throw new HttpsError(
      'not-found',
      'Event not found or you do not have permission to access it.'
    );
  }

  // Generate a secure random token using basex for base62 encoding
  // 20 characters in base62 provides ~119 bits of entropy
  const TOKEN_LENGTH = 20;
  const randomBytes: Buffer<ArrayBufferLike> = crypto.randomBytes(16); // 16 bytes = 128 bits

  // Encode the random bytes using base62 alphabet with basex
  const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const base62 = basex(BASE62_ALPHABET)
  let token = base62.encode(Buffer.from(randomBytes));

  // Ensure the token is the correct length
  while (token.length < TOKEN_LENGTH) {
    const randomNum = Math.floor(Math.random() * 62);
    token = BASE62_ALPHABET[randomNum] + token;
  }

  // Truncate if too long
  if (token.length > TOKEN_LENGTH) {
    token = token.substring(token.length - TOKEN_LENGTH);
  }

  // Record the current timestamp
  const createdAt = new Date();

  // Create the guest token object
  const guestToken: GuestToken = {
    token,
    eventId,
    createdAt,
  };

  // Store the token in Firestore
  await admin.firestore()
    .collection('guestTokens')
    .doc(token)
    .set({
      guestToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  // Update the event document with the token
  await eventRef.update({
    token,
  });

  // Return a meaningful response without the token
  return {
    success: true,
    message: 'Event token generated successfully',
    eventId,
  };
});
