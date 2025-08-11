<template>
  <div class="min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">
            ダッシュボード
          </h1>
          
          <div class="flex items-center space-x-4">
            <!-- ユーザー情報 -->
            <div class="text-sm text-gray-600">
              こんにちは、<span class="font-medium text-gray-900">{{ currentUser?.lastName }} {{ currentUser?.firstName }}</span>さん
            </div>
            
            <!-- ログアウトボタン -->
            <button
              @click="handleLogout"
              class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto px-4 py-8">
      <!-- ウェルカムセクション -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          統合管理システムへようこそ！
        </h2>
        <p class="text-gray-600 text-lg">
          利用可能な機能から選択して、効率的な作業を始めましょう。
        </p>
      </div>

      <!-- ユーザー情報カード -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-4">アカウント情報</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-gray-500 mb-1">ユーザー名</div>
            <div class="font-medium">{{ currentUser?.username }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">メールアドレス</div>
            <div class="font-medium">{{ currentUser?.email }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">ロール</div>
            <div class="font-medium">
              <span :class="getRoleClass(currentUser?.role)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getRoleLabel(currentUser?.role) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="currentUser?.lastLoginAt" class="mt-4 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            最終ログイン: {{ formatDateTime(currentUser.lastLoginAt) }}
          </div>
        </div>
      </div>

      <!-- 機能カード -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">利用可能な機能</h3>
        
        <div v-if="accessibleFeatures.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-lg mb-4">
            現在利用可能な機能がありません
          </div>
          <p class="text-gray-500">
            管理者にお問い合わせください
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in accessibleFeatures"
            :key="feature.id"
            @click="openFeature(feature)"
            class="feature-card group"
          >
            <div class="flex items-center mb-4">
              <div :class="[feature.color, 'w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform']">
                {{ feature.icon }}
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ feature.name }}
                </h4>
                <div class="text-sm text-gray-500">クリックして開く</div>
              </div>
            </div>
            
            <p class="text-gray-600 mb-4">
              {{ feature.description }}
            </p>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                {{ feature.url }}
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理者向け情報 -->
      <div v-if="currentUser?.role === 'admin'" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 class="text-lg font-bold text-yellow-900 mb-2">
          🔧 管理者情報
        </h3>
        <p class="text-yellow-700 mb-4">
          すべてのシステム機能にアクセスできます。セキュリティとユーザー管理にご注意ください。
        </p>
        <div class="text-sm text-yellow-600">
          <div><strong>アクティブ機能:</strong> {{ getAllFeatures().filter((f: AppFeature) => f.isActive).length }}個</div>
          <div><strong>総機能数:</strong> {{ getAllFeatures().length }}個</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { AppFeature, UserRole } from '../types/auth'

const { currentUser, accessibleFeatures, logout, getAllFeatures } = useAuthStore()
const router = useRouter()

// 認証チェック
if (!currentUser.value) {
  await navigateTo('/login')
}

const handleLogout = async () => {
  if (confirm('ログアウトしますか？')) {
    logout()
    await router.push('/')
  }
}

const openFeature = (feature: AppFeature) => {
  // 新しいタブで外部アプリを開く
  window.open(feature.url, '_blank')
}

const getRoleLabel = (role?: UserRole) => {
  const labels = {
    admin: '管理者',
    user: '一般ユーザー',
    guest: 'ゲスト'
  }
  return role ? labels[role] : '不明'
}

const getRoleClass = (role?: UserRole) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    user: 'bg-blue-100 text-blue-800',
    guest: 'bg-gray-100 text-gray-800'
  }
  return role ? classes[role] : 'bg-gray-100 text-gray-800'
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ja-JP')
}

useSeoMeta({
  title: 'ダッシュボード - 統合管理システム',
  description: '統合管理システムのメインダッシュボード'
})
</script>
