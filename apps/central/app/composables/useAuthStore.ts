import type { User, LoginCredentials, AuthState, AppFeature } from '../types/auth'
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js'

// グローバル認証状態
const globalAuthState = ref<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null
})

// Cognito設定を取得
const getCognitoConfig = () => {
  const config = useRuntimeConfig()
  return {
    UserPoolId: config.public.cognitoUserPoolId,
    ClientId: config.public.cognitoClientId,
    region: config.public.cognitoRegion
  }
}

// CognitoUserPoolインスタンスを作成
const getUserPool = () => {
  const config = getCognitoConfig()
  return new CognitoUserPool({
    UserPoolId: config.UserPoolId,
    ClientId: config.ClientId
  })
}

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
  // Cognitoセッションから認証状態を復元
  const restoreAuthFromCognito = () => {
    if (!process.client) return

    try {
      const userPool = getUserPool()
      const cognitoUser = userPool.getCurrentUser()

      if (cognitoUser) {
        cognitoUser.getSession((err: any, session: CognitoUserSession) => {
          if (err) {
            console.error('Session restore error:', err)
            return
          }

          if (session && session.isValid()) {
            // 有効なセッションが見つかった場合、ユーザー情報を取得
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                console.error('Error getting user attributes:', err)
                return
              }

              const userAttributes: Record<string, string> = {}
              attributes?.forEach(attr => {
                userAttributes[attr.getName()] = attr.getValue()
              })

              const user: User = {
                id: userAttributes.sub || cognitoUser.getUsername(),
                username: cognitoUser.getUsername(),
                email: userAttributes.email || '',
                firstName: userAttributes.given_name || '',
                lastName: userAttributes.family_name || '',
                role: (userAttributes['custom:role'] as User['role']) || 'user',
                isActive: true,
                lastLoginAt: new Date().toISOString(),
                createdAt: userAttributes.created_at || new Date().toISOString()
              }

              globalAuthState.value = {
                isAuthenticated: true,
                user,
                token: session.getIdToken().getJwtToken()
              }

              saveAuthState()
            })
          }
        })
      }
    } catch (error) {
      console.error('Failed to restore auth from Cognito:', error)
    }
  }

  // ローカルストレージから認証状態を復元（フォールバック）
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
    
    // Cognitoセッションもチェック
    restoreAuthFromCognito()
  }

  // 認証状態を保存
  const saveAuthState = () => {
    if (process.client) {
      localStorage.setItem('auth-state', JSON.stringify(globalAuthState.value))
    }
  }

  // ログイン
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const userPool = getUserPool()
      
      const cognitoUser = new CognitoUser({
        Username: credentials.username,
        Pool: userPool
      })

      const authenticationDetails = new AuthenticationDetails({
        Username: credentials.username,
        Password: credentials.password
      })

      return new Promise((resolve) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: async (session: CognitoUserSession) => {
            // JWTトークンを取得
            const idToken = session.getIdToken().getJwtToken()
            const accessToken = session.getAccessToken().getJwtToken()
            
            // ユーザー属性を取得
            cognitoUser.getUserAttributes((err, attributes) => {
              if (err) {
                console.error('Error getting user attributes:', err)
                resolve({ success: false, error: 'ユーザー情報の取得に失敗しました' })
                return
              }

              // attributesからユーザー情報を構築
              const userAttributes: Record<string, string> = {}
              attributes?.forEach(attr => {
                userAttributes[attr.getName()] = attr.getValue()
              })

              const user: User = {
                id: userAttributes.sub || credentials.username,
                username: credentials.username,
                email: userAttributes.email || '',
                firstName: userAttributes.given_name || '',
                lastName: userAttributes.family_name || '',
                role: (userAttributes['custom:role'] as User['role']) || 'user', // カスタム属性でロールを管理
                isActive: true,
                lastLoginAt: new Date().toISOString(),
                createdAt: userAttributes.created_at || new Date().toISOString()
              }

              globalAuthState.value = {
                isAuthenticated: true,
                user,
                token: idToken
              }

              saveAuthState()
              resolve({ success: true })
            })
          },
          onFailure: (err) => {
            console.error('Login failed:', err)
            let errorMessage = 'ログインに失敗しました'
            
            if (err.code === 'NotAuthorizedException') {
              errorMessage = 'ユーザー名またはパスワードが正しくありません'
            } else if (err.code === 'UserNotConfirmedException') {
              errorMessage = 'アカウントが確認されていません'
            } else if (err.code === 'PasswordResetRequiredException') {
              errorMessage = 'パスワードのリセットが必要です'
            } else if (err.code === 'UserNotFoundException') {
              errorMessage = 'ユーザーが見つかりません'
            } else if (err.code === 'TooManyRequestsException') {
              errorMessage = 'リクエストが多すぎます。しばらく待ってから再試行してください'
            }
            
            resolve({ success: false, error: errorMessage })
          },
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            // 一時パスワードの場合、同じパスワードで確定する
            // 必須属性のみを設定（requiredAttributesを使用）
            const updatedAttributes: Record<string, any> = {}
            
            // 必須属性があればそれらのみ設定
            if (requiredAttributes && requiredAttributes.length > 0) {
              requiredAttributes.forEach((attr: string) => {
                if (attr === 'name' && !userAttributes[attr]) {
                  updatedAttributes[attr] = userAttributes.email || credentials.username
                } else if (attr === 'email' && !userAttributes[attr]) {
                  updatedAttributes[attr] = credentials.username
                } else if (userAttributes[attr]) {
                  updatedAttributes[attr] = userAttributes[attr]
                }
              })
            } else {
              // 必須属性がない場合は、nameとemailのみ設定
              if (!userAttributes.name) {
                updatedAttributes.name = userAttributes.email || credentials.username
              }
              if (!userAttributes.email) {
                updatedAttributes.email = credentials.username
              }
            }
            
            cognitoUser.completeNewPasswordChallenge(credentials.password, updatedAttributes, {
              onSuccess: (session: CognitoUserSession) => {
                // JWTトークンを取得
                const idToken = session.getIdToken().getJwtToken()
                
                // ユーザー属性を取得
                cognitoUser.getUserAttributes((err, attributes) => {
                  if (err) {
                    console.error('Error getting user attributes:', err)
                    resolve({ success: false, error: 'ユーザー情報の取得に失敗しました' })
                    return
                  }

                  // attributesからユーザー情報を構築
                  const userAttrs: Record<string, string> = {}
                  attributes?.forEach(attr => {
                    userAttrs[attr.getName()] = attr.getValue()
                  })

                  const user: User = {
                    id: userAttrs.sub || credentials.username,
                    username: credentials.username,
                    email: userAttrs.email || '',
                    firstName: userAttrs.given_name || '',
                    lastName: userAttrs.family_name || '',
                    role: (userAttrs['custom:role'] as User['role']) || 'user',
                    isActive: true,
                    lastLoginAt: new Date().toISOString(),
                    createdAt: userAttrs.created_at || new Date().toISOString()
                  }

                  globalAuthState.value = {
                    isAuthenticated: true,
                    user,
                    token: idToken
                  }

                  saveAuthState()
                  resolve({ success: true })
                })
              },
              onFailure: (err) => {
                console.error('New password challenge failed:', err)
                resolve({ success: false, error: 'パスワード設定に失敗しました' })
              }
            })
          }
        })
      })
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'ログイン処理中にエラーが発生しました' }
    }
  }

  // ログアウト
  const logout = () => {
    try {
      const userPool = getUserPool()
      const cognitoUser = userPool.getCurrentUser()
      
      if (cognitoUser) {
        cognitoUser.signOut()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }

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
