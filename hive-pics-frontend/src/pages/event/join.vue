<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" sm="8">
        <v-card class="mx-auto" max-width="500">
          <v-card-text class="text-center pa-6">
            <div v-if="loading">
              <v-progress-circular
                color="primary"
                indeterminate
                size="64"
              ></v-progress-circular>
              <p class="mt-4 text-body-1">Validating your invitation...</p>
            </div>

            <div v-else-if="error" class="error-container">
              <v-icon class="mb-4" color="error" size="64">mdi-alert-circle</v-icon>
              <h2 class="text-h5 mb-4">{{ errorTitle }}</h2>
              <p class="text-body-1">{{ error }}</p>
              <v-btn
                class="mt-6"
                color="primary"
                to="/"
                variant="elevated"
              >
                Return to Home
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { guestTokenService } from '@/firebase/guestTokenService';
import { auth } from '@/firebase/index';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);

const errorTitle = computed(() => {
  if (error.value?.includes('expired')) {
    return 'Invitation Expired';
  } else if (error.value?.includes('invalid')) {
    return 'Invalid Invitation';
  } else {
    return 'Error';
  }
});

onMounted(() => {
  const tokenId = route.query.t as string;

  if (!tokenId) {
    error.value = 'No invitation token provided. Please check your link and try again.';
    loading.value = false;
    return;
  }

  // Listen for auth state changes
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      // Fetch the token data
      const token = await guestTokenService.getTokenById(tokenId);

      // Check if token exists
      if (!token) {
        error.value = 'This invitation link is invalid. Please check with the event host for a valid link.';
        loading.value = false;
        return;
      }

      // Check if token is expired
      if (guestTokenService.isTokenExpired(token)) {
        error.value = 'This invitation has expired. Please contact the event host for a new invitation.';
        loading.value = false;
        return;
      }

      // If user is authenticated, check if they're already a guest
      if (user) {
        const isGuest = await guestTokenService.isUserEventGuest(token.eventId, user.uid);

        if (isGuest) {
          // User is already a guest, redirect to gallery
          router.push(`/event/${token.eventId}/gallery`);
          return;
        }
      }

      // Otherwise, store token info in localStorage and redirect to guest landing page
      localStorage.setItem('guestToken', JSON.stringify({
        token: tokenId,
        eventId: token.eventId,
        hostId: token.userId
      }));

      // Redirect to GuestLandingPage (we'll create this component next)
      router.push({
        path: `/event/${token.eventId}`,
        query: { mode: 'guest' }
      });

    } catch (error_) {
      console.error('Error processing token:', error_);
      error.value = 'An error occurred while processing your invitation. Please try again later.';
    } finally {
      loading.value = false;
      unsubscribe(); // Clean up auth listener
    }
  });
});
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}
</style>
