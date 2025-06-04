<template>
  <v-app-bar color="primary">
    <!-- Logo on the left -->
    <v-app-bar-nav-icon class="d-sm-none" @click="onMenuClick" />
    <v-img
      alt="Logo"
      class="mr-2 d-none d-sm-inline"
      max-height="32"
      max-width="32"
      src="@/assets/logo.png"
    />
    <v-toolbar-title class="text-truncate">Dashboard</v-toolbar-title>

    <!-- Spacer pushes user info to the right -->
    <v-spacer />

    <!-- User Info and Logout -->
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-avatar size="32">
            <template v-if="userPhotoURL">
              <v-img :src="userPhotoURL" />
            </template>
            <template v-else>
              {{ userInitials }}
            </template>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>{{ userDisplayName }}</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <v-list-item-title class="text-red">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-main>
    <!-- Content max width, centered -->
    <v-container class="py-4" max-width="1280">
      <router-view />
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '@/stores/authStore.ts';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore()
  const router = useRouter()

  const { userDisplayName, userPhotoURL, userInitials } = storeToRefs(authStore);

  function onMenuClick () {
  // Optional: trigger a sidebar menu
  }

  async function logout (event: Event) {
    await authStore.logout()
    await router.push({ name: '/' })
    event.preventDefault()
  }

</script>
