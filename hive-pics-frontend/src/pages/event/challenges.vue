<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div class="embla__slide">
          <ChallengeCard
            :challenge="takePhotoChallenge"
            class="ma-1"
            :prevent-dismiss="true"
            variant="tonal"
            @take-photo="handleTakePhoto"
          />
        </div>

        <div
          v-for="challenge in filteredChallenges"
          :key="challenge.id"
          class="embla__slide"
        >
          <ChallengeCard
            :challenge="challenge"
            class="ma-1"
            @dismiss="handleDismiss"
            @take-photo="handleTakePhoto"
          />
        </div>

        <div class="embla__slide">
          <ChallengeCard
            :challenge="doMoreChallenge"
            class="ma-1"
            :prevent-dismiss="true"
            :prevent-take-photo="true"
            variant="tonal"
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
import { type Challenge, useChallengeStore } from "@/stores/challengeStore.ts";

const [emblaRef] = emblaCarouselVue({ loop: false });
const challengeStore = useChallengeStore();
const { challenges } = storeToRefs(challengeStore);
const dismissedChallenges = ref<string[]>([]);

const takePhotoChallenge: Challenge = {
  id: crypto.randomUUID(),
  title: "Your Moment's Shot",
  description:
    "Simply snap a photo of something that catches your eye – no matter what it is!",
  reward: 5,
  tags: ["Spontaneous", "Random", "Simple"],
};

const doMoreChallenge: Challenge = {
  id: crypto.randomUUID(),
  title: "More Challenges",
  description:
    "Liked the challenges so far? Wanna take on some more? Click below to continue with more challenges!",
  reward: 0,
  tags: [],
};

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
