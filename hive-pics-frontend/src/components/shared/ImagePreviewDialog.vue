<template>
  <div>
    <!-- Using Vuetify's activator slot pattern for showing the dialog -->
    <v-dialog v-model="dialogVisible" persistent>
      <template #activator="{ props: activatorProps }">
        <slot :activator-props="activatorProps" name="activator"></slot>
      </template>

      <v-card>
        <v-card-title class="text-h5"> Image Preview </v-card-title>

        <v-card-text>
          <!-- Image Preview -->
          <div class="image-preview-container">
            <template v-if="currentObjectURL">
              <v-img
                class="mx-auto"
                contain
                max-height="55vh"
                :src="currentObjectURL"
              ></v-img>
            </template>
            <template v-else>
              <!-- Placeholder or upload UI -->
              <v-card class="pa-4 text-center" flat>
                <v-icon color="grey" size="64">mdi-image-outline</v-icon>
                <div class="text-body-1 mt-2">No image selected</div>
              </v-card>
            </template>
          </div>

          <!-- Optional Description Input -->
          <v-textarea
            v-if="showDescriptionInput"
            v-model="description"
            class="mt-4"
            clearable
            label="Want to add a message?"
            rows="2"
            variant="outlined"
          ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="cancel">Cancel</v-btn>
          <v-btn color="primary" variant="text" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * ImagePreviewDialog Component
 *
 * A modal dialog for previewing and editing images before submission.
 *
 * Features:
 * - Image preview
 * - Optional description input
 * - Image editing capabilities (cropping, fitting, filters)
 * - Submit and cancel actions
 *
 * Usage:
 *
 * 1. Using the activator slot:
 * ```vue
 * <ImagePreviewDialog
 *   :image-url="yourImageUrl"
 *   :show-description-input="true"
 *   @submit="handleSubmit"
 *   @cancel="handleCancel"
 * >
 *   <template #activator="{ activatorProps }">
 *     <v-btn v-bind="activatorProps">Preview Image</v-btn>
 *   </template>
 * </ImagePreviewDialog>
 * ```
 *
 * 2. Using programmatic control:
 * ```vue
 * <ImagePreviewDialog
 *   ref="dialogRef"
 *   :image-url="yourImageUrl"
 *   @submit="handleSubmit"
 *   @cancel="handleCancel"
 * />
 *
 * <v-btn @click="dialogRef.showDialog()">Open Preview</v-btn>
 * ```
 *
 * @emits submit - Emitted when the user submits the image, with the image URL and optional description
 * @emits cancel - Emitted when the user cancels
 */
import { ref, watch } from "vue";

const props = defineProps<{
  imageFile: File | null;
  showDescriptionInput?: boolean;
}>();

const emit = defineEmits<{
  submit: [{ imageFile: File | null; description?: string }];
  cancel: [];
}>();

const dialogVisible = ref(false);
const description = ref("");

// Create a ref to store the current object URL
const currentObjectURL = ref<string | null>(null);

// Watch for changes in the file and handle object URL creation/cleanup
watch(
  () => props.imageFile,
  (newFile) => {
    // Clean up the previous object URL if it exists
    if (currentObjectURL.value) {
      URL.revokeObjectURL(currentObjectURL.value);
      currentObjectURL.value = null;
    }

    // Create a new object URL if we have a file
    if (newFile) {
      currentObjectURL.value = URL.createObjectURL(newFile);
    }
  },
  { immediate: true },
);

// Clean up on unmounting
onUnmounted(() => {
  if (currentObjectURL.value) {
    URL.revokeObjectURL(currentObjectURL.value);
    currentObjectURL.value = null;
  }
});

// Method to show the dialog programmatically
function showDialog() {
  dialogVisible.value = true;
}

// Method to hide the dialog programmatically
function hideDialog() {
  dialogVisible.value = false;
}

// Reset description when dialog is closed
watch(dialogVisible, (newValue) => {
  if (!newValue) {
    description.value = "";
  }
});

// Submit the image with the optional description
function submit() {
  emit("submit", {
    imageFile: props.imageFile,
    description: props.showDescriptionInput ? description.value : undefined,
  });
  hideDialog();
}

// Cancel and close the dialog
function cancel() {
  emit("cancel");
  hideDialog();
}

// Expose methods to parent component
defineExpose({
  showDialog,
  hideDialog,
});
</script>

<style scoped>
.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}
</style>
