<template>
  <v-container class="legal-notice-container">
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6 mt-4">
          <v-card-title class="text-h4 mb-4">
            Legal Notice
          </v-card-title>

          <v-card-text>
            <div class="mb-4">
              <div class="text-subtitle-1 font-weight-bold mb-1">Name</div>
              <div class="text-body-1">Benjamin Wöster</div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-1 font-weight-bold mb-1">Address</div>
              <div class="text-body-1">
                Bahnhofstr. 22<br>
                86368 Gersthofen<br>
                Germany
              </div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-1 font-weight-bold mb-1">Email</div>
              <div class="text-body-1">
                <v-btn
                  class="pa-0"
                  color="primary"
                  href="mailto:benjamin.woester@gmail.com"
                  variant="text"
                >
                  benjamin.woester@gmail.com
                </v-btn>
              </div>
            </div>

            <v-divider class="my-6" />

            <div class="mb-4">
              <div class="text-h5 mb-3">Disclaimer</div>
              <div class="text-body-1">
                This project is currently in development and available for testing purposes only.
                Any references to pricing or plans are for illustrative purposes and do not constitute a binding commercial offer.
                A formal commercial launch is intended for the future.
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// No additional script needed
</script>

<style scoped>
/* No additional styles needed */
</style>
