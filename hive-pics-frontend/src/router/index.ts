/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from "virtual:generated-layouts";

// Composables
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHistory } from "vue-router/auto";
// eslint-disable-next-line import/no-duplicates
import { routes } from "vue-router/auto-routes";
import { useAuthStore } from "@/stores/authStore.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { isInitialized, isLoggedIn } = storeToRefs(authStore);

  if (!isInitialized.value) {
    // Wait for Firebase to resolve the user session
    await authStore.init();
  }

  // const { userDisplayName } = storeToRefs(authStore);
  //
  // if (to.meta.requiresAuth) {
  //   console.log(`route ${to.name} requires auth`)
  // } else {
  //   console.log(`route ${to.name} is public`)
  // }
  //
  // if (isLoggedIn.value) {
  //   console.log(`user logged in as '${userDisplayName.value}'`)
  // } else {
  //   console.log('user not logged in')
  // }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({
      name: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
