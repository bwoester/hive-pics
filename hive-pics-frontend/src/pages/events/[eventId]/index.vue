<script setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const eventWithIdParam = useRoute("/events/[eventId]/");
const eventId = eventWithIdParam.params.eventId

router.replace({
  name: "/events/[eventId]/gallery",
  params: { eventId },
})
</script>

<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div>Redirecting...</div>
</template>
