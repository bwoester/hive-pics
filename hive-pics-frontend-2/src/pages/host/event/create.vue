<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

<template>
  <v-container>
    <EventForm :event="defaultEvent" />
  </v-container>
</template>

<script setup lang="ts">
  import type { Event } from '@/stores/event.ts'

  const defaultEvent: Event = {
    title: '',
    description: '',
    date: new Date().toISOString().substring(0, 10),
    location: '',
    isPublic: true,
    capacity: undefined,
    imageUrl: '',
  }

</script>
