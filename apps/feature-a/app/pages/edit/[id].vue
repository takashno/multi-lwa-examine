<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">TODO編集</h1>
        
        <!-- 戻るボタン -->
        <NuxtLink 
          to="/"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          一覧に戻る
        </NuxtLink>
      </div>

      <!-- TODOが見つからない場合 -->
      <div v-if="!todo" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div class="text-sm text-yellow-700">
            指定されたTODOが見つかりません。
          </div>
        </div>
      </div>

      <!-- フォーム -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-lg rounded-lg p-6">
        <!-- タイトル -->
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="TODOのタイトルを入力してください"
          />
        </div>

        <!-- 内容 -->
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            内容 <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            v-model="form.content"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="TODOの詳細内容を入力してください"
          ></textarea>
        </div>

        <!-- 期日 -->
        <div class="mb-6">
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-2">
            期日
          </label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- ステータス -->
        <div class="mb-6">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            ステータス <span class="text-red-500">*</span>
          </label>
          <select
            id="status"
            v-model="form.status"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="未着手">未着手</option>
            <option value="着手中">着手中</option>
            <option value="完了">完了</option>
          </select>
        </div>

        <!-- メタ情報 -->
        <div class="mb-6 bg-gray-50 p-4 rounded-md">
          <h3 class="text-sm font-medium text-gray-700 mb-2">作成・更新情報</h3>
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span class="font-medium">作成者:</span> {{ todo.createdBy }}
            </div>
            <div>
              <span class="font-medium">作成日:</span> {{ formatDateTime(todo.createdAt) }}
            </div>
            <div>
              <span class="font-medium">更新者:</span> {{ todo.updatedBy }}
            </div>
            <div>
              <span class="font-medium">更新日:</span> {{ formatDateTime(todo.updatedAt) }}
            </div>
          </div>
        </div>

        <!-- エラーメッセージ -->
        <div v-if="errorMessage" class="mb-6">
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
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

        <!-- ボタン -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">更新中...</span>
            <span v-else>更新</span>
          </button>
          
          <button
            type="button"
            @click="handleDelete"
            :disabled="isSubmitting"
            class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            削除
          </button>
          
          <NuxtLink
            to="/"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
          >
            キャンセル
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoFormData } from '../../types/todo'
import { formatDateTime } from '../../utils/todo'

const route = useRoute()
const router = useRouter()
const { getTodoById, updateTodo, deleteTodo } = useTodoStore()

const todoId = route.params.id as string
const todo = getTodoById(todoId)

const form = ref<TodoFormData>({
  title: todo?.title || '',
  content: todo?.content || '',
  dueDate: todo?.dueDate || null,
  status: todo?.status || '未着手'
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (isSubmitting.value || !todo) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    // バリデーション
    if (!form.value.title.trim()) {
      errorMessage.value = 'タイトルは必須です'
      return
    }

    if (!form.value.content.trim()) {
      errorMessage.value = '内容は必須です'
      return
    }

    // TODOを更新
    updateTodo(todoId, form.value, 'システムユーザー')

    // 一覧画面にリダイレクト
    await router.push('/')
  } catch (error) {
    errorMessage.value = 'エラーが発生しました。もう一度お試しください。'
    console.error('Todo update error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('本当に削除しますか？')) return

  try {
    isSubmitting.value = true
    deleteTodo(todoId, 'システムユーザー')
    await router.push('/')
  } catch (error) {
    errorMessage.value = 'エラーが発生しました。もう一度お試しください。'
    console.error('Todo delete error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// TODOが見つからない場合のメタタグ設定
if (!todo) {
  useSeoMeta({
    title: 'TODO not found'
  })
} else {
  useSeoMeta({
    title: `編集: ${todo.title}`
  })
}
</script>
