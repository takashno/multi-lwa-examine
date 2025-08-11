import type { Todo, TodoFormData, PaginationInfo } from '../types/todo'
import { createDummyTodos, generateId, getCurrentDateTime } from '../utils/todo'

// グローバル状態として管理
const globalTodos = ref<Todo[]>([])
const globalCurrentPage = ref(1)
const globalItemsPerPage = ref(10)

export const useTodoStore = () => {
  // 初期化を一度だけ実行
  if (globalTodos.value.length === 0) {
    globalTodos.value = createDummyTodos()
  }

  // ダミーデータの初期化
  const initializeDummyData = () => {
    globalTodos.value = createDummyTodos()
  }

  // フィルタリング（削除済みを除外）
  const activeTodos = computed(() => 
    globalTodos.value.filter(todo => todo.status !== '削除')
  )

  // ページネーション情報
  const paginationInfo = computed((): PaginationInfo => {
    const totalItems = activeTodos.value.length
    const totalPages = Math.ceil(totalItems / globalItemsPerPage.value)
    const startItem = (globalCurrentPage.value - 1) * globalItemsPerPage.value + 1
    const endItem = Math.min(globalCurrentPage.value * globalItemsPerPage.value, totalItems)

    return {
      currentPage: globalCurrentPage.value,
      totalPages,
      totalItems,
      itemsPerPage: globalItemsPerPage.value,
      startItem,
      endItem
    }
  })

  // 現在のページのTODO一覧
  const paginatedTodos = computed(() => {
    const start = (globalCurrentPage.value - 1) * globalItemsPerPage.value
    const end = start + globalItemsPerPage.value
    return activeTodos.value.slice(start, end)
  })

  // TODOの作成
  const createTodo = (formData: TodoFormData, createdBy: string = 'システムユーザー') => {
    const now = getCurrentDateTime()
    const newTodo: Todo = {
      id: generateId(),
      title: formData.title,
      content: formData.content,
      dueDate: formData.dueDate,
      status: formData.status,
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy
    }
    globalTodos.value.unshift(newTodo)
    return newTodo
  }

  // TODOの更新
  const updateTodo = (id: string, formData: TodoFormData, updatedBy: string = 'システムユーザー') => {
    const index = globalTodos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      const existingTodo = globalTodos.value[index]
      if (existingTodo) {
        const updatedTodo: Todo = {
          id: existingTodo.id,
          title: formData.title,
          content: formData.content,
          dueDate: formData.dueDate,
          status: formData.status,
          createdAt: existingTodo.createdAt,
          createdBy: existingTodo.createdBy,
          updatedAt: getCurrentDateTime(),
          updatedBy
        }
        globalTodos.value[index] = updatedTodo
        return updatedTodo
      }
    }
    return null
  }

  // TODOの取得
  const getTodoById = (id: string): Todo | undefined => {
    return globalTodos.value.find(todo => todo.id === id)
  }

  // TODOの削除（論理削除）
  const deleteTodo = (id: string, deletedBy: string = 'システムユーザー') => {
    const todo = getTodoById(id)
    if (todo) {
      updateTodo(id, {
        title: todo.title,
        content: todo.content,
        dueDate: todo.dueDate,
        status: '削除'
      }, deletedBy)
    }
  }

  // ページ変更
  const setCurrentPage = (page: number) => {
    if (page >= 1 && page <= paginationInfo.value.totalPages) {
      globalCurrentPage.value = page
    }
  }

  return {
    // State
    todos: readonly(globalTodos),
    currentPage: readonly(globalCurrentPage),
    itemsPerPage: readonly(globalItemsPerPage),
    
    // Computed
    activeTodos,
    paginatedTodos,
    paginationInfo,
    
    // Actions
    createTodo,
    updateTodo,
    getTodoById,
    deleteTodo,
    setCurrentPage,
    initializeDummyData
  }
}
