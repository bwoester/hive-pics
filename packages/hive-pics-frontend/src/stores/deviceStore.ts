import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeviceStore = defineStore('device', () => {
  const isCameraSupported = ref(false)
  const isInitialized = ref(false)

  async function checkCameraSupport () {
    if (isInitialized.value) {
      return isCameraSupported.value
    }

    if (!('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices)) {
      isInitialized.value = true
      return false
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      isCameraSupported.value = devices.some(device => device.kind === 'videoinput')
    } catch (error) {
      console.error('Error checking camera support:', error)
      isCameraSupported.value = false
    }

    isInitialized.value = true
    return isCameraSupported.value
  }

  return {
    isCameraSupported,
    isInitialized,
    checkCameraSupport,
  }
})
