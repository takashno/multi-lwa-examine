import type { Profile, Gender, ProfileStatus, Address } from '../types/profile'

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

export const formatAddress = (address: Address): string => {
  const parts = [
    address.zipCode ? `〒${address.zipCode}` : '',
    address.prefecture,
    address.city,
    address.street,
    address.building
  ].filter(Boolean)
  
  return parts.join(' ')
}

export const createDummyProfiles = (): Profile[] => {
  const genders: Gender[] = ['男性', '女性', 'その他', '未設定']
  const statuses: ProfileStatus[] = ['アクティブ', '一時停止', '無効', '削除済み']
  const prefectures = [
    '東京都', '大阪府', '愛知県', '神奈川県', '埼玉県', '千葉県', '兵庫県', '北海道', '福岡県', '静岡県'
  ]
  const occupations = [
    'エンジニア', 'デザイナー', '営業', 'マーケター', 'コンサルタント', '教師', '医師', '弁護士', '公務員', '学生'
  ]
  
  const profiles: Profile[] = []
  
  for (let i = 1; i <= 25; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    const birthDate = Math.random() > 0.1 
      ? new Date(1970 + Math.random() * 40, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
      : null
    
    const firstName = getFirstName(i)
    const lastName = getLastName(i)
    const prefecture = prefectures[Math.floor(Math.random() * prefectures.length)]!
    const selectedGender = genders[Math.floor(Math.random() * genders.length)]!
    const selectedOccupation = occupations[Math.floor(Math.random() * occupations.length)]!
    const selectedStatus = statuses[Math.floor(Math.random() * statuses.length)]!
    
    profiles.push({
      id: generateId(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `0${Math.floor(Math.random() * 9) + 1}0-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      birthDate: birthDate || null,
      gender: selectedGender,
      address: {
        zipCode: `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        prefecture,
        city: `${prefecture.replace(/[都府県]$/, '')}市`,
        street: `${String(Math.floor(Math.random() * 9) + 1)}-${String(Math.floor(Math.random() * 20) + 1)}-${String(Math.floor(Math.random() * 20) + 1)}`,
        building: Math.random() > 0.6 ? `${getBuildingName(i)}${Math.floor(Math.random() * 10) + 1}F` : undefined
      },
      occupation: selectedOccupation,
      bio: `こんにちは、${firstName} ${lastName}です。${selectedOccupation}として働いています。よろしくお願いします。`,
      status: selectedStatus,
      createdAt,
      createdBy: 'システム管理者',
      updatedAt,
      updatedBy: 'システム管理者'
    })
  }
  
  return profiles
}

const getFirstName = (index: number): string => {
  const names = [
    '太郎', '次郎', '三郎', '花子', '美咲', '由美', '健太', '翔太', '美穂', '真理',
    '和也', '雄介', '恵美', '智子', '裕子', '直樹', '康介', '麻美', '香織', '明美',
    '俊介', '大輔', '洋子', '久美子', '典子'
  ]
  return names[index % names.length]!
}

const getLastName = (index: number): string => {
  const names = [
    '田中', '佐藤', '鈴木', '高橋', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
    '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '清水', '森',
    '池田', '橋本', '山崎', '石川', '斎藤'
  ]
  return names[index % names.length]!
}

const getBuildingName = (index: number): string => {
  const names = [
    'サンハイツ', 'グランメゾン', 'パークマンション', 'シティハウス', 'ロイヤル',
    'エクセル', 'プライム', 'ガーデン', 'ヒルズ', 'タワー'
  ]
  return names[index % names.length]!
}
