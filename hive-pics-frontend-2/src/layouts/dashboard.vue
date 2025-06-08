<template>
  <v-app-bar color="primary">

    <!-- Logo and AppName as link to landing page -->
    <template #prepend>
      <router-link class="mr-4 text-white logo" to="/">
        <img
          alt="Logo"
          src="@/assets/logo-no-text.png"
        >
        <span class="ml-2"><b>Hive</b> Pics</span>
      </router-link>
    </template>

    <v-toolbar-title class="d-none d-md-flex text-truncate">Dashboard</v-toolbar-title>

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

  async function logout (event: Event) {
    await authStore.logout()
    await router.push({ name: '/' })
    event.preventDefault()
  }
</script>

<style scoped lang="sass">
a.logo
  text-decoration: none
  display: flex
  align-items: center
  img
    width: 40px
    height: 40px
    object-fit: contain
</style>
