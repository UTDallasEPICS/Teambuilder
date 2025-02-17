import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
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
  modules: ["@nuxtjs/tailwindcss"],
  css: ['@/assets/css/globals.css'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  compatibilityDate: '2024-09-19',
})

