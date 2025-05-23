<template>
  <div class="photo-gallery">
    <h1>Photo Gallery</h1>

    <div v-if="loading && !images.length" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading images...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="!images.length" class="no-images">
      <p>No images found. Be the first to upload!</p>
    </div>

    <div v-else class="gallery-grid">
      <div v-for="image in images" :key="image.id" class="image-card">
        <img
          :src="image.downloadURL"
          :alt="image.description"
          class="gallery-image"
          loading="lazy"
        />
        <div class="image-metadata">
          <h3 class="image-title">{{ image.description || 'No description' }}</h3>
          <div class="metadata-details">
            <div class="metadata-item">
              <span class="metadata-label">By:</span>
              <span class="metadata-value">{{ image.nickname }}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Challenge:</span>
              <span class="metadata-value">{{ image.challengeId }}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Likes:</span>
              <span class="metadata-value">{{ image.likeCount }}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Posted:</span>
              <span class="metadata-value">{{ formatDate(image.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && images.length" class="loading-more">
      <div class="loading-spinner"></div>
      <p>Loading more images...</p>
    </div>

    <div v-if="!loading && !hasMoreImages && images.length" class="no-more-images">
      <p>No more images to load</p>
    </div>

    <!-- Intersection observer target element -->
    <div ref="observerTarget" class="observer-target"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Timestamp } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebaseStore.ts'

const firebaseStore = useFirebaseStore()

const observerTarget = ref<HTMLElement | null>(null)

// Computed properties from the store
const images = computed(() => firebaseStore.images)
const loading = computed(() => firebaseStore.loading)
const error = computed(() => firebaseStore.error)
const hasMoreImages = computed(() => firebaseStore.hasMoreImages)

// Function to format timestamp using the store method
function formatDate(timestamp: Timestamp | Date | null): string {
  return firebaseStore.formatDate(timestamp)
}

// Set up intersection observer for infinite scrolling
let observer: IntersectionObserver | null = null

function setupIntersectionObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && hasMoreImages.value) {
        firebaseStore.fetchImages(false)
      }
    },
    { threshold: 0.1 },
  )

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

onMounted(() => {
  // Initial load
  firebaseStore.fetchImages(true).then(() => {
    // Set up the intersection observer after the first batch loads
    setupIntersectionObserver()
  })
})

onUnmounted(() => {
  // Clean up the observer when component is unmounted
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.photo-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}

.loading-container,
.no-images,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 20px;
  border-radius: 8px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.image-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background-color: white;
}

.image-card:hover {
  transform: translateY(-5px);
}

.gallery-image {
  width: 100%;
  height: 240px;
  object-fit: contain;
  background-color: #f3f3f3;
  display: block;
}

.image-metadata {
  padding: 16px;
}

.image-title {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metadata-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metadata-item {
  font-size: 14px;
  margin-bottom: 4px;
}

.metadata-label {
  font-weight: 600;
  color: #666;
  margin-right: 4px;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.no-more-images {
  text-align: center;
  padding: 24px 0;
  color: #666;
}

.observer-target {
  height: 20px;
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .image-metadata {
    padding: 12px;
  }

  .image-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
