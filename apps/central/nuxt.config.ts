// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: ['composables']
  },
  ssr: true,
  nitro: {
    preset: 'aws-lambda',
    experimental: {
      wasm: true
    }
  },
  runtimeConfig: {
    // Lambda Web Adapter用のポート設定
    port: Number(process.env.PORT) || 8080,
    // Private keys (only available on the server-side)
    // Public keys that are exposed to the client-side
    public: {
      featureAUrl: process.env.FEATURE_A_URL || 'http://localhost:3001',
      featureBUrl: process.env.FEATURE_B_URL || 'http://localhost:3002',
      cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
      cognitoClientId: process.env.COGNITO_CLIENT_ID,
      cognitoRegion: process.env.COGNITO_REGION
    }
  }
})