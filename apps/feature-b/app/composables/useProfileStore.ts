import type { Profile, ProfileFormData, PaginationInfo } from '../types/profile'
import { createDummyProfiles, generateId, getCurrentDateTime } from '../utils/profile'

// グローバル状態として管理
const globalProfiles = ref<Profile[]>([])
const globalCurrentPage = ref(1)
const globalItemsPerPage = ref(10)

export const useProfileStore = () => {
  // 初期化を一度だけ実行
  if (globalProfiles.value.length === 0) {
    globalProfiles.value = createDummyProfiles()
  }

  // ダミーデータの初期化
  const initializeDummyData = () => {
    globalProfiles.value = createDummyProfiles()
  }

  // フィルタリング（削除済みを除外）
  const activeProfiles = computed(() => 
    globalProfiles.value.filter(profile => profile.status !== '削除済み')
  )

  // ページネーション情報
  const paginationInfo = computed((): PaginationInfo => {
    const totalItems = activeProfiles.value.length
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

  // 現在のページのProfile一覧
  const paginatedProfiles = computed(() => {
    const start = (globalCurrentPage.value - 1) * globalItemsPerPage.value
    const end = start + globalItemsPerPage.value
    return activeProfiles.value.slice(start, end)
  })

  // Profileの作成
  const createProfile = (formData: ProfileFormData, createdBy: string = 'システムユーザー') => {
    const now = getCurrentDateTime()
    const newProfile: Profile = {
      id: generateId(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      gender: formData.gender,
      address: formData.address,
      occupation: formData.occupation,
      bio: formData.bio,
      status: formData.status,
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy
    }
    globalProfiles.value.unshift(newProfile)
    return newProfile
  }

  // Profileの更新
  const updateProfile = (id: string, formData: ProfileFormData, updatedBy: string = 'システムユーザー') => {
    const index = globalProfiles.value.findIndex(profile => profile.id === id)
    if (index !== -1) {
      const existingProfile = globalProfiles.value[index]
      if (existingProfile) {
        const updatedProfile: Profile = {
          id: existingProfile.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          address: formData.address,
          occupation: formData.occupation,
          bio: formData.bio,
          status: formData.status,
          createdAt: existingProfile.createdAt,
          createdBy: existingProfile.createdBy,
          updatedAt: getCurrentDateTime(),
          updatedBy
        }
        globalProfiles.value[index] = updatedProfile
        return updatedProfile
      }
    }
    return null
  }

  // Profileの取得
  const getProfileById = (id: string): Profile | undefined => {
    return globalProfiles.value.find(profile => profile.id === id)
  }

  // Profileの削除（論理削除）
  const deleteProfile = (id: string, deletedBy: string = 'システムユーザー') => {
    const profile = getProfileById(id)
    if (profile) {
      updateProfile(id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        birthDate: profile.birthDate,
        gender: profile.gender,
        address: profile.address,
        occupation: profile.occupation,
        bio: profile.bio,
        status: '削除済み'
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
    profiles: readonly(globalProfiles),
    currentPage: readonly(globalCurrentPage),
    itemsPerPage: readonly(globalItemsPerPage),
    
    // Computed
    activeProfiles,
    paginatedProfiles,
    paginationInfo,
    
    // Actions
    createProfile,
    updateProfile,
    getProfileById,
    deleteProfile,
    setCurrentPage,
    initializeDummyData
  }
}
