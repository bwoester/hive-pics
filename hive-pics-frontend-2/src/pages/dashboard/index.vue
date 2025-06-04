<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

<template>
  <v-container>

    <!-- Create New Event Button -->
    <v-row v-if="!eventStore.isEmpty" class="mb-6">
      <v-col cols="12">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          :to="{ name: '/dashboard/event/create' }"
        >
          Create New Event
        </v-btn>
      </v-col>
    </v-row>

    <!-- Events List -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Your Events and Photo Challenges</h2>
      </v-col>
    </v-row>

    <v-row v-if="!eventStore.isEmpty">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </v-row>

    <!-- Empty State (shown when no events) -->
    <v-row v-if="eventStore.isEmpty">
      <v-col class="text-center" cols="12">
        <v-sheet class="pa-10 rounded">
          <v-icon class="mb-4" color="grey-lighten-1" size="x-large">mdi-calendar-blank</v-icon>
          <h3 class="text-h5 mb-2">No Events Yet</h3>
          <p class="mb-4">You haven't created any events yet. Get started by creating your first event!</p>
          <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: '/dashboard/event/create' }">Create Your First Event
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useEventStore } from '@/stores/eventStore.ts'

  const eventStore = useEventStore()
  const { events } = storeToRefs(eventStore)
</script>
