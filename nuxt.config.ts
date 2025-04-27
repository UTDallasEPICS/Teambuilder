import { defineNuxtConfig } from "nuxt/config";
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { colors } from "./utils/colors";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}'
    },  
    colorScheme: {
      surface: {
        100: colors.beige,
        200: colors.darkBeige
      },
      formField: {
        background: colors.beige,
        borderColor: colors.teal,
      },
      overlay: {
        select: {
          background: colors.beige
        }
      },
      navigation: {
        submenuIcon: {
          color: colors.beige,
          focusColor: colors.beige,
          activeColor: colors.beige
        }
      },
      // DataTable colors
      content: {
        background: colors.beige,
        // hoverBackground: colors.red, // row hover
      }
    }
  },
  components: {
    button: {
      root: {
        secondary: {
          background: colors.beige,
          activeColor: colors.beige,
        }
      }
    },
    datatable: {
      headerCell: {
        background: colors.teal,
      },
    },
  }
})

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap'
        }
      ]
    }
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "@pinia/nuxt",
    "@primevue/nuxt-module"
  ],
  primevue: {
    options: {
        theme: {
          preset: MyPreset
        }
    },
    components: {
      exclude: ['Form', 'FormField']
    }
  },
  css: ['@/assets/css/globals.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  compatibilityDate: '2024-09-19',
})


