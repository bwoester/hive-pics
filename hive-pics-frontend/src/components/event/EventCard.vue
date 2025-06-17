<template>
  <v-col cols="12" lg="4" md="6">
    <v-card>
      <v-img cover height="200" :src="imageUrl" />
      <v-card-title>{{ event.title }}</v-card-title>
      <v-card-text>
        <p>{{ event.description }}</p>
      </v-card-text>
      <v-card-actions>
        <router-link :to="{ name: '/dashboard/' }" />

        <v-btn
          color="primary"
          prepend-icon="mdi-pencil"
          :to="`/dashboard/events/${event.id}`"
          variant="text"
          >Edit</v-btn
        >
        <v-btn
          color="primary"
          prepend-icon="mdi-eye"
          :to="`/events/${event.id}/`"
          variant="text"
          >View Event</v-btn
        >
        <v-spacer />
        <v-btn icon="mdi-dots-vertical" variant="text" />
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import type { Event } from "@shared";

const props = defineProps<{
  event: Event;
}>();

const imageUrl = computed(
  () => props.event.coverImageUrl || "https://picsum.photos/500/300?random=1",
);
</script>

<style scoped></style>
