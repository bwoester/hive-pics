<template>
  <div class="controls-container">
    <v-card class="controls-card">
      <v-card-title>Invitation Card Settings</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="eventTitle"
          density="compact"
          label="Event Title"
          variant="outlined"
        ></v-text-field>

        <v-select
          v-model="cardSize"
          density="compact"
          :items="[
            { title: 'Business Card (85x55mm) - Landscape', value: 'business' },
            { title: 'DIN A7 (105x74mm) - Landscape', value: 'a7' },
            { title: 'DIN A8 (74x52mm) - Landscape', value: 'a8' },
          ]"
          label="Card Size"
          variant="outlined"
        ></v-select>

        <v-btn block class="mt-4" color="primary" @click="triggerPrint2">
          Print Invitation
        </v-btn>
      </v-card-text>
    </v-card>
  </div>

  <div class="invitation-preview">
    <EventInvitation
      id="invitation"
      :card-size="cardSize"
      :event-title="eventTitle"
      :token-id="tokenId"
    ></EventInvitation>
  </div>

  <div>
    <!-- Container used only for printing with print.js -->
    <!--
        <div id="printable-cards" class="print-only">
    -->
    <div id="printable-cards">
      <!-- Grid of business cards for printing -->
      <div class="business-card-grid">
        <!-- Repeat the business card multiple times to fill the page -->
        <EventInvitation
          v-for="i in 4"
          :key="i"
          :card-size="cardSize"
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

// Default event title and card size
const eventTitle = ref("Join Our Event");
const cardSize = ref("business"); // Options: 'a7', 'a8', 'business'

// Create the invitation link
const baseUrl = window.location.origin;
const invitationLink = `${baseUrl}/event/join?t=${tokenId}`;

// Trigger printing when the page loads
function triggerPrint2() {
  // Wait a moment for images to load
  setTimeout(() => {
    // Use print.js to print the business cards
    printJS({
      printable: "printable-cards",
      type: "html",
      documentTitle: "",
      onPrintDialogClose: () => {
        // Close the window after printing
        setTimeout(() => {
          window.close();
        }, 500);
      },
    });
  }, 1000);
}

// Trigger printing when the page loads
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

      // Use print.js to print the business cards
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
          .business-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, 85mm);
            grid-gap: 5mm;
            justify-content: center;
          }
          .vcard {
            width: 85mm;
            height: 54mm;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
            background-color: white;
            text-align: center;
            font-family: Arial, sans-serif;
            page-break-inside: avoid;
          }
          .logo-container {
            margin-bottom: 10px;
          }
          .logo {
            max-width: 60px;
            height: auto;
          }
          .event-title {
            font-size: 14px;
            margin-bottom: 10px;
            color: #333;
          }
          .qr-code-print {
            width: 100px;
            height: 100px;
            margin: 10px auto;
          }
          .qr-code-print img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .invitation-text {
            font-size: 12px;
            margin-bottom: 5px;
            color: #555;
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
.controls-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 0 16px;
}

.controls-card {
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.invitation-preview {
  max-width: 500px;
  margin: 0 auto 40px;
  padding: 0 16px;
}

.print-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

/* Grid layout for business cards */
.business-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  width: 100%;
  max-width: 1200px;
}

/* For screen display, make cards larger and more readable */
.vcard {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Special styling for the single card shown on screen */
.screen-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.screen-card:hover {
  transform: scale(1.02);
}

/* Hide the printable cards container from screen view but keep it in the DOM for print.js */
.print-only {
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
  /* Don't use display: none as it makes the element inaccessible to print.js */
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
  width: 200px;
  height: 200px;
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

/* The print styles are now handled by print.js */
@media print {
  /* These styles are for fallback if print.js doesn't work */
  .print-container {
    padding: 0;
    min-height: auto;
    display: block;
  }

  .business-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 85mm);
    grid-gap: 5mm;
    justify-content: center;
  }

  .vcard {
    width: 85mm;
    height: 54mm;
    padding: 10px;
    border: 1px solid #e0e0e0;
    box-shadow: none;
    page-break-inside: avoid;
  }

  .logo {
    max-width: 60px;
  }

  .event-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .qr-code-print {
    width: 100px;
    height: 100px;
    margin: 10px auto;
  }

  .invitation-text {
    font-size: 12px;
    margin-bottom: 5px;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
</style>
