/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Initialize Firebase Admin SDK
import { initializeApp } from "firebase-admin/app";
initializeApp();

// Cloud Function exports
import { generateEventToken } from "./tokens/generateEventToken.js";
import { onImageResizeStart } from "./onImageResized";
import { onImageResizeSuccess } from "./onImageResized";
import { onImageResizeError } from "./onImageResized";
import { onImageResizeCompletion } from "./onImageResized";

export { generateEventToken };
export { onImageResizeStart };
export { onImageResizeSuccess };
export { onImageResizeError };
export { onImageResizeCompletion };
