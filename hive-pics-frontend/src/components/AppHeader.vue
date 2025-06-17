<template>
  <v-app-bar color="primary">
    <!-- Logo and AppName as link to landing page -->
    <template #prepend>
      <router-link class="mr-4 text-white" to="/" @click="handleLogoClick">
        <img alt="Logo" class="logo" src="../assets/logo.svg" />
        <span class="ml-2"><b>Hive</b> Pics</span>
      </router-link>
    </template>

    <template #append>
      <!-- Navigation links -->
      <slot name="nav-links" />

      <template v-if="isLoggedIn">
        <!-- User Info and Logout -->
        <v-menu class="ml-2" offset-y>
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
      </template>
      <template v-else>
        <v-btn class="ml-2" prepend-icon="mdi-login" to="/dashboard" variant="flat">
          Login
        </v-btn>
      </template>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.ts";

const authStore = useAuthStore();
const { isLoggedIn, userDisplayName, userPhotoURL, userInitials } = storeToRefs(authStore);

const router = useRouter();

async function logout(event: Event) {
  await authStore.logout();
  await router.push({ name: "/" });
  event.preventDefault();
}

const route = useRoute();

const handleLogoClick = (event: Event) => {
  // Check if we're already on the landing page
  if (route.path === "/") {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
</script>

<style scoped lang="sass">
a
  text-decoration: none
  display: flex
  align-items: center
.logo
  width: 40px
  height: 40px
  object-fit: contain
</style>
