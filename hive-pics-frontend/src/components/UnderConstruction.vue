<template>
  <div class="under-construction">
    <div class="construction-icon">
      <div class="icon">🚧</div>
    </div>
    <h2 class="construction-title">{{ title }}</h2>
    <p class="construction-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Under Construction",
  },
  message: {
    type: String,
    default:
      "This page is currently under construction. Please check back later.",
  },
});
</script>

<style scoped>
.under-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 50vh;
}

.construction-icon {
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 4rem;
  line-height: 1;
}

.construction-title {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.construction-message {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
}
</style>
