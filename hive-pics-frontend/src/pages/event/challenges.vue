<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <v-carousel
    class="peek-carousel"
    :continuous="false"
    :hide-delimiters="true"
    progress="primary"
    :show-arrows="false"
  >
    <v-carousel-item
      v-for="challenge in filteredChallenges"
      :key="challenge.id"
      class="peek-carousel-item"
    >
      <div class="d-flex justify-center align-center h-100">
        <div class="challenge-card-container">
          <ChallengeCard
            :challenge="challenge"
            @dismiss="handleDismiss"
            @take-photo="handleTakePhoto"
          />
        </div>
      </div>
    </v-carousel-item>
  </v-carousel>

  <v-slide-group class="peek-carousel">
    <div class="d-flex flex-wrap">
      <v-slide-group-item
        v-for="challenge in filteredChallenges"
        :key="challenge.id"
      >
        <ChallengeCard
          :challenge="challenge"
          class="card ma-1"
          @dismiss="handleDismiss"
          @take-photo="handleTakePhoto"
        />
      </v-slide-group-item>
    </div>
  </v-slide-group>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import { useChallengeStore } from "@/stores/challengeStore.ts";

const challengeStore = useChallengeStore();
const { challenges } = storeToRefs(challengeStore);
const dismissedChallenges = ref<string[]>([]);

const filteredChallenges = computed(() => {
  return challenges.value.filter(
    (challenge) => !dismissedChallenges.value.includes(challenge.id),
  );
});

function handleTakePhoto(challengeId: string) {
  // Navigate to camera page or open camera
  console.log(`Taking photo for challenge: ${challengeId}`);
  // Example: router.push({ name: 'camera', params: { challengeId } });
}

function handleDismiss(challengeId: string) {
  dismissedChallenges.value.push(challengeId);
}
</script>

<style scoped>
.card {
  width: 320px;
}
</style>
