<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div class="challenges-page">
    <h1>Gallery</h1>
    <UnderConstruction
      message="We're working hard to bring you the gallery feature. Check back soon to see which moments you've collectively captured!"
      title="Gallery Coming Soon"
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
