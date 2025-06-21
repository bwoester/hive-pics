<template>
  <v-card :variant="challengeCardProps.variant">
    <template #title>
      <div class="d-flex">
        <div class="me-auto text-wrap text-break">
          {{ challenge.title }}
        </div>
        <v-btn
          v-if="!challengeCardProps.preventDismiss"
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
      <div class="d-flex align-center w-100">
        <v-btn prepend-icon="mdi-camera" @click="takePhoto"> Take Photo </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="ms-auto"
              icon="mdi-dots-vertical"
              variant="text"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item
              prepend-icon="mdi-upload"
              title="Upload Photo"
              @click="uploadPhoto"
            />
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { VCard } from "vuetify/components";
import type { Challenge } from "@/stores/challengeStore";
type Variant = VCard["$props"]["variant"];

const challengeCardProps = withDefaults(
  defineProps<{
    challenge: Challenge;
    variant?: Variant;
    preventDismiss?: boolean;
  }>(),
  {
    variant: undefined,
    preventDismiss: false,
  },
);

const emit = defineEmits<{
  "take-photo": [challengeId: string];
  "upload-photo": [challengeId: string];
  dismiss: [challengeId: string];
}>();

function takePhoto() {
  emit("take-photo", challengeCardProps.challenge.id);
}

function uploadPhoto() {
  emit("upload-photo", challengeCardProps.challenge.id);
}

function dismissChallenge() {
  emit("dismiss", challengeCardProps.challenge.id);
}
</script>

<style scoped>
/* nop */
</style>
