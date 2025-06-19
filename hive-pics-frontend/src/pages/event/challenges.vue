<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div class="challenges-page">
    <h1>Challenges</h1>
    <UnderConstruction
      message="We're working hard to bring you exciting photo challenges. Check back soon to start participating and earning achievements!"
      title="Challenges Coming Soon"
    />
  </div>
</template>

<script setup lang="ts">
import UnderConstruction from "@/components/UnderConstruction.vue";
</script>

<style scoped>
.challenges-page {
  padding: 1rem;
}
</style>
