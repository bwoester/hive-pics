import type { ChallengePhoto } from "@shared";
import type { Unsubscribe } from "firebase/firestore";
// Utilities
import { onSnapshot, query } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { eventService } from "@/firebase/eventService.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useEventStore } from "@/stores/eventStore.ts";

export const useGalleryStore = defineStore("gallery", () => {
  const photos = ref<ChallengePhoto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const eventStore = useEventStore();
  const authStore = useAuthStore();

  // Keep track of active subscriptions
  let photosUnsubscribe: Unsubscribe | null = null;

  // Getters
  const getPhotoById = computed(() => (id: string) => {
    return photos.value.find((photo) => photo.id === id) || null;
  });

  const getPhotosByChallengeId = computed(() => (challengeId: string) => {
    return photos.value.filter((photo) => photo.challengeId === challengeId);
  });

  // Group photos by challenge
  const photosByChallenge = computed(() => {
    const grouped: Record<string, ChallengePhoto[]> = {};

    for (const photo of photos.value) {
      if (!grouped[photo.challengeId]) {
        grouped[photo.challengeId] = [];
      }
      grouped[photo.challengeId].push(photo);
    }

    // Sort photos within each group by createdAt (newest first)
    for (const challengeId of Object.keys(grouped)) {
      grouped[challengeId].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }

    return grouped;
  });

  // All photos sorted by createdAt (newest first)
  const allPhotosSorted = computed(() => {
    return [...photos.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

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
    allPhotosSorted,
    subscribeToPhotos,
    unsubscribeFromPhotos,
  };
});
