export interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string | null
  gender: Gender
  address: Address
  occupation: string
  bio: string
  status: ProfileStatus
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export interface Address {
  zipCode: string
  prefecture: string
  city: string
  street: string
  building?: string
}

export type Gender = '男性' | '女性' | 'その他' | '未設定'
export type ProfileStatus = 'アクティブ' | '一時停止' | '無効' | '削除済み'

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string | null
  gender: Gender
  address: Address
  occupation: string
  bio: string
  status: ProfileStatus
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startItem: number
  endItem: number
}
