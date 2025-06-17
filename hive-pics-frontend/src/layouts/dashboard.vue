<template>
  <AppHeader />

  <v-main>
    <!-- Content max width, centered -->
    <v-container class="py-4" max-width="1280">
      <router-view />
    </v-container>
  </v-main>

  <AppFooter />
</template>

<script lang="ts" setup>
/* nop */
</script>

<style scoped lang="sass">
/* nop */
</style>
