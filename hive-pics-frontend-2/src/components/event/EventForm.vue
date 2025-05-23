<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">{{ isNew ? 'Create New Event' : 'Update Event' }}</h1>
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

            <v-col cols="12" md="6">
              <v-text-field
                v-model="event.location"
                label="Location"
                required
                :rules="[v => !!v || 'Location is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="event.date"
                label="Event Date"
                required
                :rules="[v => !!v || 'Date is required']"
                type="date"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="event.capacity"
                label="Capacity (optional)"
                min="1"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="event.imageUrl"
                label="Image URL (optional)"
              />
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="event.isPublic"
                color="primary"
                label="Public Event"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :to="{ name: '/host/' }"
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
            {{ isNew ? 'Create Event' : 'Update Event' }}
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
  import { ref } from 'vue'
  import { type Event, useEventStore } from '@/stores/event.ts'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const eventStore = useEventStore()
  const form = ref(null)
  const isFormValid = ref(false)

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
  })

  const props = defineProps<{
    event: Event
  }>()

  // Create a local copy to edit (to prevent direct mutation of prop)
  const event = reactive({ ...props.event })

  const isNew = computed(() => event.id === undefined)

  function delay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function saveEvent () {
    if (!isFormValid.value) return

    const success = await eventStore.saveEvent(event)
    if (success) {
      showSuccess(isNew.value ? 'Event created successfully' : 'Event updated successfully')
      // Wait a little while before redirecting
      await delay(500)
      await router.push({ name: '/host/' })
    } else {
      showError(eventStore.error || 'Failed to save event')
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
