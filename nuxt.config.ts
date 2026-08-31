// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/scss/main.scss'],

  postcss: {
    plugins: {
      autoprefixer: {}, // Автоматически включает Autoprefixer
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/_variables.scss" as *;`,
        },
      },
    },
  },

  modules: ['@nuxt/eslint'],
})
