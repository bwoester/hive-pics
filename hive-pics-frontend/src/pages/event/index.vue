<script setup lang="ts">
import { useRouter } from "vue-router";
import { useEventStore } from "@/stores/eventStore.js";

const eventStore = useEventStore();

const router = useRouter();
if (eventStore.hasCurrentEventId) {
  router.replace({
    name: "/event/gallery",
  });
} else {
  router.replace({
    name: "/[...path]",
  });
}
</script>

<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div>Redirecting...</div>
</template>
