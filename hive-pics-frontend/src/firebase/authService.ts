import type { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/index";

export async function logoutUser(): Promise<void> {
  return auth.signOut();
}

/**
 * Sign in with Google using a popup
 * @returns Promise with the auth result
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
