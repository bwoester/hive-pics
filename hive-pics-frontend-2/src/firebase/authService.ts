import { auth } from './index.ts';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export async function logoutUser () {
  return auth.signOut();
}

/**
 * Initialize Firebase UI for authentication
 * @param containerSelector - CSS selector for the container element
 * @param signInSuccessCallback - Callback function to execute after successful sign-in
 * @returns FirebaseUI instance
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function initializeFirebaseUI (containerSelector: string, signInSuccessCallback: (authResult: any, redirectUrl?: string) => void) {
  // Initialize the FirebaseUI Widget using Firebase
  const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

  // FirebaseUI configuration
  const uiConfig = {
    callbacks: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      signInSuccessWithAuthResult: (authResult: any, redirectUrl?: string): boolean => {
        // User successfully signed in
        if (signInSuccessCallback) {
          signInSuccessCallback(authResult, redirectUrl);
        }
        // Do not redirect automatically - we'll handle navigation in the callback
        return false;
      },
    },
    // Privacy policy url
    privacyPolicyUrl: '#',
    // Will use popup for IDP Providers sign-in flow
    signInFlow: 'popup',
    // See https://www.npmjs.com/package/firebaseui#configuring-sign-in-providers
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url
    tosUrl: '#',
  };

  // Start the UI
  // See https://www.npmjs.com/package/firebaseui#starting-the-sign-in-flow
  // Maybe refactor?
  // if (ui.isPendingRedirect()) {
  //   ui.start(containerSelector, uiConfig);
  // }
  ui.start(containerSelector, uiConfig);

  return ui;
}
