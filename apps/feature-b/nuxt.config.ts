// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: ['composables']
  },
  nitro: {
    preset: 'aws-lambda',
    experimental: {
      wasm: true
    }
  },
  ssr: true,
  runtimeConfig: {
    // Lambda Web Adapter用のポート設定
    port: Number(process.env.PORT) || 8080
  }
})