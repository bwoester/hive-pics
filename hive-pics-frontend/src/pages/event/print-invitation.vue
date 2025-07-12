<template>
  <div class="invitation-preview">
    <EventInvitation
      id="invitation"
      card-size="a7"
      :event-title="eventTitle"
      :token-id="tokenId"
    ></EventInvitation>
  </div>

  <div class="print-actions">
    <v-btn block class="mt-4" color="primary" @click="triggerPrint">
      Print Invitation
    </v-btn>
  </div>

  <div>
    <!-- Container used only for printing with print.js -->
    <div id="printable-cards" class="print-only-off">
      <!-- Grid of invitation cards for printing on A4 paper (2x4 grid) -->
      <div class="invitation-card-grid">
        <!-- Repeat the invitation card 8 times to fill an A4 page (2x4) -->
        <EventInvitation
          v-for="i in 8"
          :key="i"
          card-size="a7"
          :event-title="eventTitle"
          :token-id="tokenId"
        >
        </EventInvitation>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import printJS from "print-js";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Get the token ID from the query parameters
const tokenId = route.query.tokenId as string;

// Default event title (always using DIN A7 size)
const eventTitle = ref("Join Our Event");

// Create the invitation link
const baseUrl = window.location.origin;
const invitationLink = `${baseUrl}/event/join?t=${tokenId}`;

// Trigger printing function
function triggerPrint() {
  // Wait a moment for images to load
  setTimeout(() => {
    // Get the printable container
    const printableContainer = document.querySelector(
      "#printable-cards",
    ) as HTMLElement;

    if (printableContainer) {
      // Temporarily make it visible for print.js
      // Save original styles
      const originalStyles = {
        position: printableContainer.style.position,
        left: printableContainer.style.left,
        top: printableContainer.style.top,
        visibility: printableContainer.style.visibility,
        opacity: printableContainer.style.opacity,
        zIndex: printableContainer.style.zIndex,
      };

      // Make it visible but keep it out of the way
      printableContainer.style.position = "fixed";
      printableContainer.style.left = "0";
      printableContainer.style.top = "0";
      printableContainer.style.visibility = "visible";
      printableContainer.style.opacity = "1";
      printableContainer.style.zIndex = "-1"; // Behind everything else

      // Use print.js to print the invitation cards
      printJS({
        printable: "printable-cards",
        type: "html",
        documentTitle: "Event Invitation",
        // Use the styles defined in this component
        style: `
          @page {
            size: A4;
            margin: 10mm;
          }
          .invitation-card-grid {
            display: grid;
            grid-template-columns: repeat(2, 105mm); /* 2 columns of DIN A7 width */
            grid-template-rows: repeat(4, 74mm); /* 4 rows of DIN A7 height */
            grid-gap: 5mm;
            justify-content: center;
          }
          .invitation-wrapper {
            width: 105mm;
            height: 74mm;
            page-break-inside: avoid;
          }
          .invitation-card {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: none;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        `,
        onPrintDialogClose: () => {
          // Restore original styles
          printableContainer.style.position = originalStyles.position;
          printableContainer.style.left = originalStyles.left;
          printableContainer.style.top = originalStyles.top;
          printableContainer.style.visibility = originalStyles.visibility;
          printableContainer.style.opacity = originalStyles.opacity;
          printableContainer.style.zIndex = originalStyles.zIndex;

          // Close the window after printing
          setTimeout(() => {
            window.close();
          }, 500);
        },
      });
    } else {
      console.error("Printable container not found");
    }
  }, 1000);
}

// No longer automatically trigger printing on mount
// Users can now click the Print button when they're ready
onMounted(() => {
  // Initialize any required data
});
</script>

<style scoped>
.invitation-preview {
  max-width: 500px;
  margin: 20px auto;
  padding: 0 16px;
}

.print-actions {
  max-width: 500px;
  margin: 0 auto 40px;
  padding: 0 16px;
}

/* Hide the printable cards container from screen view but keep it in the DOM for print.js */
.print-only {
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
  /* Don't use display: none as it makes the element inaccessible to print.js */
}

/* Grid layout for invitation cards when printing */
.invitation-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 105mm); /* 2 columns of DIN A7 width */
  grid-template-rows: repeat(4, 74mm); /* 4 rows of DIN A7 height */
  justify-content: center;
}

/* The print styles are now handled by print.js */
@media print {
  .invitation-preview, .print-actions {
    display: none; /* Hide the preview and print button when printing */
  }

  .print-only {
    position: static;
    visibility: visible;
    left: auto;
    top: auto;
  }

  .invitation-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 105mm); /* 2 columns of DIN A7 width */
    grid-template-rows: repeat(4, 74mm); /* 4 rows of DIN A7 height */
    grid-gap: 0;
    justify-content: center;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
</style>
