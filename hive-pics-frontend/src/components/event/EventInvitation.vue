<template>
  <div class="invitation-wrapper" :class="cardSizeClass">
    <div class="invitation-card">
      <!-- Left side with logo and title -->
      <div class="card-left">
        <div class="card-header">
          <img alt="HivePics logo" class="logo" src="@/assets/logo.svg" />
          <span class="logo-text"><b>Hive</b>Pics</span>
        </div>

        <h2 v-if="eventTitle" class="event-title">{{ eventTitle }}</h2>

        <div class="card-text">
          <p class="secondary-text">
            Capture moments, complete challenges, and share the fun!
          </p>
        </div>
      </div>

      <!-- Right side with QR code -->
      <div class="card-right">
        <div class="qr-code-container">
          <img
            alt="Event QR Code"
            class="qr-code"
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invitationLink)}`"
          />
          <p class="scan-text">Scan to join!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define props
const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    default: "",
  },
  cardSize: {
    type: String,
    default: "business",
    validator: (value: string) => ["a7", "a8", "business"].includes(value),
  },
});

// Compute the invitation link based on the token ID
const invitationLink = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/event/join?t=${props.tokenId}`;
});

// Compute the CSS class based on the card size
const cardSizeClass = computed(() => {
  return `size-${props.cardSize}`;
});
</script>

<style scoped>
.invitation-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.invitation-card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: row; /* Changed to row for landscape orientation */
  width: 100%;
  height: 100%;
  position: relative;
  border: none;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.4) 100%
  );
}

/* Card sizes with landscape orientation */
.size-a7 {
  /* DIN A7: 105x74mm (landscape orientation) */
  aspect-ratio: 1.4189; /* 105/74 */
  max-width: 105mm;
}

.size-a8 {
  /* DIN A8: 74x52mm (landscape orientation) */
  aspect-ratio: 1.4231; /* 74/52 */
  max-width: 74mm;
}

.size-business {
  /* Business card: 85x55mm (landscape orientation) */
  aspect-ratio: 1.5455; /* 85/55 */
  max-width: 85mm;
}

/* Left side of the card */
.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f8f9fa;
  background-image: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

/* Add a subtle pattern overlay */
.card-left::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E");
  z-index: 0;
}

/* Right side of the card */
.card-right {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #f0f4f8;
  position: relative;
  overflow: hidden;
}

/* Add a diagonal stripe pattern to the right side */
.card-right::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    45deg,
    rgba(66, 133, 244, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(66, 133, 244, 0.1) 50%,
    rgba(66, 133, 244, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
  z-index: 0;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 0 0 12px 0;
  position: relative;
  z-index: 1;
  border-bottom: 2px solid #4285f4;
  margin-bottom: 12px;
}

.logo {
  height: 28px;
  width: auto;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  color: #4285f4;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.event-title {
  font-size: 22px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  line-height: 1.2;
}

.card-text {
  position: relative;
  z-index: 1;
}

.secondary-text {
  font-size: 14px;
  color: #5f6368;
  line-height: 1.4;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  width: 100%;
}

.qr-code {
  width: 85%;
  height: auto;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.scan-text {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #4285f4;
  text-align: center;
}

/* Responsive adjustments for different card sizes */
.size-a7 .logo {
  height: 22px;
}

.size-a7 .logo-text {
  font-size: 18px;
}

.size-a7 .event-title {
  font-size: 18px;
  margin-bottom: 12px;
}

.size-a7 .secondary-text {
  font-size: 12px;
}

.size-a7 .scan-text {
  font-size: 14px;
}

.size-a8 .logo {
  height: 18px;
}

.size-a8 .logo-text {
  font-size: 16px;
}

.size-a8 .event-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.size-a8 .secondary-text {
  font-size: 10px;
}

.size-a8 .scan-text {
  font-size: 12px;
  margin-top: 8px;
}

.size-a8 .card-left,
.size-a8 .card-right {
  padding: 12px;
}

.size-a8 .card-header {
  padding-bottom: 8px;
  margin-bottom: 8px;
}

/* Print styles */
@media print {
  .invitation-wrapper {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .invitation-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: none;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .card-left::before,
  .card-right::before {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .qr-code {
    border: 3px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
</style>
