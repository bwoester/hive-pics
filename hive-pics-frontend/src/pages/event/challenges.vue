<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div
          v-for="challenge in filteredChallenges"
          :key="challenge.id"
          class="embla__slide"
        >
          <ChallengeCard
            :challenge="challenge"
            class="card ma-1"
            @dismiss="handleDismiss"
            @take-photo="handleTakePhoto"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import { useChallengeStore } from "@/stores/challengeStore.ts";

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: false });
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
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  flex: 0 0 90%;
  min-width: 0;
}
</style>
