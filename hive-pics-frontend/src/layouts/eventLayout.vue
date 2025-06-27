<template>
  <!-- Top App Bar -->
  <AppHeader />

  <!-- Main Content -->
  <v-main class="d-flex flex-column">
    <v-container class="flex-grow-1">
      <router-view />
    </v-container>

    <!-- Footer inside v-main, above bottom nav -->
    <AppFooter />
  </v-main>

  <!-- Bottom Navigation -->
  <v-bottom-navigation app>
    <v-btn to="/event/challenges" value="challenges">
      <v-icon>mdi-camera-party-mode</v-icon>
      <span>Challenges</span>
    </v-btn>
    <v-btn to="/event/gallery" value="gallery">
      <v-icon>mdi-image-album</v-icon>
      <span>Gallery</span>
    </v-btn>
    <v-btn to="/event/leaderboard" value="leaderboard">
      <v-icon>mdi-podium</v-icon>
      <span>Ranks</span>
    </v-btn>
  </v-bottom-navigation>

  <!-- FAB: Only rendered if defined -->
  <v-fab
    v-show="!!fabState"
    :active="fabState?.active ?? false"
    app
    :elevation="fabState?.elevation ?? 8"
    :icon="fabState?.icon ?? 'mdi-filter-variant'"
    @click="fabState?.onClick"
  >
  </v-fab>
</template>

<script lang="ts" setup>
import { useFab } from "@/composables/useFab";

const { fabState } = useFab();
</script>

<style scoped lang="sass">
</style>
