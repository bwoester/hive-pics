import { CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { GuestToken } from '@shared/guestToken'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Converts a Buffer to a base62 encoded string
 * Base62 uses characters 0-9, a-z, A-Z (total of 62 characters)
 * @param buffer - The buffer to encode
 * @param length - The desired length of the output string
 * @returns A base62 encoded string
 */
function base62Encode (buffer: Buffer, length: number): string {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const base = charset.length;
  let result = '';

  // Convert buffer to a large integer
  let num = 0n;
  for (const byte of buffer) {
    num = (num << 8n) | BigInt(byte);
  }

  // Convert the integer to base62
  while (num > 0n) {
    const remainder = Number(num % BigInt(base));
    result = charset[remainder] + result;
    num = num / BigInt(base);
  }

  // Pad with random characters if needed
  while (result.length < length) {
    const randomIndex = Math.floor(Math.random() * base);
    result = charset[randomIndex] + result;
  }

  // Truncate if too long
  if (result.length > length) {
    result = result.substring(result.length - length);
  }

  return result;
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
  token: string;
  expiresAt: number;
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

  // Generate a secure random token using base62 encoding
  // 20 characters in base62 provides ~119 bits of entropy
  const TOKEN_LENGTH = 20;
  const randomBytes = crypto.randomBytes(16); // 16 bytes = 128 bits
  const token = base62Encode(randomBytes, TOKEN_LENGTH);

  // Calculate expiration time (30 days from now)
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const issuedAt = Date.now();
  const expiresAt = issuedAt + THIRTY_DAYS_MS;

  // Create the guest token object
  const guestToken: GuestToken = {
    token,
    eventId,
    issuedAt,
  };

  // Store the token in Firestore
  await admin.firestore()
    .collection('guestTokens')
    .doc(token)
    .set({
      guestToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt,
    });

  // Return a meaningful response with all relevant information
  return {
    success: true,
    message: 'Event token generated successfully',
    eventId,
    token,
    expiresAt,
  };
});
