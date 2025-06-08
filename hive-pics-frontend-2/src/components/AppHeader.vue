<template>
  <v-app-bar color="primary">

    <!-- Logo and AppName as link to landing page -->
    <!--
    TODO add @click="scrollToSection('features')" if already on landing page
    -->
    <template #prepend>
      <router-link class="mr-4 text-white" to="/">
        <img
          alt="Logo"
          class="logo"
          src="@/assets/logo-no-text.png"
        >
        <span class="ml-2"><b>Hive</b> Pics</span>
      </router-link>
    </template>


    <template #append>
      <!-- Navigation links -->
      <slot name="nav-links" />

      <!-- Login Button -->
      <!--
      TODO Might be replaced with a button opening a menu
      -->
      <v-btn
        class="ml-2"
        prepend-icon="mdi-login"
        to="/login"
        variant="flat"
      >
        Login
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
  /* none */
</script>

<style scoped lang="sass">
  a
    text-decoration: none
    display: flex
    align-items: center
  .logo
    width: 40px
    height: 40px
    object-fit: contain
</style>
