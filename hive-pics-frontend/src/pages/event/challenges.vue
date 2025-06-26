<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <!-- Simple, static "take photo" challenge -->
        <div v-if="takePhotoChallenge" class="embla__slide">
          <ChallengeCard
            :challenge="takePhotoChallenge"
            class="ma-1"
            :prevent-dismiss="true"
            variant="tonal"
            @take-photo="handleTakePhoto"
            @upload-photo="handleUploadPhoto"
          />
        </div>

        <!-- All the user's challenges -->
        <TransitionGroup name="challenge-card">
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
              @upload-photo="handleUploadPhoto"
            />
          </div>
        </TransitionGroup>

        <!-- "Get more challenges" card -->
        <div class="embla__slide">
          <v-card class="ma-1" title="More Challenges" variant="tonal">
            <template #text>
              <p class="px-2 py-7 font-italic">
                Liked the challenges so far? Wanna take on some more? Click
                below to continue with more challenges!
              </p>
            </template>

            <v-card-actions>
              <v-btn class="mx-auto" prepend-icon="mdi-cards" stacked
                >Load challenges</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>

    <!-- hidden file inputs -->

    <!-- allows to select images from device -->
    <input
      ref="selectImageInput"
      accept="image/*"
      class="d-none"
      type="file"
      @change="handleImageInputChange"
    />

    <!-- opens camera to take environment image -->
    <input
      ref="takeEnvironmentPhotoInput"
      accept="image/*"
      capture="environment"
      class="d-none"
      type="file"
      @change="handleImageInputChange"
    />

    <!-- opens camera to take user image (selfie) -->
    <input
      ref="takeUserPhotoInput"
      accept="image/*"
      capture="user"
      class="d-none"
      type="file"
      @change="handleImageInputChange"
    />

    <ImagePreviewDialog
      ref="imagePreviewDialog"
      :image-file="selectedImage"
      :show-description-input="true"
      @cancel="cancel"
      @submit="handleSubmitPhoto"
    />

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
import type { VCard } from "vuetify/components";
import type { Challenge } from "@/stores/challengeStore.ts";
import emblaCarouselVue from "embla-carousel-vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import ImagePreviewDialog from "@/components/shared/ImagePreviewDialog.vue";
import { eventService } from "@/firebase/eventService.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useChallengeStore } from "@/stores/challengeStore.ts";
import { useEventStore } from "@/stores/eventStore.ts";

const [emblaRef] = emblaCarouselVue({ loop: false });
const challengeStore = useChallengeStore();
const { takePhotoChallenge, challenges } = storeToRefs(challengeStore);
const selectedChallenge = ref<Challenge | null>(null);
const dismissedChallenges = ref<string[]>([]);

const eventStore = useEventStore();
const { currentEventId } = storeToRefs(eventStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const selectImageInput = ref<HTMLInputElement | null>(null);
const takeEnvironmentPhotoInput = ref<HTMLInputElement | null>(null);
const takeUserPhotoInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreviewDialog = ref<typeof ImagePreviewDialog | null>(null);

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const filteredChallenges = computed(() => {
  return challenges.value.filter(
    (challenge) => !dismissedChallenges.value.includes(challenge.id),
  );
});

function handleTakePhoto(challengeId: string) {
  const challenge: Challenge | null =
    challengeStore.getChallengeById(challengeId);

  if (!challenge) {
    showError("Challenge not found: " + challengeId);
    return;
  }

  selectedChallenge.value = challenge;

  const tags: string[] = challenge.tags;
  const title: string = challenge.title;
  const description: string = challenge.description;

  // Normalize everything to lowercase for case-insensitive search
  const lowerTags = tags.map((tag) => tag.toLowerCase());
  const lowerTitle = title.toLowerCase();
  const lowerDescription = description.toLowerCase();

  if (
    lowerTags.includes("selfie") ||
    lowerTitle.includes("selfie") ||
    lowerDescription.includes("selfie")
  ) {
    console.log("Taking user photo...");
    triggerTakeUserPhotoInput();
  } else {
    console.log("Taking environment photo...");
    triggerTakeEnvironmentPhotoInput();
  }
}

function handleUploadPhoto(challengeId: string) {
  const challenge: Challenge | null =
    challengeStore.getChallengeById(challengeId);

  if (!challenge) {
    showError("Challenge not found: " + challengeId);
    return;
  }

  selectedChallenge.value = challenge;

  triggerSelectImageInput();
}

function handleDismiss(challengeId: string) {
  dismissedChallenges.value.push(challengeId);
}

function triggerSelectImageInput() {
  if (selectImageInput.value) {
    selectImageInput.value.click();
  }
}

function triggerTakeEnvironmentPhotoInput() {
  if (takeEnvironmentPhotoInput.value) {
    takeEnvironmentPhotoInput.value.click();
  }
}

function triggerTakeUserPhotoInput() {
  if (takeUserPhotoInput.value) {
    takeUserPhotoInput.value.click();
  }
}

function handleImageInputChange(e: globalThis.Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) {
    showError("No image selected");
    return;
  }

  selectedImage.value = target.files[0];

  // Open the dialog after setting the image URL
  imagePreviewDialog.value?.showDialog();

  // Reset the file input so the same file can be selected again if needed
  target.value = "";
}

async function handleSubmitPhoto({
  imageFile,
  description,
}: {
  imageFile: File | null;
  description?: string;
}) {
  const userId: string | null = user.value?.uid || null;

  if (!userId) {
    showError("No current user");
    return;
  }

  const eventId: string | null = currentEventId.value;

  if (!eventId) {
    showError("No current event selected");
    return;
  }

  const challengeId: string | null = selectedChallenge.value?.id || null;

  if (!challengeId) {
    showError("No challenge selected");
    return;
  }

  if (imageFile === null) {
    showError("No image selected");
    return;
  }

  try {
    await eventService.addChallengePhoto(
      userId,
      eventId,
      challengeId,
      imageFile,
      description,
    );

    // TODO complete challenge

    showSuccess("Challenge completed!");
  } catch (error) {
    showError("Error submitting challenge: " + error);
  }

}

function cancel() {
  // nothing to do?
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

.challenge-card-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.challenge-card-leave-to {
  opacity: 0;
  transform: translateY(100px) scale(0.7);
}

/* Apply color to the card and all its children */
.challenge-card-leave-to .v-card {
  background-color: rgba(244, 67, 54, 0.3) !important;
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
