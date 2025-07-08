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
          :class="{
            'status-animation': item.id === activeStatusId,
            'status-success':
              item.id === activeStatusId && statusType === 'success',
            'status-error':
              item.id === activeStatusId && statusType === 'error',
          }"
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

  <!-- Hidden Print Template -->
  <div ref="printTemplate" class="print-template">
    <div class="vcard">
      <div class="logo-container">
        <img alt="Hivepics Logo" class="logo" src="@/assets/logo.svg" />
      </div>
      <h2 v-if="event" class="event-title">{{ event.title }}</h2>
      <div class="qr-code-print">
        <img
          v-if="invitationLink"
          alt="Event QR Code"
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invitationLink)}`"
        />
      </div>
      <p class="invitation-text">Scan to join the event</p>
    </div>
  </div>
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
const printTemplate = ref<HTMLElement | null>(null);

// UX feedback state
const loadingActionId = ref<number | null>(null);
const activeStatusId = ref<number | null>(null);
const statusType = ref<"success" | "error">("success");

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
  {
    id: 0,
    icon: "mdi-link-variant",
    text: "Open invitation link",
    onClick: openInvitationLink,
  },
  {
    id: 1,
    icon: "mdi-content-copy",
    text: "Copy invitation link",
    onClick: copyInvitationLink,
  },
  { id: 2, icon: "mdi-printer", text: "Print QR code", onClick: printQRCode },
];

// Helper function to show status message
function showStatus(
  actionId: number,
  message: string,
  type: "success" | "error" = "success",
) {
  statusType.value = type;
  activeStatusId.value = actionId;
  setTimeout(() => {
    if (activeStatusId.value === actionId) {
      activeStatusId.value = null;
    }
  }, 1500); // Animation duration
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
  if (!printTemplate.value) return;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to print the QR code.");
    return;
  }

  // Write the print template content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>${props.event?.title || "Event"} - QR Code</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .vcard {
              page-break-inside: avoid;
            }
          }
          ${getComputedStyle(printTemplate.value).cssText}
        </style>
      </head>
      <body>
        ${printTemplate.value.innerHTML}
      </body>
    </html>
  `);

  // Wait for images to load before printing
  printWindow.document.addEventListener(
    "load",
    () => {
      printWindow.print();
      printWindow.close();
    },
    { once: true },
  );

  // Fallback if load event doesn't fire
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 1000);
}
</script>

<style scoped>
.status-animation {
  position: relative;
  overflow: hidden;
  transform-origin: center;
  transition: transform 0.2s ease;
}

.status-animation:active {
  transform: scale(0.98);
}

.status-animation::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.status-success::after {
  opacity: 1;
  background-color: rgba(76, 230, 100, 0.2); /* Material success green */
}

.status-error::after {
  opacity: 1;
  background-color: rgba(255, 71, 71, 0.2); /* Material error red */
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.error-message {
  color: #c62828;
  padding: 20px;
}

/* Print template styles */
.print-template {
  display: none; /* Hidden by default */
}

@media print {
  .print-template {
    display: block;
  }
}

.vcard {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  max-width: 150px;
  height: auto;
}

.event-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.qr-code-print {
  margin: 20px auto;
  width: 300px;
  height: 300px;
}

.qr-code-print img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.invitation-text {
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
}

.invitation-link {
  font-size: 14px;
  color: #1976d2;
  word-break: break-all;
  margin-top: 10px;
}
</style>
