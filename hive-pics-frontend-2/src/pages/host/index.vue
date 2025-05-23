<template>
  <v-container>
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Host Dashboard</h1>
        <v-btn @click="logout">Logout</v-btn>
        <p class="text-subtitle-1">Manage your events and photo challenges</p>
      </v-col>
    </v-row>

    <!-- Create New Event Button -->
    <v-row v-if="!eventStore.isEmpty" class="mb-6">
      <v-col cols="12">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          :to="{ name: '/host/event/create' }"
        >
          Create New Event
        </v-btn>
      </v-col>
    </v-row>

    <!-- Events List -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Your Events</h2>
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
          <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: '/host/event/create' }">Create Your First Event
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  // can be defined as a global, see https://uvr.esm.is/guide/eslint.html#definepage
  // eslint-disable-next-line no-undef
  definePage({
    // alias: ['/n/:name'],
    meta: {
      requiresAuth: true,
    },
  })

  import { useEventStore } from '@/stores/event.ts'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/userStore.ts'

  const eventStore = useEventStore()
  const { events } = storeToRefs(eventStore)

  const userStore = useUserStore()
  const router = useRouter()

  async function logout (event: Event) {
    await userStore.logout()
    await router.push({ name: '/' })
    event.preventDefault()
  }

</script>
