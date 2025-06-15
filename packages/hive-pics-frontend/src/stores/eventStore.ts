import type { Event } from '@hivepics/shared'
import type { Unsubscribe } from 'firebase/firestore'
// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { eventService } from '@/firebase/eventService.ts'
import { useAuthStore } from '@/stores/authStore.ts'

export const useEventStore = defineStore('event', () => {
  const currentEvent = ref<Event | null>(null)
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  // Keep track of active subscriptions
  let eventsUnsubscribe: Unsubscribe | null = null

  // Getters
  const getEventById = computed(() => (id: string) => {
    return events.value.find(event => event.id === id) || null
  })

  const isEmpty = computed(() => events.value.length === 0)

  // Actions
  function setCurrentEvent (event: Event | null) {
    currentEvent.value = event
  }

  function subscribeToEvents () {
    if (!authStore.user?.uid) {
      error.value = 'User must be authenticated'
      return
    }

    // Clean up existing subscription if any
    unsubscribeFromEvents()

    isLoading.value = true
    error.value = null

    try {
      eventsUnsubscribe = eventService.subscribeToEvents(
        authStore.user.uid,
        updatedEvents => {
          events.value = updatedEvents
          isLoading.value = false
        },
      )
    } catch (error_) {
      error.value = 'Failed to subscribe to events'
      console.error(error_)
      isLoading.value = false
    }
  }

  function unsubscribeFromEvents () {
    if (eventsUnsubscribe) {
      eventsUnsubscribe()
      eventsUnsubscribe = null
    }
  }

  function createNewEvent (): Event | null {
    if (!authStore.user?.uid) {
      error.value = 'User must be authenticated'
      return null
    }

    isLoading.value = true
    error.value = null
    try {
      return eventService.createNewEvent(authStore.user.uid)
    } catch (error_) {
      error.value = 'Failed to create new event'
      console.error(error_)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function saveEvent (event: Event) {
    if (!authStore.user?.uid) {
      error.value = 'User must be authenticated'
      return false
    }

    isLoading.value = true
    error.value = null
    try {
      await eventService.saveEvent(authStore.user.uid, event)
      return true
    } catch (error_) {
      error.value = 'Failed to save event'
      console.error(error_)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteEvent (id: string) {
    if (!authStore.user?.uid) {
      error.value = 'User must be authenticated'
      return false
    }

    isLoading.value = true
    error.value = null
    try {
      await eventService.deleteEvent(authStore.user.uid, id)
      return true
    } catch (error_) {
      error.value = 'Failed to delete event'
      console.error(error_)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const { isLoggedIn } = storeToRefs(authStore)

  watchEffect(() => {
    if (isLoggedIn.value) {
      subscribeToEvents()
    } else {
      unsubscribeFromEvents()
    }
  })

  return {
    currentEvent,
    isEmpty,
    events,
    isLoading,
    error,
    getEventById,
    setCurrentEvent,
    subscribeToEvents,
    unsubscribeFromEvents,
    createNewEvent,
    saveEvent,
    deleteEvent,
  }
})
