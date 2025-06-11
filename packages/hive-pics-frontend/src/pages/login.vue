<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="login-card">
          <v-card-title class="text-center">
            <h1 class="login-title">Hive Pics</h1>
          </v-card-title>
          <v-card-text>
            <p class="text-center mb-6">Sign in to continue</p>
            <div class="d-flex justify-center">
              <v-btn
                class="mt-4"
                color="primary"
                :loading="isLoading"
                prepend-icon="mdi-google"
                variant="outlined"
                @click="handleGoogleSignIn"
              >
                Sign in with Google
              </v-btn>
            </div>
            <v-alert
              v-if="error"
              class="mt-4"
              closable
              density="compact"
              type="error"
              @click:close="error = ''"
            >
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore.ts'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { isLoggedIn, isLoading, error } = storeToRefs(authStore)

  /**
   * Handle Google sign-in button click
   */
  const handleGoogleSignIn = async () => {
    // Get the redirect path from the query parameters or fall back to '/dashboard/'
    const redirectPath = route.query.redirect as string || '/dashboard/'
    if (isLoggedIn.value) {
      await router.push(redirectPath)
      return
    }
    await authStore.login()
    await router.push(redirectPath)
  }
</script>

<style scoped>
/* none yet */
</style>
