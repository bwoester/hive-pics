<template>
  <AppHeader />

  <v-main>
    <!-- Content max width, centered -->
    <v-container class="py-4" max-width="1280">
      <router-view />
    </v-container>
  </v-main>

  <AppFooter />

  <!-- FAB: Only rendered if defined -->
  <v-fab
    v-show="!!fabState"
    :active="fabState?.active ?? false"
    app
    :elevation="fabState?.elevation ?? 8"
    :icon="fabState?.icon ?? 'mdi-filter-variant'"
    @click="fabState?.onClick"
  >
  </v-fab>
</template>

<script lang="ts" setup>
import { useFab } from "@/composables/useFab";

const { fabState } = useFab();
</script>

<style scoped lang="sass">
/* nop */
</style>
