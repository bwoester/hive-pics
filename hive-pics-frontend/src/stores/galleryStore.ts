import type { ChallengePhoto } from "@shared";
import type { Unsubscribe } from "firebase/firestore";
// Utilities
import { onSnapshot, query } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { eventService } from "@/firebase/eventService.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useEventStore } from "@/stores/eventStore.ts";

// Types for gallery filtering and sorting
export type GalleryGroupingOption = "none" | "author" | "challenge";
export type GallerySortingOption = "createdAt" | "likes";
export type GallerySortingDirection = "asc" | "desc";

export const useGalleryStore = defineStore("gallery", () => {
  const photos = ref<ChallengePhoto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const eventStore = useEventStore();
  const authStore = useAuthStore();

  // Gallery filtering and sorting options
  const groupingOption = ref<GalleryGroupingOption>("none");
  const sortingOption = ref<GallerySortingOption>("createdAt");
  const sortingDirection = ref<GallerySortingDirection>("desc");

  // Keep track of active subscriptions
  let photosUnsubscribe: Unsubscribe | null = null;

  // Getters
  const getPhotoById = computed(() => (id: string) => {
    return photos.value.find((photo) => photo.id === id) || null;
  });

  const getPhotosByChallengeId = computed(() => (challengeId: string) => {
    return photos.value.filter((photo) => photo.challengeId === challengeId);
  });

  // Group photos based on selected grouping option
  const photosByGroup = computed(() => {
    const grouped: Record<string, ChallengePhoto[]> = {};

    switch (groupingOption.value) {
      case "none": {
        grouped["all"] = [...photos.value];
        break;
      }
      case "challenge": {
        // Group by challenge
        for (const photo of photos.value) {
          if (!grouped[photo.challengeId]) {
            grouped[photo.challengeId] = [];
          }
          grouped[photo.challengeId].push(photo);
        }
        break;
      }
      case "author": {
        // Group by author
        for (const photo of photos.value) {
          const authorId = photo.userId || "unknown";
          if (!grouped[authorId]) {
            grouped[authorId] = [];
          }
          grouped[authorId].push(photo);
        }
        break;
      }
    }

    // Sort photos within each group
    for (const groupId of Object.keys(grouped)) {
      grouped[groupId] = sortPhotos(grouped[groupId]);
    }

    return grouped;
  });

  // For backward compatibility
  const photosByChallenge = computed(() => {
    if (groupingOption.value === "challenge") {
      return photosByGroup.value;
    }

    // Create a challenge-grouped view even if that's not the current grouping
    const grouped: Record<string, ChallengePhoto[]> = {};

    for (const photo of photos.value) {
      if (!grouped[photo.challengeId]) {
        grouped[photo.challengeId] = [];
      }
      grouped[photo.challengeId].push(photo);
    }

    // Sort photos within each group
    for (const challengeId of Object.keys(grouped)) {
      grouped[challengeId] = sortPhotos(grouped[challengeId]);
    }

    return grouped;
  });

  // All photos sorted according to current sorting options
  const allPhotosSorted = computed(() => {
    return sortPhotos([...photos.value]);
  });

  // Helper function to sort photos based on current sorting options
  function sortPhotos(photosToSort: ChallengePhoto[]): ChallengePhoto[] {
    return [...photosToSort].sort((a, b) => {
      let comparison = 0;

      if (sortingOption.value === "createdAt") {
        comparison = b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortingOption.value === "likes") {
        // TODO likes not yet counted
        // comparison = (b.likes || 0) - (a.likes || 0);
      }

      // Reverse the comparison if sorting direction is ascending
      return sortingDirection.value === "asc" ? -comparison : comparison;
    });
  }

  // Actions
  function subscribeToPhotos() {
    if (!eventStore.currentEventId) {
      error.value = "No current event selected";
      return;
    }

    // Clean up existing subscription if any
    unsubscribeFromPhotos();

    isLoading.value = true;
    error.value = null;

    try {
      // TODO how to get host user ID?
      const wrongUserId = authStore.user?.uid || "";
      const photosCollection = eventService.challengePhotosCollection(
        wrongUserId,
        eventStore.currentEventId,
      );

      const photosQuery = query(photosCollection);

      photosUnsubscribe = onSnapshot(
        photosQuery,
        (snapshot) => {
          const updatedPhotos: ChallengePhoto[] = [];
          for (const doc of snapshot.docs) {
            updatedPhotos.push(doc.data());
          }
          photos.value = updatedPhotos;
          isLoading.value = false;
        },
        (err) => {
          console.error("Error fetching photos:", err);
          error.value = "Failed to fetch photos";
          isLoading.value = false;
        },
      );
    } catch (error_) {
      error.value = "Failed to subscribe to photos";
      console.error(error_);
      isLoading.value = false;
    }
  }

  function unsubscribeFromPhotos() {
    if (photosUnsubscribe) {
      photosUnsubscribe();
      photosUnsubscribe = null;
    }
  }

  // Methods to set gallery filtering and sorting options
  function setGroupingOption(option: GalleryGroupingOption) {
    groupingOption.value = option;
  }

  function setSortingOption(option: GallerySortingOption) {
    sortingOption.value = option;
  }

  function setSortingDirection(direction: GallerySortingDirection) {
    sortingDirection.value = direction;
  }

  // Watch for changes in the current event ID
  watch(
    () => eventStore.currentEventId,
    (newEventId) => {
      if (newEventId) {
        subscribeToPhotos();
      } else {
        unsubscribeFromPhotos();
        photos.value = [];
      }
    },
    { immediate: true },
  );

  return {
    photos,
    isLoading,
    error,
    getPhotoById,
    getPhotosByChallengeId,
    photosByChallenge,
    photosByGroup,
    allPhotosSorted,
    subscribeToPhotos,
    unsubscribeFromPhotos,
    // Grouping and sorting options
    groupingOption,
    sortingOption,
    sortingDirection,
    setGroupingOption,
    setSortingOption,
    setSortingDirection,
  };
});
