import type { Todo, TodoFormData, PaginationInfo } from '~/types/todo'
import { createDummyTodos, generateId, getCurrentDateTime } from '~/utils/todo'

export const useTodoStore = () => {
  const todos = ref<Todo[]>([])
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // ダミーデータの初期化
  const initializeDummyData = () => {
    todos.value = createDummyTodos()
  }

  // フィルタリング（削除済みを除外）
  const activeTodos = computed(() => 
    todos.value.filter(todo => todo.status !== '削除')
  )

  // ページネーション情報
  const paginationInfo = computed((): PaginationInfo => {
    const totalItems = activeTodos.value.length
    const totalPages = Math.ceil(totalItems / itemsPerPage.value)
    const startItem = (currentPage.value - 1) * itemsPerPage.value + 1
    const endItem = Math.min(currentPage.value * itemsPerPage.value, totalItems)

    return {
      currentPage: currentPage.value,
      totalPages,
      totalItems,
      itemsPerPage: itemsPerPage.value,
      startItem,
      endItem
    }
  })

  // 現在のページのTODO一覧
  const paginatedTodos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
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
    todos.value.unshift(newTodo)
    return newTodo
  }

  // TODOの更新
  const updateTodo = (id: string, formData: TodoFormData, updatedBy: string = 'システムユーザー') => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value[index] = {
        ...todos.value[index],
        title: formData.title,
        content: formData.content,
        dueDate: formData.dueDate,
        status: formData.status,
        updatedAt: getCurrentDateTime(),
        updatedBy
      }
      return todos.value[index]
    }
    return null
  }

  // TODOの取得
  const getTodoById = (id: string): Todo | undefined => {
    return todos.value.find(todo => todo.id === id)
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
      currentPage.value = page
    }
  }

  // データがない場合の初期化
  if (todos.value.length === 0) {
    initializeDummyData()
  }

  return {
    // State
    todos: readonly(todos),
    currentPage: readonly(currentPage),
    itemsPerPage: readonly(itemsPerPage),
    
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
