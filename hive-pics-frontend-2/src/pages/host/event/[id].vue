<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

<template>
  <v-container>
    <EventForm :event="event" />
  </v-container>
</template>

<script setup lang="ts">
  import type { Event } from '@/stores/event.ts'
  import { useEventStore } from '@/stores/event.ts'
  const eventStore = useEventStore()

  const eventWithIdParam = useRoute('/host/event/[id]')
  const eventId = eventWithIdParam.params.id

  const defaultEvent: Event = {
    title: '',
    description: '',
    date: new Date().toISOString().substring(0, 10),
    location: '',
    isPublic: true,
    capacity: undefined,
    imageUrl: '',
  }

  const event: Event = eventStore.getEventById(eventId) || defaultEvent

</script>

<style scoped>
/* Add styles here */
</style>
