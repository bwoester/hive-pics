<template>
  <div>
    <label v-if="props.label" class="text-subtitle-1 mb-2 d-block">{{
      props.label
    }}</label>

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
    />

    <!-- Image preview -->
    <div v-if="imagePreview || existingImageUrl" class="mt-3">
      <v-img
        :max-height="props.previewMaxHeight"
        :max-width="props.previewMaxWidth"
        :src="imagePreview || existingImageUrl"
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
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useDeviceStore } from "@/stores/deviceStore";

const props = withDefaults(
  defineProps<{
    label?: string;
    existingImageUrl?: string;
    previewMaxHeight?: number;
    previewMaxWidth?: number;
    cameraFacing?: "user" | "environment";
    isUploading?: boolean;
  }>(),
  {
    label: "Image",
    existingImageUrl: undefined,
    previewMaxHeight: 200,
    previewMaxWidth: 300,
    cameraFacing: "environment", // Default to back camera
    isUploading: false,
  },
);

const emit = defineEmits<{
  "update:file": [file: File | null];
  "update:preview": [preview: string | null];
  "remove-image": [];
}>();

const deviceStore = useDeviceStore();
const { isCameraSupported } = storeToRefs(deviceStore);
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

// Trigger the hidden file input
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Handle file selection from the file input
async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];

  // Create a preview of the selected image
  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    const result = e.target?.result as string;
    imagePreview.value = result;
    emit("update:preview", result);
  });
  reader.readAsDataURL(file);

  // Emit the selected file
  emit("update:file", file);

  // Reset the file input so the same file can be selected again if needed
  target.value = "";
}

// Open the camera for capturing a photo
function openCamera() {
  // Create a file input that accepts camera input
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = props.cameraFacing; // Use the specified camera

  // Handle the captured image
  input.addEventListener("change", (e) => {
    handleFileUpload(e);
  });

  // Trigger the camera
  input.click();
}

// Remove the selected image
function removeImage() {
  imagePreview.value = null;
  emit("update:file", null);
  emit("update:preview", null);
  emit("remove-image");
}
</script>
