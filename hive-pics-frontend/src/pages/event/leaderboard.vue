<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div class="leaderboard-page">
    <h1>Leaderboard</h1>
    <UnderConstruction
      message="We're working hard to bring you the leaderboard feature. Check back soon to see how you rank against other participants!"
      title="Leaderboard Coming Soon"
    />
  </div>
</template>

<script setup lang="ts">
import UnderConstruction from "@/components/UnderConstruction.vue";
</script>

<style scoped>
.leaderboard-page {
  padding: 1rem;
}
</style>
