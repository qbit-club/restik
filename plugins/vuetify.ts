// plugins/vuetify.ts
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { ru } from "vuetify/locale";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: "ru",
      fallback: "en",
      messages: { ru },
    },
    defaults: {
      VBtn: {
        style: "text-transform: none; letter-spacing: normal",
      },
      global: {
        ripple: false,
      },
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#FAB232",
            secondary: "#22B4AF",
            success: "#54B975",
            accent: "#D51829",
          },
        },
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
