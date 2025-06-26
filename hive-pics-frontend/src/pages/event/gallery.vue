<route lang="yaml">
meta:
  layout: eventLayout
</route>

<template>
  <div class="gallery-page">
    <h1>Gallery</h1>

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
      <h2>All Photos</h2>
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

      <h2 class="section-title">Photos by Challenge</h2>
      <div
        v-for="(photos, challengeId) in photosByChallenge"
        :key="challengeId"
        class="challenge-section"
      >
        <h3>{{ getChallengeTitle(challengeId) }}</h3>
        <div class="photo-grid">
          <div v-for="photo in photos" :key="photo.id" class="photo-card">
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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useChallengeStore } from "@/stores/challengeStore.ts";
import { useGalleryStore } from "@/stores/galleryStore.ts";

const galleryStore = useGalleryStore();
const challengeStore = useChallengeStore();

const { isLoading, error, photosByChallenge, allPhotosSorted } =
  storeToRefs(galleryStore);

// Function to get challenge title by ID
const getChallengeTitle = (challengeId: string): string => {
  const challenge = challengeStore.getChallengeById(challengeId);
  return challenge ? challenge.title : "Unknown Challenge";
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
.gallery-page {
  padding: 1rem;
}

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

.challenge-section {
  margin-bottom: 2rem;
}
</style>
