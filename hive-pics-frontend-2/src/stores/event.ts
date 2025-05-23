// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isPublic: boolean;
  capacity?: number;
  imageUrl?: string;
}

export const useEventStore = defineStore('event', () => {
  const currentEvent = ref<Event | null>(null)
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getEventById = computed(() => (id: string) => {
    return events.value.find(event => event.id === id) || null
  })

  const isEmpty = computed(() => events.value.length === 0)

  // Actions
  function setCurrentEvent (event: Event | null) {
    currentEvent.value = event
  }

  async function fetchEvent (id: string) {
    isLoading.value = true
    error.value = null
    try {
      // Simulate API call - replace with actual API call
      const event = events.value.find(event => event.id === id) || null
      currentEvent.value = event
      return event
    } catch (err) {
      error.value = 'Failed to fetch event'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function saveEvent (event: Event) {
    isLoading.value = true
    error.value = null
    try {
      // Simulate API call - replace with actual API call
      if (event.id) {
        // Update existing event
        const index = events.value.findIndex(e => e.id === event.id)
        if (index !== -1) {
          events.value[index] = { ...event }
        }
      } else {
        // Create new event
        const uuid = crypto.randomUUID()
        const newEvent = {
          ...event,
          id: uuid,
        }
        events.value.push(newEvent)
        currentEvent.value = newEvent
      }
      return true
    } catch (err) {
      error.value = 'Failed to save event'
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteEvent (id: string) {
    isLoading.value = true
    error.value = null
    try {
      // Simulate API call - replace with actual API call
      events.value = events.value.filter(event => event.id !== id)
      if (currentEvent.value?.id === id) {
        currentEvent.value = null
      }
      return true
    } catch (err) {
      error.value = 'Failed to delete event'
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentEvent,
    isEmpty,
    events,
    isLoading,
    error,
    getEventById,
    setCurrentEvent,
    fetchEvent,
    saveEvent,
    deleteEvent,
  }
})
