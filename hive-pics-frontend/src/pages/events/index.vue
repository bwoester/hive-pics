<!-- src/pages/events/index.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
router.replace('/404') // or navigate somewhere appropriate
</script>

<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div>Redirecting to 404...</div>
</template>
