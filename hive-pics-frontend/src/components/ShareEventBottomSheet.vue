<template>
  <v-bottom-sheet v-model="isOpen" max-width="600px">
    <v-card class="pa-4">
      <v-card-title>Share Event</v-card-title>
      <v-card-subtitle>{{ event?.title }}</v-card-subtitle>

      <div v-if="event" class="mb-4">
        <!-- QR Code -->
        <div class="qr-code-container mb-4">
          <img
            ref="qrCodeImage"
            alt="Event QR Code"
            height="200"
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invitationLink)}`"
            width="200"
          />
        </div>
        <p class="text-subtitle-1 mb-4">
          Ask your guests to scan this QR code to join the event and start
          having fun!
        </p>
      </div>

      <div v-else class="error-message">
        <p>No event selected to share.</p>
      </div>

      <v-list>
        <v-list-item
          v-for="item in actions"
          :key="item.id"
          :loading="item.id === loadingActionId"
          :prepend-icon="item.icon"
          :value="item.id"
          @click="item.onClick"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="isOpen = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>

  <!-- Snackbar for feedback -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    <div class="d-flex align-center">
      <v-icon class="mr-2" :icon="snackbar.icon"></v-icon>
      {{ snackbar.text }}
    </div>
    <template #actions>
      <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { Event } from "@shared";
import { computed, ref, watch } from "vue";

// Props and emits
const props = defineProps<{
  modelValue: boolean;
  event?: Event;
}>();

const emit = defineEmits<(e: "update:modelValue", value: boolean) => void>();

// Bottom sheet state
const isOpen = ref(props.modelValue);
const qrCodeImage = ref<HTMLImageElement | null>(null);

// UX feedback state
const loadingActionId = ref<number | null>(null);

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  icon: "mdi-check-circle",
});

// Compute the invitation link based on the event ID
const invitationLink = computed(() => {
  if (!props.event) return "";

  // Create a URL to the join page with the event ID
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/join?id=${props.event.id}`;
});

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  },
);

// Watch for changes in the isOpen ref
watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
});

const actions = [
  { id: 0, icon: "mdi-printer", text: "Print QR code", onClick: printQRCode },
  {
    id: 1,
    icon: "mdi-link-variant",
    text: "Open invitation link",
    onClick: openInvitationLink,
  },
  {
    id: 2,
    icon: "mdi-content-copy",
    text: "Copy invitation link",
    onClick: copyInvitationLink,
  },
];

// Helper functions to show status messages
function showSuccess(message: string) {
  snackbar.value = {
    show: true,
    text: message,
    color: "success",
    icon: "mdi-check-circle",
  };
}

function showError(message: string) {
  snackbar.value = {
    show: true,
    text: message,
    color: "error",
    icon: "mdi-alert-circle",
  };
}

// Helper function to show status message
function showStatus(
  actionId: number,
  message: string,
  type: "success" | "error" = "success",
) {
  if (type === "success") {
    showSuccess(message);
  } else {
    showError(message);
  }
}

// Opens the invitation link in a new window
async function openInvitationLink() {
  if (!invitationLink.value) {
    return;
  }

  loadingActionId.value = 0;
  try {
    window.open(invitationLink.value, "_blank");
    showStatus(0, "Link opened in new tab", "success");
  } catch {
    showStatus(0, "Failed to open link", "error");
  } finally {
    loadingActionId.value = null;
  }
}

// Function to copy invitation link to clipboard
async function copyInvitationLink() {
  loadingActionId.value = 1;
  try {
    await navigator.clipboard.writeText(invitationLink.value);
    showStatus(1, "Link copied to clipboard", "success");
  } catch {
    showStatus(1, "Failed to copy link", "error");
  } finally {
    loadingActionId.value = null;
  }
}

// Function to print QR code
function printQRCode() {
  if (!props.event) return;

  // Open the print-qr page in a new tab with the event ID
  const printUrl = `/event/print-invitation?tokenId=${props.event.id}`;
  window.open(printUrl, "_blank");
}
</script>

<style scoped>
.qr-code-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.error-message {
  color: #c62828;
  padding: 20px;
}
</style>
