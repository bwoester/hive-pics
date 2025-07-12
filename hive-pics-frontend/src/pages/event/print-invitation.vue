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
    <div id="printable-cards" class="print-only">
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

function triggerPrint() {
  // wait a little bit, to make sure all images have been loaded
  setTimeout(() => {
    window.print();
  }, 1000);
}

// No longer automatically trigger printing on mount
// Users can now click the Print button when they're ready
onMounted(() => {
  // Initialize any required data
  triggerPrint();
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
    margin: 0;
  }
}
</style>
