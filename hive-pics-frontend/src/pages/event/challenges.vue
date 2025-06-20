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

    <!-- Photo Capture Dialog -->
    <v-dialog v-model="showPhotoDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ currentChallenge ? currentChallenge.title : "Take a Photo" }}
        </v-card-title>
        <v-card-text>
          <PhotoCapture
            :is-uploading="isUploading"
            label="Challenge Photo"
            @update:file="selectedFile = $event"
            @update:preview="imagePreview = $event"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closePhotoDialog"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            :disabled="!selectedFile"
            :loading="isUploading"
            @click="uploadChallengePhoto"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import type { Challenge } from "@/stores/challengeStore.ts";
import emblaCarouselVue from "embla-carousel-vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import PhotoCapture from "@/components/shared/PhotoCapture.vue";
import { storageService } from "@/firebase/storageService.ts";
import { useChallengeStore } from "@/stores/challengeStore.ts";
import { useEventStore } from "@/stores/eventStore.ts";

const eventStore = useEventStore();
const eventId = eventStore.getCurrentEvent?.id;
const [emblaRef] = emblaCarouselVue({ loop: false });
const challengeStore = useChallengeStore();
const { challenges } = storeToRefs(challengeStore);
const dismissedChallenges = ref<string[]>([]);

// Photo capture state
const showPhotoDialog = ref(false);
const currentChallenge = ref<Challenge | null>(null);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isUploading = ref(false);

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

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
  // Find the challenge by ID
  currentChallenge.value =
    challengeId === takePhotoChallenge.id
      ? takePhotoChallenge
      : challenges.value.find((c) => c.id === challengeId) || null;

  // Open the photo dialog
  showPhotoDialog.value = true;
}

function closePhotoDialog() {
  showPhotoDialog.value = false;
  selectedFile.value = null;
  imagePreview.value = null;
  currentChallenge.value = null;
}

async function uploadChallengePhoto() {
  if (!selectedFile.value || !currentChallenge.value) return;

  try {
    isUploading.value = true;

    // Upload the image to Firebase Storage
    const imageUrl = await storageService.uploadChallengePhoto(
      selectedFile.value,
      currentChallenge.value.id,
      eventId,
    );

    console.log("Uploaded image URL:", imageUrl);

    // Here you would typically save the challenge completion to your database
    // For example: await challengeStore.completeChallenge(currentChallenge.value.id, imageUrl);

    showSuccess("Photo uploaded successfully!");

    // Close the dialog after a short delay
    setTimeout(() => {
      closePhotoDialog();
    }, 1000);
  } catch (error) {
    console.error("Error uploading challenge photo:", error);
    showError("Failed to upload photo");
  } finally {
    isUploading.value = false;
  }
}

function handleDismiss(challengeId: string) {
  dismissedChallenges.value.push(challengeId);
}

function showSuccess(message: string) {
  snackbar.value = {
    show: true,
    text: message,
    color: "success",
  };
}

function showError(message: string) {
  snackbar.value = {
    show: true,
    text: message,
    color: "error",
  };
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
