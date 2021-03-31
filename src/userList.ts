import * as vrc from 'vrcapi-client'
import { LimitedUserObject } from 'vrcapi-client/types/User'
// import { UserList } from './types/UserList'

/**
 * オンラインフレンドリストの取得関数
 * 制限により100件ごとに取得する。それ以上のフレンド数の場合、再帰的に呼び出し取得する
 * @param {number} cnt - 読み込み数のカウント。初期呼び出し時は0をセット
 * @param {Array} onlineUsers - オンラインユーザリスト。再帰呼び出し時にセットする。
 * @return {Array} 取得できたオンラインフレンドのリスト
 */
export async function getOnlineFriends (cnt: number, onlineUsers: LimitedUserObject[] = []): Promise<LimitedUserObject[]> {
  if (cnt === 0) {
    onlineUsers = []
  }

  let friends: LimitedUserObject[]
  try {
    friends = await vrc.user.getFriends({
      n: 100,
      offset: cnt
    }
    )
  } catch (error) {
    console.log(error)
    return onlineUsers
  }

  onlineUsers.push(...friends)
  cnt += 100
  if (cnt === onlineUsers.length) {
    return await getOnlineFriends(cnt, onlineUsers)
  } else {
    return onlineUsers
  }
}

/**
 * お気に入りフレンドユーザリストの取得関数
 * @return {Object} 取得できたお気に入りフレンドのオブジェクト
 */
export async function getFavFriend (): Promise<{favOnlineUsers: LimitedUserObject[], favOfflineUsers: LimitedUserObject[]}> {
  const favOnlineUsers: LimitedUserObject[] = []
  const favOfflineUsers: LimitedUserObject[] = []
  let friends: LimitedUserObject[]
  try {
    friends = await vrc.user.getFavFriends()
  } catch (error) {
    console.log(error)
    return { favOnlineUsers, favOfflineUsers }
  }

  friends.forEach(element => {
    if (element.location !== 'offline') {
      favOnlineUsers.push(element)
    } else {
      favOfflineUsers.push(element)
    }
  })
  return { favOnlineUsers, favOfflineUsers }
}
