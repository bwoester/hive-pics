<route lang="yaml">
meta:
  layout: dashboard
</route>

<template>
  <v-container>
    <v-alert
      v-if="!event"
      text="Unable to open event"
      title="Error"
      type="error"
    >
      <template #append>
        <v-btn color="error" :to="{ name: '/dashboard/' }" variant="text">
          Return to Dashboard
        </v-btn>
      </template>
    </v-alert>

    <EventForm v-else :event="event" :is-new="false" />
  </v-container>
</template>

<script setup lang="ts">
import type { Event } from "@shared";
import { useEventStore } from "@/stores/eventStore.ts";
const eventStore = useEventStore();

const eventWithIdParam = useRoute("/dashboard/events/[id]");
const eventId = eventWithIdParam.params.id;

const event: Event | null = eventStore.getEventById(eventId);
</script>

<style scoped>
/* Add styles here */
</style>
