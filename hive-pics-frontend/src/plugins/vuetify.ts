/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { createI18n, useI18n } from "vue-i18n";
// Composables
import { createVuetify } from "vuetify";

import { md3 } from "vuetify/blueprints";
import { VDateInput } from "vuetify/labs/components";
import { de, en } from "vuetify/locale";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const messages = {
  de: {
    $vuetify: {
      ...de,
    },
  },
  en: {
    $vuetify: {
      ...en,
    },
  },
};

const i18n = createI18n({
  locale: "de",
  fallbackLocale: "en",
  legacy: false,
  messages,
});

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  components: {
    VDateInput,
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme: "light",
  },
});
