<template>
  <div class="login-container">
    <v-card class="login-card" elevation="8">
      <v-card-title class="text-center">
        <h1 class="login-title">Hive Pics</h1>
      </v-card-title>
      <v-card-text>
        <p class="text-center mb-6">Sign in to continue</p>
        <!-- FirebaseUI auth container -->
        <div id="firebaseui-auth-container" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/userStore.ts';
  import { initializeFirebaseUI } from '../firebase/authService.ts';
  import * as firebaseui from 'firebaseui';

  const router = useRouter();
  const userStore = useUserStore();

  // Initialize FirebaseUI when component is mounted
  let uiInstance: firebaseui.auth.AuthUI | null = null;

  onMounted(() => {
    // Only initialize if user is not already logged in
    if (!userStore.isLoggedIn) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const signInSuccessCallback = (authResult: any) => {
        // persist auth result in pinia store
        userStore.login(authResult)
        // Successful login callback - redirect to home or previous page
        router.push('/host/');
      }
      uiInstance = initializeFirebaseUI('#firebaseui-auth-container', signInSuccessCallback);
    }
  });

  // Clean up UI instance when the component is unmounted
  onUnmounted(() => {
    if (uiInstance) {
      uiInstance.delete();
    }
  });
</script>

<style scoped>
/* no styling yet */
</style>
