import Browser from 'webextension-polyfill'
import * as vrc from 'vrcapi-client'
import { newOnlineFriendCheck } from './onlineUserNotification'
import { getOnlineFriends, getFavFriend } from './userList'
import { setOnlineUserNumOverIcon } from './onlineUserNumBadge'

Browser.alarms.create('check', { periodInMinutes: 5 })
Browser.alarms.onAlarm.addListener(async (alarm) => {
  const badge = await Browser.action.getBadgeText({})

  if (alarm.name === 'check' && badge !== '！') {
    try {
      const {
        favFriendOnlyNotification,
        showNumberIconIsFavFriend,
        NewOnlineUserNotification,
        showNumberIcon
      } = await Browser.storage.local.get({
        favFriendOnlyNotification: 'off',
        showNumberIconIsFavFriend: 'off',
        NewOnlineUserNotification: 'on',
        showNumberIcon: 'on'
      })

      // 通知もバッジ表示もOFFだったら取得などはしない
      if (NewOnlineUserNotification === 'off' && showNumberIcon === 'off') {
        return
      }

      await vrc.user.getCurrentUser()

      Browser.action.setBadgeText({ text: '' })

      // リスト取得
      let favUsers, onlineFriends
      if (
        favFriendOnlyNotification === 'on' ||
        showNumberIconIsFavFriend === 'on'
      ) {
        favUsers = await getFavFriend()
      }
      if (
        favFriendOnlyNotification === 'off' ||
        showNumberIconIsFavFriend === 'off'
      ) {
        onlineFriends = await getOnlineFriends()
      }

      // 通知
      if (favFriendOnlyNotification === 'on') {
        newOnlineFriendCheck(favUsers.favOnlineUsers)
      } else {
        newOnlineFriendCheck(onlineFriends)
      }
      // バッジ表示
      if (showNumberIcon === 'on') {
        if (showNumberIconIsFavFriend === 'on') {
          setOnlineUserNumOverIcon(favUsers.favOnlineUsers.length)
        } else {
          setOnlineUserNumOverIcon(onlineFriends.length)
        }
      }

      // リスト保存
      if (
        favFriendOnlyNotification === 'on' ||
        showNumberIconIsFavFriend === 'on'
      ) {
        Browser.storage.local.set(
          {
            favOfflineUsers: favUsers.favOfflineUsers,
            favOnlineUsers: favUsers.favOnlineUsers,
            favLastUpdate: Date.now()
          }
        )
      }
      if (
        favFriendOnlyNotification === 'off' ||
        showNumberIconIsFavFriend === 'off'
      ) {
        Browser.storage.local.set(
          {
            onlineUsers: onlineFriends,
            lastUpdate: Date.now()
          }
        )
      }
    } catch (error) {
      console.error(error)
      Browser.action.setBadgeText({ text: '！' })
      Browser.action.setBadgeBackgroundColor({ color: '#F00' })
    }
  }
})
