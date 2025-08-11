import type { Todo, TodoStatus } from '../types/todo'

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const getCurrentDateTime = (): string => {
  return new Date().toISOString()
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ja-JP')
}

export const createDummyTodos = (): Todo[] => {
  const statuses: TodoStatus[] = ['未着手', '着手中', '完了', '削除']
  const users = ['山田太郎', '佐藤花子', '田中次郎', '鈴木一郎']
  
  const todos: Todo[] = []
  
  for (let i = 1; i <= 25; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    const dueDate = Math.random() > 0.3 
      ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null
    
    todos.push({
      id: generateId(),
      title: `TODO ${i}: ${getTodoTitle(i)}`,
      content: `これは${i}番目のTODOの詳細内容です。\n実装やテスト、ドキュメント作成などの作業が含まれます。`,
      dueDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      createdBy: users[Math.floor(Math.random() * users.length)],
      updatedAt,
      updatedBy: users[Math.floor(Math.random() * users.length)]
    })
  }
  
  return todos
}

const getTodoTitle = (index: number): string => {
  const titles = [
    'ユーザー認証機能の実装',
    'データベース設計の見直し',
    'APIエンドポイントの作成',
    'フロントエンド画面の修正',
    'テストケースの追加',
    'ドキュメントの更新',
    'パフォーマンス改善',
    'セキュリティ対策の実装',
    'バグ修正',
    '新機能の企画',
    'コードレビュー',
    'デプロイ作業',
    'ライブラリのアップデート',
    'UI/UXの改善',
    '監視システムの構築'
  ]
  
  return titles[index % titles.length]
}
