import { defineNuxtConfig } from "nuxt/config";
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
  components: {
    multiselect: {
      root: {
        background: 'rgb(253,245,217)'
      }
    },
    inputtext: {
      root: {
        background: 'rgb(253,245,217)',
        borderColor: 'rgb(253,245,217)'
      }
    },
    datatable: {
      headerCell: {
        background: 'rgb(98,158,145)',
        borderColor: 'rgb(253,245,217)'
      },
      row: {
        background: 'rgb(253,245,217)'
      },
    }
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


