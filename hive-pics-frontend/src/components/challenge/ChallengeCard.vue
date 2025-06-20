<template>
  <v-card>
    <template #title>
      <div class="d-flex">
        <div class="me-auto text-wrap text-break">
          {{ challenge.title }}
        </div>
        <v-btn
          class="my-1 ms-2"
          icon="mdi-close"
          size="x-small"
          @click="dismissChallenge"
        >
        </v-btn>
      </div>
    </template>

    <template #subtitle>
      <div class="d-flex flex-wrap ga-1">
        <v-chip size="x-small">
          <v-icon color="amber">mdi-star</v-icon>
          {{ challenge.reward }}
        </v-chip>
        <v-chip v-for="tag in challenge.tags" :key="tag" label size="x-small">
          {{ tag }}
        </v-chip>
      </div>
    </template>

    <template #text>
      <p class="px-2 py-7 font-italic">
        {{ challenge.description }}
      </p>
    </template>

    <template #actions>
      <v-btn
        class="mx-auto"
        prepend-icon="mdi-camera"
        stacked
        @click="takePhoto"
      >
        Take Photo
      </v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { Challenge } from "@/stores/challengeStore";

const props = defineProps<{
  challenge: Challenge;
}>();

const emit = defineEmits<{
  (e: "take-photo" | "dismiss", challengeId: string): void;
}>();

function takePhoto() {
  emit("take-photo", props.challenge.id);
}

function dismissChallenge() {
  emit("dismiss", props.challenge.id);
}
</script>

<style scoped>
/* nop */
</style>
