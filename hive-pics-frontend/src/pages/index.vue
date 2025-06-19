<template>
  <v-container class="pa-0" fluid>
    <!-- Hero Section -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-sheet class="py-12" color="primary">
          <v-container>
            <v-row align="center" justify="center">
              <v-col class="text-center" cols="12" md="6">
                <h1 class="text-h2 font-weight-bold mb-4">HivePics</h1>
                <p class="text-h6 mb-6">
                  A collaborative photo collection service for all your events
                </p>
                <v-btn
                  class="mx-2"
                  color="secondary"
                  size="x-large"
                  :to="`/dashboard/`"
                  >Get Started</v-btn
                >
                <v-btn
                  class="mx-2"
                  color="surface"
                  size="x-large"
                  variant="outlined"
                  >Learn More</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- How It Works -->
    <v-container id="how-it-works" class="py-12">
      <v-row>
        <v-col class="text-center mb-8" cols="12">
          <h2 class="text-h4 font-weight-bold">How It Works</h2>
          <p class="text-subtitle-1">
            Simple steps to create and share your event photos
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" height="100%" max-width="400">
            <v-card-item>
              <v-card-title class="text-center">
                <v-icon class="mb-4" color="primary" size="x-large"
                  >mdi-image-multiple</v-icon
                >
                <h3 class="text-h5">Create Event</h3>
              </v-card-title>
              <v-card-text class="text-center">
                Set up albums for your events (weddings, birthdays, BBQs) and
                invite guests via link or QR code.
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" height="100%" max-width="400">
            <v-card-item>
              <v-card-title class="text-center">
                <v-icon class="mb-4" color="primary" size="x-large"
                  >mdi-camera-party-mode</v-icon
                >
                <h3 class="text-h5">Collect Together</h3>
              </v-card-title>
              <v-card-text class="text-center">
                Everyone takes on the challenges, contributes photos and likes
                their favorites.
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" height="100%" max-width="400">
            <v-card-item>
              <v-card-title class="text-center">
                <v-icon class="mb-4" color="primary" size="x-large"
                  >mdi-cloud-download</v-icon
                >
                <h3 class="text-h5">Download & Share</h3>
              </v-card-title>
              <v-card-text class="text-center">
                Download the complete album after the event, or sync it to your
                favorite photo app.
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features -->
    <v-sheet id="features" class="py-12" color="grey-lighten-4">
      <v-container>
        <v-row>
          <v-col class="text-center mb-8" cols="12">
            <h2 class="text-h4 font-weight-bold">Features</h2>
            <p class="text-subtitle-1">
              Everything you need for collaborative photo sharing
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4" sm="6">
            <v-card class="bg-transparent" variant="flat">
              <v-card-item>
                <v-card-title>
                  <v-icon class="me-2" color="primary">mdi-camera</v-icon>
                  Photo Challenges
                </v-card-title>
                <v-card-text>
                  Create fun photo challenges for your guests to complete during
                  the event.
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-card class="bg-transparent" variant="flat">
              <v-card-item>
                <v-card-title>
                  <v-icon class="me-2" color="primary"
                    >mdi-account-group</v-icon
                  >
                  No Guest Registration
                </v-card-title>
                <v-card-text>
                  Guests can participate without creating accounts - just share
                  the link!
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-card class="bg-transparent" variant="flat">
              <v-card-item>
                <v-card-title>
                  <v-icon class="me-2" color="primary">mdi-thumb-up</v-icon>
                  Like & Interact
                </v-card-title>
                <v-card-text>
                  Like your favorite photos and see what others enjoyed most
                  from the event.
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-card class="bg-transparent" variant="flat">
              <v-card-item>
                <v-card-title>
                  <v-icon class="me-2" color="primary">mdi-qrcode</v-icon>
                  QR Code Sharing
                </v-card-title>
                <v-card-text>
                  Easily share your album at the event with custom QR codes
                  guests can scan.
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>

          <!--          <v-col cols="12" md="4" sm="6">-->
          <!--            <v-card class="bg-transparent" variant="flat">-->
          <!--              <v-card-item>-->
          <!--                <v-card-title>-->
          <!--                  <v-icon class="me-2" color="primary">mdi-flag</v-icon>-->
          <!--                  Content Moderation-->
          <!--                </v-card-title>-->
          <!--                <v-card-text>-->
          <!--                  Keep albums appropriate with reporting features for-->
          <!--                  inappropriate content.-->
          <!--                </v-card-text>-->
          <!--              </v-card-item>-->
          <!--            </v-card>-->
          <!--          </v-col>-->

          <v-col cols="12" md="4" sm="6">
            <v-card class="bg-transparent" variant="flat">
              <v-card-item>
                <v-card-title>
                  <v-icon class="me-2" color="primary">mdi-zip-box</v-icon>
                  Complete Download
                </v-card-title>
                <v-card-text>
                  Download the entire album as a zip file after the event to
                  keep memories forever.
                </v-card-text>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Subscription Plans -->
    <v-container id="pricing" class="py-12">
      <v-row>
        <v-col class="text-center mb-8" cols="12">
          <h2 class="text-h4 font-weight-bold">Pricing</h2>
          <p class="text-subtitle-1">Choose the package that suits your needs</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" height="100%" max-width="400">
            <v-card-item>
              <v-card-title class="text-center">
                <h3 class="text-h5">Starter</h3>
              </v-card-title>
              <div class="text-center">
                <span class="text-h4">Free</span>
              </div>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 3 guests"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 25 photos"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Test all features"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Album expires after 7 days"
                  />
                </v-list>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" to="/dashboard/" variant="tonal"
                  >Start Free</v-btn
                >
              </v-card-actions>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            border
            class="mx-auto"
            color="primary-lighten-5"
            height="100%"
            max-width="400"
          >
            <v-card-item>
              <v-card-title class="text-center">
                <h3 class="text-h5">Basic</h3>
              </v-card-title>
              <div class="text-center">
                <span class="text-h4">$</span>
                <span class="text-caption">(one time payment)</span>
              </div>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 25 guests"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 500 photos"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Album stored for 1 month"
                  />
                </v-list>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" to="/dashboard/" variant="tonal"
                  >Start Free</v-btn
                >
              </v-card-actions>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            border
            class="mx-auto"
            color="primary-lighten-5"
            height="100%"
            max-width="400"
          >
            <v-card-item>
              <v-card-title class="text-center">
                <h3 class="text-h5">Plus</h3>
              </v-card-title>
              <div class="text-center">
                <span class="text-h4">$$</span>
                <span class="text-caption">(one time payment)</span>
              </div>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 75 guests"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 3.000 photos"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Album stored for 3 months"
                  />
                </v-list>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" to="/dashboard/" variant="tonal"
                  >Start Free</v-btn
                >
              </v-card-actions>
            </v-card-item>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mx-auto" height="100%" max-width="400">
            <v-card-item>
              <v-card-title class="text-center">
                <h3 class="text-h5">Deluxe</h3>
              </v-card-title>
              <div class="text-center">
                <span class="text-h4">$$$</span>
                <span class="text-caption">(one time payment)</span>
              </div>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 200 guests"
                  />
                  <v-list-item
                    prepend-icon="mdi-check"
                    title="Up to 15.000 photos"
                  />
                </v-list>
                <v-list-item
                  prepend-icon="mdi-check"
                  title="Album stored for 6 months"
                />
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" to="/dashboard/" variant="tonal"
                  >Start Free</v-btn
                >
              </v-card-actions>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-sheet class="py-12" color="primary">
      <v-container>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12" md="8">
            <h2 class="text-h4 font-weight-bold mb-4">
              Ready to Create Your First Album?
            </h2>
            <p class="text-h6 mb-6">
              Join HivePics today and start collecting memories together
            </p>
            <v-btn
              class="mx-2"
              color="white"
              size="x-large"
              to="/dashboard/"
              variant="elevated"
            >
              Get Started Now
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: landing
</route>

<script lang="ts" setup>
//
</script>
