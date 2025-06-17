<template>
  <AppHeader>
    <template #nav-links>
      <!-- Desktop actions -->
      <div class="d-none d-md-flex">
        <v-btn
          class="mx-1"
          color="white"
          variant="text"
          @click="scrollToSection('how-it-works')"
        >
          How It Works
        </v-btn>
        <v-btn
          class="mx-1"
          color="white"
          variant="text"
          @click="scrollToSection('features')"
        >
          Features
        </v-btn>
        <v-btn
          class="mx-1"
          color="white"
          variant="text"
          @click="scrollToSection('pricing')"
        >
          Pricing
        </v-btn>
      </div>
    </template>
  </AppHeader>

  <v-main>
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script lang="ts" setup>
function scrollToSection(sectionId: string) {
  document
    .querySelector(`#${sectionId}`)
    ?.scrollIntoView({ behavior: "smooth" });
}
</script>
