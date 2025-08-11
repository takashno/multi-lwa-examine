export interface Todo {
  id: string
  title: string
  content: string
  dueDate: string | null
  status: TodoStatus
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export type TodoStatus = '未着手' | '着手中' | '完了' | '削除'

export interface TodoFormData {
  title: string
  content: string
  dueDate: string | null
  status: TodoStatus
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startItem: number
  endItem: number
}
