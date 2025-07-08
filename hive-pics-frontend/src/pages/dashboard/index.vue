<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

<template>
  <v-container>
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
        @share="handleShareEvent"
      />
    </v-row>

    <!-- Empty State (shown when no events) -->
    <v-row v-if="eventStore.isEmpty">
      <v-col class="text-center" cols="12">
        <v-sheet class="pa-10 rounded">
          <v-icon class="mb-4" color="grey-lighten-1" size="x-large"
            >mdi-calendar-blank</v-icon
          >
          <h3 class="text-h5 mb-2">No Events Yet</h3>
          <p class="mb-4">
            You haven't created any events yet. Get started by creating your
            first event!
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            :to="{ name: '/dashboard/events/create' }"
            >Create Your First Event
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Share Event Bottom Sheet -->
    <ShareEventBottomSheet
      v-model="isShareBottomSheetOpen"
      :event="selectedEvent"
    />
  </v-container>
</template>

<script lang="ts" setup>
import type { Event } from "@shared";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ShareEventBottomSheet from "@/components/ShareEventBottomSheet.vue";
import { useFab } from "@/composables/useFab";
import { useEventStore } from "@/stores/eventStore.ts";

const eventStore = useEventStore();
const { events } = storeToRefs(eventStore);

// FAB setup
const { setFabState, clearFabState } = useFab();

const router = useRouter();

function handleFabClick() {
  // Navigate to create event page
  router.push({ name: "/dashboard/events/create" });
}

onMounted(() => {
  setFabState({
    icon: "mdi-plus",
    onClick: handleFabClick,
  });
});

onBeforeUnmount(() => {
  clearFabState();
});

// Share bottom sheet setup
const isShareBottomSheetOpen = ref(false);
const selectedEvent = ref<Event | undefined>(undefined);

function handleShareEvent(event: Event) {
  selectedEvent.value = event;
  isShareBottomSheetOpen.value = true;
}
</script>
