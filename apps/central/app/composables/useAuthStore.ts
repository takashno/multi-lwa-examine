import type { User, LoginCredentials, AuthState, AppFeature } from '../types/auth'

// グローバル認証状態
const globalAuthState = ref<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null
})

// ダミーユーザーデータ
const dummyUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: '管理',
    lastName: '太郎',
    role: 'admin',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    firstName: '一般',
    lastName: '花子',
    role: 'user',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date().toISOString()
  }
]

// アプリケーション機能リスト
const getAppFeatures = (): AppFeature[] => {
  const config = useRuntimeConfig()
  
  return [
    {
      id: 'todo',
      name: 'TODO管理',
      description: 'タスクとTODOを効率的に管理できます',
      url: config.public.featureAUrl,
      icon: '📝',
      color: 'bg-blue-500',
      isActive: true,
      requiredRole: 'user'
    },
    {
      id: 'profile',
      name: 'プロフィール管理',
      description: '個人情報とプロフィールを管理できます',
      url: config.public.featureBUrl,
      icon: '👤',
      color: 'bg-green-500',
      isActive: true,
      requiredRole: 'user'
    }
  ]
}

export const useAuthStore = () => {
  // ローカルストレージから認証状態を復元
  if (process.client) {
    const savedAuth = localStorage.getItem('auth-state')
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth)
        globalAuthState.value = parsedAuth
      } catch (error) {
        console.error('Failed to parse saved auth state:', error)
      }
    }
  }

  // 認証状態を保存
  const saveAuthState = () => {
    if (process.client) {
      localStorage.setItem('auth-state', JSON.stringify(globalAuthState.value))
    }
  }

  // ログイン
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // ローディング効果

    // ダミー認証ロジック
    const user = dummyUsers.find(u => 
      u.username === credentials.username && 
      (credentials.password === 'password' || credentials.password === '123456')
    )

    if (!user) {
      return { success: false, error: 'ユーザー名またはパスワードが正しくありません' }
    }

    if (!user.isActive) {
      return { success: false, error: 'このアカウントは無効化されています' }
    }

    // 認証成功
    const updatedUser: User = {
      ...user,
      lastLoginAt: new Date().toISOString()
    }

    globalAuthState.value = {
      isAuthenticated: true,
      user: updatedUser,
      token: `token-${user.id}-${Date.now()}`
    }

    saveAuthState()
    return { success: true }
  }

  // ログアウト
  const logout = () => {
    globalAuthState.value = {
      isAuthenticated: false,
      user: null,
      token: null
    }
    
    if (process.client) {
      localStorage.removeItem('auth-state')
    }
  }

  // ユーザーがアクセス可能な機能を取得
  const getAccessibleFeatures = computed((): AppFeature[] => {
    if (!globalAuthState.value.isAuthenticated || !globalAuthState.value.user) {
      return []
    }

    const userRole = globalAuthState.value.user.role
    const appFeatures = getAppFeatures()
    
    return appFeatures.filter((feature: AppFeature) => {
      if (!feature.isActive) return false
      if (!feature.requiredRole) return true
      
      // ロール階層: admin > user > guest
      if (userRole === 'admin') return true
      if (userRole === 'user' && (feature.requiredRole === 'user' || feature.requiredRole === 'guest')) return true
      if (userRole === 'guest' && feature.requiredRole === 'guest') return true
      
      return false
    })
  })

  // 全機能リストを取得（管理者用）
  const getAllFeatures = (): AppFeature[] => {
    return getAppFeatures()
  }

  return {
    // State
    authState: readonly(globalAuthState),
    isAuthenticated: computed(() => globalAuthState.value.isAuthenticated),
    currentUser: computed(() => globalAuthState.value.user),
    
    // Computed
    accessibleFeatures: getAccessibleFeatures,
    
    // Actions
    login,
    logout,
    getAllFeatures
  }
}
