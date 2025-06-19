<template>
  <AppHeader />

  <v-main>
    <router-view />
  </v-main>

  <AppFooter class="mb-14" />

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
