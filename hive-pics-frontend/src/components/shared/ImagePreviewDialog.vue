<template>
  <div>
    <!-- Using Vuetify's activator slot pattern for showing the dialog -->
    <v-dialog v-model="dialogVisible" max-width="800px">
      <template #activator="{ props: activatorProps }">
        <slot :activator-props="activatorProps" name="activator"></slot>
      </template>

      <v-card>
        <v-card-title class="text-h5"> Image Preview </v-card-title>

        <v-card-text>
          <!-- Image Preview -->
          <div class="image-preview-container">
            <template v-if="imageUrl">
              <v-img
                class="mx-auto"
                contain
                :max-height="500"
                :max-width="700"
                :src="imageUrl"
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
            auto-grow
            class="mt-4"
            clearable
            label="Want to add a message to the photo?"
            rows="2"
            variant="outlined"
          ></v-textarea>

          <!-- Image Editing Controls -->
          <!--          <v-expansion-panels class="mt-4">-->
          <!--            <v-expansion-panel title="Image Editing Options">-->
          <!--              <v-expansion-panel-text>-->
          <!--                &lt;!&ndash; Cropping Options &ndash;&gt;-->
          <!--                <div class="mb-4">-->
          <!--                  <v-subheader>Cropping Options</v-subheader>-->
          <!--                  <v-btn-group variant="outlined">-->
          <!--                    <v-btn @click="applyCrop('free')">Free Crop</v-btn>-->
          <!--                    <v-btn @click="applyCrop('square')">Square</v-btn>-->
          <!--                    <v-btn @click="applyCrop('16:9')">16:9</v-btn>-->
          <!--                    <v-btn @click="applyCrop('4:3')">4:3</v-btn>-->
          <!--                  </v-btn-group>-->
          <!--                </div>-->

          <!--                &lt;!&ndash; Fitting Options &ndash;&gt;-->
          <!--                <div class="mb-4">-->
          <!--                  <v-subheader>Fitting Options</v-subheader>-->
          <!--                  <v-btn-group variant="outlined">-->
          <!--                    <v-btn @click="applyFit('fit')">Fit</v-btn>-->
          <!--                    <v-btn @click="applyFit('fill')">Fill</v-btn>-->
          <!--                  </v-btn-group>-->
          <!--                </div>-->

          <!--                &lt;!&ndash; Filter Options &ndash;&gt;-->
          <!--                <div>-->
          <!--                  <v-subheader>Filter Options</v-subheader>-->
          <!--                  <v-btn-group variant="outlined">-->
          <!--                    <v-btn @click="applyFilter('none')">None</v-btn>-->
          <!--                    <v-btn @click="applyFilter('grayscale')">Grayscale</v-btn>-->
          <!--                    <v-btn @click="applyFilter('sepia')">Sepia</v-btn>-->
          <!--                    <v-btn @click="applyFilter('vivid')">Vivid</v-btn>-->
          <!--                  </v-btn-group>-->
          <!--                </div>-->
          <!--              </v-expansion-panel-text>-->
          <!--            </v-expansion-panel>-->
          <!--          </v-expansion-panels>-->
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
  imageUrl: string | null;
  showDescriptionInput?: boolean;
}>();

const emit = defineEmits<{
  submit: [{ imageUrl: string | null; description?: string }];
  cancel: [];
}>();

const dialogVisible = ref(false);
const description = ref("");

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

// Stub methods for image editing features
// These would be implemented with actual image editing libraries
// function applyCrop(cropType: string) {
//   console.log(`Applying crop: ${cropType}`);
//   // In a real implementation, this would apply the crop to the image
// }

// function applyFit(fitType: string) {
//   console.log(`Applying fit: ${fitType}`);
//   // In a real implementation, this would apply the fit to the image
// }

// function applyFilter(filterType: string) {
//   console.log(`Applying filter: ${filterType}`);
//   // In a real implementation, this would apply the filter to the image
// }

// Submit the image with optional description
function submit() {
  emit("submit", {
    imageUrl: props.imageUrl,
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
