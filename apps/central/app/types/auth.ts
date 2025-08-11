export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface AppFeature {
  id: string
  name: string
  description: string
  url: string
  icon: string
  color: string
  isActive: boolean
  requiredRole?: UserRole
}
