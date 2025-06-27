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
  <v-bottom-navigation>
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
</template>

<script lang="ts" setup>
// nop
</script>

<style scoped lang="sass"></style>
