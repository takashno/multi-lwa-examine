<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-4xl w-full">
      <!-- ヘロセクション -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            統合管理
          </span>
          <br>
          システム
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          TODO管理とプロフィール管理を統合したオールインワンソリューション。
          効率的なワークフローで生産性を向上させましょう。
        </p>
        
        <!-- アクションボタン -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/login"
            class="btn-primary inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            ログイン
          </NuxtLink>
          
          <button
            @click="scrollToFeatures"
            class="btn-secondary inline-flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            機能を見る
          </button>
        </div>
      </div>

      <!-- 機能紹介 -->
      <div id="features" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div class="feature-card">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl mr-4">
              📝
            </div>
            <h3 class="text-2xl font-bold text-gray-900">TODO管理</h3>
          </div>
          <p class="text-gray-600 mb-4">
            タスクの作成、編集、削除機能を提供。進捗状況の管理と期日の設定で、効率的なタスク管理を実現します。
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• タスクの一覧表示とページネーション</li>
            <li>• 新規作成・編集・削除機能</li>
            <li>• ステータス管理（未着手・着手中・完了）</li>
            <li>• 期日設定と進捗追跡</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl mr-4">
              👤
            </div>
            <h3 class="text-2xl font-bold text-gray-900">プロフィール管理</h3>
          </div>
          <p class="text-gray-600 mb-4">
            個人情報の管理機能を提供。連絡先、住所、職業情報などを安全に管理できます。
          </p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• 個人情報の一覧表示と検索</li>
            <li>• 詳細なプロフィール編集</li>
            <li>• 住所情報の管理</li>
            <li>• ステータス管理とアクセス制御</li>
          </ul>
        </div>
      </div>

      <!-- システム情報 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">システム情報</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <div class="font-semibold text-gray-900 mb-1">フレームワーク</div>
            <div>Nuxt 4 + Vue 3</div>
          </div>
          <div>
            <div class="font-semibold text-gray-900 mb-1">スタイリング</div>
            <div>Tailwind CSS</div>
          </div>
          <div>
            <div class="font-semibold text-gray-900 mb-1">TypeScript</div>
            <div>完全型安全</div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            デモ用アカウント: <strong>admin/password</strong> または <strong>user/password</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuthStore()

// 既にログインしている場合はダッシュボードにリダイレクト
if (isAuthenticated.value) {
  await navigateTo('/dashboard')
}

const scrollToFeatures = () => {
  const featuresElement = document.getElementById('features')
  if (featuresElement) {
    featuresElement.scrollIntoView({ behavior: 'smooth' })
  }
}

useSeoMeta({
  title: '統合管理システム',
  description: 'TODO管理とプロフィール管理を統合したオールインワンソリューション'
})
</script>
