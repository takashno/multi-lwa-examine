<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors">
            TODO管理システム
          </NuxtLink>
        </h1>
      </div>
    </header>
    
    <main class="flex-1">
      <NuxtPage />
    </main>
    
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
        © 2025 TODO管理システム
      </div>
    </footer>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'TODO管理システム',
  description: 'シンプルで使いやすいTODO管理システム'
})
</script>
