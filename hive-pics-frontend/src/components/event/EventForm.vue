<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">{{ props.isNew ? 'Create New Event' : 'Update Event' }}</h1>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="isFormValid" @submit.prevent="saveEvent">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="event.title"
                label="Event Title"
                required
                :rules="[v => !!v || 'Title is required']"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="event.description"
                label="Event Description"
                required
                rows="4"
                :rules="[v => !!v || 'Description is required']"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="event.challengeSetId"
                clearable
                item-title="name"
                item-value="id"
                :items="challengeStore.challengeSets"
                label="Choose a challenge theme for your event"
                @update:model-value="onChallengeSetChange"
              />
            </v-col>

            <v-col v-if="selectedChallenges.length > 0" cols="12">
              <v-card variant="outlined">
                <v-card-title>Challenges in this set</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item v-for="challenge in selectedChallenges" :key="challenge.id">
                      <v-list-item-title>{{ challenge.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ challenge.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-date-input
                v-model="event.date"
                label="Event Date"
                required
                :rules="[v => !!v || 'Date is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <div>
                <label class="text-subtitle-1 mb-2 d-block">Event Cover Image</label>

                <div class="d-flex flex-wrap gap-2 mb-4">
                  <v-btn
                    prepend-icon="mdi-upload"
                    variant="outlined"
                    @click="triggerFileInput"
                  >
                    Upload Image
                  </v-btn>

                  <v-btn
                    v-if="isCameraSupported"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    @click="openCamera"
                  >
                    Take Photo
                  </v-btn>
                </div>

                <!-- Hidden file input -->
                <input
                  ref="fileInput"
                  accept="image/*"
                  class="d-none"
                  type="file"
                  @change="handleFileUpload"
                >

                <!-- Image preview -->
                <div v-if="imagePreview || event.coverImageUrl" class="mt-3">
                  <v-img
                    max-height="200"
                    max-width="300"
                    :src="imagePreview || event.coverImageUrl"
                  />
                  <div class="d-flex mt-2">
                    <v-btn
                      color="error"
                      density="compact"
                      icon="mdi-delete"
                      variant="text"
                      @click="removeImage"
                    />
                  </div>
                </div>

                <div v-if="isUploading" class="mt-3">
                  <v-progress-linear indeterminate />
                  <div class="text-caption">Uploading image...</div>
                </div>
              </div>
            </v-col>

          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :to="{ name: '/dashboard/' }"
            variant="text"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            :loading="eventStore.isLoading"
            type="submit"
          >
            {{ props.isNew ? 'Create Event' : 'Update Event' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import type { Event } from '@shared'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { storageService } from '@/firebase/storageService.ts'
  import { useChallengeStore } from '@/stores/challengeStore.ts'
  import { useDeviceStore } from '@/stores/deviceStore'
  import { useEventStore } from '@/stores/eventStore.ts'
  const router = useRouter()
  const deviceStore = useDeviceStore()
  const eventStore = useEventStore()
  const challengeStore = useChallengeStore()
  const form = ref(null)
  const isFormValid = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)
  const imagePreview = ref<string | null>(null)
  const isUploading = ref(false)
  const selectedFile = ref<File | null>(null)
  const selectedChallenges = computed(() => {
    if (!event.challengeSetId) return []
    return challengeStore.getChallengesInSet(event.challengeSetId)
  })

  onMounted(async () => {
    await deviceStore.checkCameraSupport()
  })

  function onChallengeSetChange (setId: string) {
    event.challengeSetId = setId
  }

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
  })

  const props = defineProps<{
    isNew: boolean
    event: Event
  }>()

  // Create a local copy to edit (to prevent direct mutation of prop)
  const event = reactive({ ...props.event })

  // Check if the device supports camera capture
  const { isCameraSupported } = storeToRefs(deviceStore)

  // Trigger the hidden file input
  function triggerFileInput () {
    if (fileInput.value) {
      fileInput.value.click()
    }
  }

  // Handle file selection from the file input
  async function handleFileUpload (e: globalThis.Event) {
    const target = e.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return

    const file = target.files[0]
    selectedFile.value = file

    // Create a preview of the selected image
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      imagePreview.value = e.target?.result as string
    })
    reader.readAsDataURL(file)

    // Reset the file input so the same file can be selected again if needed
    target.value = ''
  }

  // Open the camera for capturing a photo
  function openCamera () {
    // Create a file input that accepts camera input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment' // Use the back camera if available

    // Handle the captured image
    input.addEventListener('change', e => {
      handleFileUpload(e)
    })

    // Trigger the camera
    input.click()
  }

  // Remove the selected image
  function removeImage () {
    imagePreview.value = null
    selectedFile.value = null
    event.coverImageUrl = undefined
  }

  function delay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function saveEvent () {
    if (!isFormValid.value) return

    try {
      // If there's a selected file, upload it to Firebase Storage
      if (selectedFile.value) {
        isUploading.value = true

        try {
          // Upload the image and get the download URL, update the event with the image URL
          event.coverImageUrl = await storageService.uploadEventCoverImage(selectedFile.value, event.id)
        } catch (error) {
          console.error('Error uploading image:', error)
          showError('Failed to upload image')
          isUploading.value = false
          return
        } finally {
          isUploading.value = false
        }
      } else {
        isUploading.value = true

        try {
          // Delete potential old images, remove the image URL from the event
          await storageService.deleteEventCoverImages(event.id)
          delete event.coverImageUrl
        } catch (error) {
          console.error('Error deleting potential old images:', error)
          showError('Failed to remove image')
          isUploading.value = false
          return
        } finally {
          isUploading.value = false
        }
      }

      // Save the event with the updated image URL
      const success = await eventStore.saveEvent(event)
      if (success) {
        showSuccess(props.isNew ? 'Event created successfully' : 'Event updated successfully')
        // Wait a little while before redirecting
        await delay(500)
        await router.push({ name: '/dashboard/' })
      } else {
        showError(eventStore.error || 'Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      showError('An unexpected error occurred')
    }
  }

  function showSuccess (message: string) {
    snackbar.value = {
      show: true,
      text: message,
      color: 'success',
    }
  }

  function showError (message: string) {
    snackbar.value = {
      show: true,
      text: message,
      color: 'error',
    }
  }
</script>
