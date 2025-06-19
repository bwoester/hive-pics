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
          variant="text"
          @click="viewEvent"
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
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/eventStore.ts";

const props = defineProps<{
  event: Event;
}>();

const imageUrl = computed(
  () => props.event.coverImageUrl || "https://picsum.photos/500/300?random=1",
);

const eventStore = useEventStore();
const router = useRouter();

function viewEvent() {
  eventStore.setCurrentEventId(props.event.id);
  router.push({ name: "/event/gallery" });
}
</script>

<style scoped></style>
