import type { User } from "firebase/auth";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "@/firebase";
import { logoutUser, signInWithGoogle } from "@/firebase/authService.ts";

export const useAuthStore = defineStore("auth", () => {
  const route = useRoute();
  const router = useRouter();

  auth.onAuthStateChanged(async (firebaseUser) => {
    const wasLoggedIn = !!user.value;
    const isNowLoggedIn = !!firebaseUser;
    user.value = firebaseUser;

    // Detect automatic signouts
    if (
      wasLoggedIn &&
      !isNowLoggedIn &&
      !isUserInitiatedLogout.value &&
      route.meta.requiresAuth
    ) {
      // User was logged out automatically
      error.value = "You have been signed out. Please sign in again.";

      // Could emit an event or call a callback here
      await router.push({
        name: "/login",
        query: { redirect: route.fullPath },
      });
    }

    // Reset the flag
    isUserInitiatedLogout.value = false;
  });

  // --- STATE PROPERTIES -----------------------------------------------------

  const user = ref<User | null>(auth.currentUser);
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isUserInitiatedLogout = ref(false);

  // --- GETTERS --------------------------------------------------------------

  const isLoggedIn = computed(() => !!user.value);
  const userDisplayName = computed(() => user.value?.displayName || "User");
  const userEmail = computed(() => user.value?.email);
  const userPhotoURL = computed(() => user.value?.photoURL);
  const userInitials = computed(() => {
    if (!user.value?.displayName) {
      return "?";
    }
    return user.value?.displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  });

  // --- ACTIONS --------------------------------------------------------------

  const init = async () => {
    // Wait for Firebase to be ready (restoring session)
    await auth.authStateReady();

    // Then set up a reactive listener (will immediately call with current user)
    auth.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser;
    });

    isInitialized.value = true;
  };

  const login = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await signInWithGoogle();
      // No need to set user.value as it will be handled by onAuthStateChanged
    } catch (error_: unknown) {
      error.value =
        error_ instanceof Error ? error_.message : "Failed to login";
      console.error("Login error:", error_);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Set flag before logout
      isUserInitiatedLogout.value = true;
      await logoutUser();
      // No need to set user.value = null as it will be handled by onAuthStateChanged
    } catch (error_: unknown) {
      error.value =
        error_ instanceof Error ? error_.message : "Failed to logout";
      console.error("Logout error:", error_);
    } finally {
      isLoading.value = false;
    }
  };

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
