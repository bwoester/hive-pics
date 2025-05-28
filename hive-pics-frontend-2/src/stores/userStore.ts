import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import { auth } from '@/firebase';
import { logoutUser } from '@/firebase/authService.ts';
import type { User } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {

  auth.onAuthStateChanged(firebaseUser => {
    user.value = firebaseUser;
  });

  // --- STATE PROPERTIES -----------------------------------------------------

  const user = ref<User | null>(auth.currentUser);
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // --- GETTERS --------------------------------------------------------------

  const isLoggedIn = computed(() => !!user.value);
  const userDisplayName = computed(() => user.value?.displayName || 'User');
  const userEmail = computed(() => user.value?.email);
  const userPhotoURL = computed(() => user.value?.photoURL);
  const userInitials = computed(() => {
    if (!user.value?.displayName) {
      return '?';
    }
    return user.value?.displayName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  });

  // --- ACTIONS --------------------------------------------------------------

  const init = async () => {
    // Wait for Firebase to be ready (restoring session)
    await auth.authStateReady();

    // Then set up a reactive listener (will immediately call with current user)
    auth.onAuthStateChanged(firebaseUser => {
      user.value = firebaseUser;
    });

    isInitialized.value = true;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const login = async (authResult: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      user.value = authResult.user;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Failed to login';
      }
      console.error('Login error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await logoutUser();
      user.value = null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Failed to logout';
      }
      console.error('Logout error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  const clearError = () => {
    error.value = null;
  };

  // --- PUBLIC INTERFACE -----------------------------------------------------
  //
  // > Note that you must return all state properties in setup stores for Pinia to pick them up as
  // > state. In other words, you cannot have private state properties in stores. Not returning all
  // > state properties or making them readonly will break SSR, devtools, and other plugins.
  //
  // See https://pinia.vuejs.org/core-concepts/#Setup-Stores

  return {
    user,
    isInitialized,
    isLoggedIn,
    isLoading,
    error,
    userDisplayName,
    userEmail,
    userPhotoURL,
    userInitials,
    init,
    login,
    logout,
    clearError,
  };
});
