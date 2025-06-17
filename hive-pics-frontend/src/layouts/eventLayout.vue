<template>
  <AppHeader />

  <v-main>
    <router-view />
  </v-main>

  <AppFooter class="mb-14" />

  <v-bottom-navigation>
    <v-btn :to="`/events/${eventId}/challenges`" value="challenges">
      <v-icon>mdi-camera-party-mode</v-icon>
      <span>Challenges</span>
    </v-btn>
    <v-btn :to="`/events/${eventId}/gallery`" value="gallery">
      <v-icon>mdi-image-album</v-icon>
      <span>Gallery</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
const eventWithIdParam = useRoute("/events/[eventId]/");
const eventId = eventWithIdParam.params.eventId;
</script>

<style scoped lang="sass">
</style>
