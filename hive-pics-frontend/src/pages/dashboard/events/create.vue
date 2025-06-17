<route lang="yaml">
meta:
  layout: dashboard
</route>

<template>
  <v-container>
    <v-alert
      v-if="!newEvent"
      text="Unable to create new event"
      title="Error"
      type="error"
    >
      <template #append>
        <v-btn color="error" :to="{ name: '/dashboard/' }" variant="text">
          Return to Dashboard
        </v-btn>
      </template>
    </v-alert>

    <EventForm v-else :event="newEvent" :is-new="true" />
  </v-container>
</template>

<script setup lang="ts">
import type { Event } from "@shared";
import { useEventStore } from "@/stores/eventStore.ts";

const eventStore = useEventStore();
const newEvent: Event | null = eventStore.createNewEvent();
</script>
