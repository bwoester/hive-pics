<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <!-- TODO check material design 3 about left/right padding -->
  <div class="fill-height pa-2">
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular color="primary" indeterminate />
      <p>Loading photos...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-else-if="allPhotosSorted.length === 0" class="empty-gallery">
      <p>No photos have been uploaded yet.</p>
      <p>Complete challenges to add photos to the gallery!</p>
    </div>

    <div v-else class="gallery-container">
      <!-- No grouping - show all photos -->
      <template v-if="groupingOption === 'none'">
        <div class="photo-grid">
          <div
            v-for="photo in allPhotosSorted"
            :key="photo.id"
            class="photo-card"
          >
            <img
              :alt="photo.description || 'Challenge photo'"
              class="photo-image"
              :src="photo.downloadUrl"
            />
            <div class="photo-info">
              <p v-if="photo.description" class="photo-description">
                {{ photo.description }}
              </p>
              <p class="photo-challenge">
                {{ getChallengeTitle(photo.challengeId) }}
              </p>
              <p class="photo-date">{{ formatDate(photo.createdAt) }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Group by challenge -->
      <template v-else-if="groupingOption === 'challenge'">
        <div
          v-for="(photos, challengeId) in photosByGroup"
          :key="challengeId"
          class="challenge-section"
        >
          <h3>{{ getChallengeTitle(challengeId) }}</h3>
          <div :ref="setCarouselRef(challengeId)" class="embla">
            <div class="embla__container">
              <div v-for="photo in photos" :key="photo.id" class="embla__slide">
                <div class="photo-card ma-1">
                  <img
                    :alt="photo.description || 'Challenge photo'"
                    class="photo-image"
                    :src="photo.downloadUrl"
                  />
                  <div class="photo-info">
                    <p v-if="photo.description" class="photo-description">
                      {{ photo.description }}
                    </p>
                    <p class="photo-date">{{ formatDate(photo.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Group by author -->
      <template v-else-if="groupingOption === 'author'">
        <div
          v-for="(photos, authorId) in photosByGroup"
          :key="authorId"
          class="author-section"
        >
          <h3>{{ getAuthorName(authorId) }}</h3>
          <div :ref="setCarouselRef(authorId)" class="embla">
            <div class="embla__container">
              <div v-for="photo in photos" :key="photo.id" class="embla__slide">
                <div class="photo-card ma-1">
                  <img
                    :alt="photo.description || 'Challenge photo'"
                    class="photo-image"
                    :src="photo.downloadUrl"
                  />
                  <div class="photo-info">
                    <p v-if="photo.description" class="photo-description">
                      {{ photo.description }}
                    </p>
                    <p class="photo-date">{{ formatDate(photo.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Gallery filter bottom sheet -->
    <GalleryFilterBottomSheet v-model="isBottomSheetOpen" />
  </div>
</template>

<script setup lang="ts">
import type { EmblaCarouselType } from "embla-carousel";
import EmblaCarousel from "embla-carousel";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref } from "vue";
import GalleryFilterBottomSheet from "@/components/GalleryFilterBottomSheet.vue";
import { useFab } from "@/composables/useFab";
import { useChallengeStore } from "@/stores/challengeStore.ts";
import { useGalleryStore } from "@/stores/galleryStore.ts";

const { setFabState, clearFabState } = useFab();

const galleryStore = useGalleryStore();
const challengeStore = useChallengeStore();

const { isLoading, error, photosByGroup, allPhotosSorted, groupingOption } =
  storeToRefs(galleryStore);

// Create embla carousel refs for each group
type EmblaInfo = {
  elementRef: HTMLElement;
  api: EmblaCarouselType;
};
const carouselRefs = ref<Record<string, EmblaInfo>>({});

// Bottom sheet state
const isBottomSheetOpen = ref(false);

function handleFabClick() {
  isBottomSheetOpen.value = true;
}

onMounted(() => {
  setFabState({
    icon: "mdi-filter-variant",
    onClick: handleFabClick,
  });
});

onBeforeUnmount(() => {
  clearFabState();
});

// Helper: Vue template refs don’t play nicely with dynamic keys, so we use a function.
function setCarouselRef(groupId: string) {
  return (elementRef: Element | ComponentPublicInstance | null) => {
    if (elementRef instanceof HTMLElement) {
      if (!Object.keys(carouselRefs.value).includes(groupId)) {
        const options = { loop: false };
        const emblaApi = EmblaCarousel(elementRef, options);
        carouselRefs.value[groupId] = {
          elementRef,
          api: emblaApi,
        };
      }
    } else if (
      elementRef === null &&
      Object.keys(carouselRefs.value).includes(groupId)
    ) {
      delete carouselRefs.value[groupId];
    }
  };
}

// Watch for changes in group keys to update ref map
// watch(photosByGroup, async () => {
//   await nextTick()
//   // clean up refs for removed groups
//   const keys = Object.keys(photosByGroup.value)
//   for (const key of Object.keys(carouselRefs.value)) {
//     if (!keys.includes(key)) delete carouselRefs.value[key]
//   }
// }, { deep: true })

// Function to get challenge title by ID
const getChallengeTitle = (challengeId: string): string => {
  const challenge = challengeStore.getChallengeById(challengeId);
  return challenge ? challenge.title : "Unknown Challenge";
};

// Function to get author name by ID
const getAuthorName = (authorId: string): string => {
  // This is a placeholder. In a real app, you would fetch the author's name from a user store
  return authorId === "unknown" ? "Unknown Author" : `Author ${authorId}`;
};

// Format date for display
const formatDate = (date: Date): string => {
  if (!date) return "";

  // Convert to Date object if it's not already
  const dateObj = date instanceof Date ? date : new Date(date);

  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-container {
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 1rem 0;
}

.error-message {
  color: #c62828;
  font-weight: bold;
}

.empty-gallery {
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin: 1rem 0;
}

.gallery-container {
  margin-top: 1rem;
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.photo-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.photo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.photo-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  padding: 0.75rem;
  background-color: white;
}

.photo-description {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.photo-challenge {
  color: #1976d2;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.photo-date {
  color: #757575;
  font-size: 0.8rem;
}

.challenge-section,
.author-section {
  margin-bottom: 2rem;
}

.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 90%;
  min-width: 0;
  /*margin-right: 1rem;*/
}
</style>
