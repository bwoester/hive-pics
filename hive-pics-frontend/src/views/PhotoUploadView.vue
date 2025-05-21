<template>
  <div class="photo-upload">
    <h1>Upload Photo</h1>

    <div v-if="!capturedImage" class="capture-controls">
      <button @click="capturePhoto" class="primary-button">Take Photo</button>
      <p class="instruction">Click to use your device's camera</p>
    </div>

    <div v-if="capturedImage" class="preview-container">
      <h2>Preview</h2>
      <img :src="capturedImage" alt="Captured photo" class="preview-image" />

      <div class="description-input">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Add a short description..."
          rows="3"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="uploadPhoto" class="primary-button" :disabled="uploading">
          {{ uploading ? 'Uploading...' : 'Upload Photo' }}
        </button>
        <button @click="cancelCapture" class="secondary-button" :disabled="uploading">
          Cancel
        </button>
      </div>

      <div v-if="uploadError" class="error-message">
        {{ uploadError }}
      </div>

      <div v-if="uploadSuccess" class="success-message">Photo uploaded successfully!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadPhotoToFirebase } from '@/services/firebase'

const capturedImage = ref<string | null>(null)
const description = ref('')
const uploadError = ref('')
const uploadSuccess = ref(false)
const uploading = ref(false)

// Function to open the device camera
function capturePhoto() {
  // Create a file input element
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.capture = 'environment' // Use the back camera by default

  // Handle file selection
  fileInput.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        capturedImage.value = e.target?.result as string
      }

      reader.readAsDataURL(file)
    }
  }

  // Trigger file selection
  fileInput.click()
}

// Function to upload the photo
async function uploadPhoto() {
  if (!capturedImage.value) return

  uploading.value = true
  uploadError.value = ''

  try {
    // Convert base64 to blob
    const response = await fetch(capturedImage.value)
    const blob = await response.blob()

    // Upload to Firebase
    await uploadPhotoToFirebase(blob, description.value)

    // Show success message
    uploadSuccess.value = true

    // Reset form after a delay
    setTimeout(() => {
      capturedImage.value = null
      description.value = ''
      uploadSuccess.value = false
    }, 2000)
  } catch (error) {
    uploadError.value = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  } finally {
    uploading.value = false
  }
}

// Function to cancel the photo capture
function cancelCapture() {
  capturedImage.value = null
  description.value = ''
  uploadError.value = ''
  uploadSuccess.value = false
}
</script>

<style scoped>
.photo-upload {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.capture-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.instruction {
  margin-top: 10px;
  color: #666;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.description-input {
  width: 100%;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin: 20px 0;
}

.primary-button,
.secondary-button {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #43a047;
}

.primary-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.secondary-button {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.secondary-button:hover {
  background-color: #f5f5f5;
}

.secondary-button:disabled {
  color: #999;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #ffebee;
  border-radius: 4px;
  width: 100%;
  text-align: center;
}

.success-message {
  color: #2e7d32;
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #e8f5e9;
  border-radius: 4px;
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
