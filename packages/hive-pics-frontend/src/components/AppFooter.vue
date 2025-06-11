<template>
  <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-0 py-3">

    <div class="text-caption">
      <router-link
        class="mx-2 footer-link text-decoration-none"
        to="/legalNotice"
      >
        Legal Notice
      </router-link>
      <span class="mx-1">|</span>
      <router-link
        class="mx-2 footer-link text-decoration-none"
        to="/privacyPolicy"
      >
        Privacy Policy
      </router-link>
    </div>

    <div class="flex-1-0-100 text-center mt-2 text-caption text-secondary">
      &copy; {{ new Date().getFullYear() }} Hive Pics. All rights reserved.
    </div>

  </v-footer>
</template>

<script setup lang="ts">
  /* none */
</script>

<style scoped lang="sass">
  .footer-link
    color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))
    transition: .2s ease-in-out

    &:hover
      color: rgba(var(--v-theme-primary), 1)

  .text--secondary
    color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))
    letter-spacing: 0.0333333333em
    font-weight: 400

</style>
