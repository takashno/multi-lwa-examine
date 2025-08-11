<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">プロフィール新規作成</h1>
        
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

      <!-- フォーム -->
      <form @submit.prevent="handleSubmit" class="bg-white shadow-lg rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 姓 -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              姓 <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="田中"
            />
          </div>

          <!-- 名 -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              名 <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="太郎"
            />
          </div>

          <!-- メールアドレス -->
          <div class="md:col-span-2">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tanaka.taro@example.com"
            />
          </div>

          <!-- 電話番号 -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              電話番号 <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="090-1234-5678"
            />
          </div>

          <!-- 生年月日 -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
              生年月日
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 性別 -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
              性別 <span class="text-red-500">*</span>
            </label>
            <select
              id="gender"
              v-model="form.gender"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
              <option value="未設定">未設定</option>
            </select>
          </div>

          <!-- 職業 -->
          <div>
            <label for="occupation" class="block text-sm font-medium text-gray-700 mb-2">
              職業 <span class="text-red-500">*</span>
            </label>
            <input
              id="occupation"
              v-model="form.occupation"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="エンジニア"
            />
          </div>
        </div>

        <!-- 住所セクション -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">住所</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 郵便番号 -->
            <div>
              <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-2">
                郵便番号 <span class="text-red-500">*</span>
              </label>
              <input
                id="zipCode"
                v-model="form.address.zipCode"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123-4567"
              />
            </div>

            <!-- 都道府県 -->
            <div>
              <label for="prefecture" class="block text-sm font-medium text-gray-700 mb-2">
                都道府県 <span class="text-red-500">*</span>
              </label>
              <input
                id="prefecture"
                v-model="form.address.prefecture"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="東京都"
              />
            </div>

            <!-- 市区町村 -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                市区町村 <span class="text-red-500">*</span>
              </label>
              <input
                id="city"
                v-model="form.address.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="渋谷区"
              />
            </div>

            <!-- 町域・番地 -->
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                町域・番地 <span class="text-red-500">*</span>
              </label>
              <input
                id="street"
                v-model="form.address.street"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1-2-3"
              />
            </div>

            <!-- 建物名・部屋番号 -->
            <div class="md:col-span-2">
              <label for="building" class="block text-sm font-medium text-gray-700 mb-2">
                建物名・部屋番号
              </label>
              <input
                id="building"
                v-model="form.address.building"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="サンハイツ101"
              />
            </div>
          </div>
        </div>

        <!-- 自己紹介 -->
        <div class="mt-8">
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
            自己紹介
          </label>
          <textarea
            id="bio"
            v-model="form.bio"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="簡単な自己紹介をお書きください"
          ></textarea>
        </div>

        <!-- ステータス -->
        <div class="mt-6">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            ステータス <span class="text-red-500">*</span>
          </label>
          <select
            id="status"
            v-model="form.status"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="アクティブ">アクティブ</option>
            <option value="一時停止">一時停止</option>
            <option value="無効">無効</option>
          </select>
        </div>

        <!-- エラーメッセージ -->
        <div v-if="errorMessage" class="mt-6">
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
        <div class="mt-8 flex space-x-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">作成中...</span>
            <span v-else>作成</span>
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
import type { ProfileFormData } from '../types/profile'

const { createProfile } = useProfileStore()
const router = useRouter()

const form = ref<ProfileFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: null,
  gender: '未設定',
  address: {
    zipCode: '',
    prefecture: '',
    city: '',
    street: '',
    building: ''
  },
  occupation: '',
  bio: '',
  status: 'アクティブ'
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    // バリデーション
    if (!form.value.lastName.trim()) {
      errorMessage.value = '姓は必須です'
      return
    }

    if (!form.value.firstName.trim()) {
      errorMessage.value = '名は必須です'
      return
    }

    if (!form.value.email.trim()) {
      errorMessage.value = 'メールアドレスは必須です'
      return
    }

    if (!form.value.phone.trim()) {
      errorMessage.value = '電話番号は必須です'
      return
    }

    // プロフィールを作成
    createProfile(form.value, 'システムユーザー')

    // 一覧画面にリダイレクト
    await router.push('/')
  } catch (error) {
    errorMessage.value = 'エラーが発生しました。もう一度お試しください。'
    console.error('Profile creation error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
