export interface User {
  id: string
  username: string
  displayName: string
  bio: string
  currentAvatarImageUrl: string
  currentAvatarThumbnailImageUrl: string
  fallbackAvatar: string
  userIcon: string
  last_platform: string
  tags: string[]
  developerType: 'none' | 'trusted' | 'internal' | 'moderator'
  status: 'active'|'join me' | 'ask me' | 'busy' | 'offline'
  statusDescription: string
  friendKey: string
  last_login: string
  isFriend: boolean
  location: string
}

export type UserList = User[]
