<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">プロフィール一覧</h1>
      
      <!-- 新規作成ボタン -->
      <div class="mb-6">
        <NuxtLink 
          to="/new"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          新規作成
        </NuxtLink>
      </div>

      <!-- 件数表示 -->
      <div class="mb-4 text-sm text-gray-600">
        全{{ paginationInfo.totalItems }}件中 {{ paginationInfo.startItem }}-{{ paginationInfo.endItem }}件を表示
      </div>

      <!-- プロフィールテーブル -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メールアドレス
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                職業
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                登録日
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="profile in paginatedProfiles" :key="profile.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <NuxtLink 
                  :to="`/edit/${profile.id}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {{ profile.lastName }} {{ profile.firstName }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ profile.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ profile.occupation }}
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="getStatusClass(profile.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ profile.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDate(profile.createdAt) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <button
                  @click="handleDelete(profile.id)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ページネーション -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          ページ {{ paginationInfo.currentPage }} / {{ paginationInfo.totalPages }}
        </div>
        <div class="flex space-x-2">
          <button
            @click="setCurrentPage(paginationInfo.currentPage - 1)"
            :disabled="paginationInfo.currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            前へ
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="setCurrentPage(page as number)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                paginationInfo.currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm text-gray-500">...</span>
          </template>
          
          <button
            @click="setCurrentPage(paginationInfo.currentPage + 1)"
            :disabled="paginationInfo.currentPage === paginationInfo.totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileStatus } from '../types/profile'
import { formatDate } from '../utils/profile'

const { paginatedProfiles, paginationInfo, setCurrentPage, deleteProfile } = useProfileStore()

const getStatusClass = (status: ProfileStatus) => {
  const classes = {
    'アクティブ': 'bg-green-100 text-green-800',
    '一時停止': 'bg-yellow-100 text-yellow-800',
    '無効': 'bg-red-100 text-red-800',
    '削除済み': 'bg-gray-100 text-gray-800'
  }
  return classes[status]
}

const handleDelete = (id: string) => {
  if (confirm('本当に削除しますか？')) {
    deleteProfile(id)
  }
}

// ページネーション表示用のページ番号配列を計算
const visiblePages = computed(() => {
  const current = paginationInfo.value.currentPage
  const total = paginationInfo.value.totalPages
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    // 総ページ数が7以下の場合は全て表示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 総ページ数が多い場合は省略表示
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})
</script>
