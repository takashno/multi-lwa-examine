<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- ロゴ・タイトル -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">ログイン</h1>
        <p class="text-gray-600">統合管理システムにアクセス</p>
      </div>

      <!-- ログインフォーム -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- ユーザー名 -->
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            ユーザー名
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="ユーザー名を入力"
            :disabled="isLoading"
          />
        </div>

        <!-- パスワード -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="パスワードを入力"
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              :disabled="isLoading"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- エラーメッセージ -->
        <div v-if="errorMessage" class="mb-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- ログインボタン -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span v-if="isLoading">ログイン中...</span>
          <span v-else>ログイン</span>
        </button>

        <!-- デモアカウント情報 -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 class="text-sm font-medium text-blue-900 mb-2">デモアカウント</h4>
          <div class="text-xs text-blue-700 space-y-1">
            <div><strong>管理者:</strong> admin / password</div>
            <div><strong>一般ユーザー:</strong> user / password</div>
          </div>
        </div>
      </form>

      <!-- 戻るリンク -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          ← トップページに戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginCredentials } from '../types/auth'

const { login, isAuthenticated } = useAuthStore()
const router = useRouter()

// 既にログインしている場合はダッシュボードにリダイレクト
if (isAuthenticated.value) {
  await navigateTo('/dashboard')
}

const credentials = ref<LoginCredentials>({
  username: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    const result = await login(credentials.value)

    if (result.success) {
      await router.push('/dashboard')
    } else {
      errorMessage.value = result.error || 'ログインに失敗しました'
    }
  } catch (error) {
    errorMessage.value = 'エラーが発生しました。もう一度お試しください。'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'ログイン - 統合管理システム',
  description: '統合管理システムにログインしてください'
})
</script>
