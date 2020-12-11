import Browser from 'webextension-polyfill'
import { newOnlineFriendCheck } from './onlineUserNotification'
import { VRC_API } from './api'
import { getOnlineFriends, getFavFriend } from './userList'
import { setOnlineUserNumOverIcon } from './onlineUserNumBadge'

Browser.alarms.create('check', { periodInMinutes: 5 })
Browser.alarms.onAlarm.addListener(async (alarm) => {
  const badge = await Browser.browserAction.getBadgeText({})

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

      await VRC_API.get('/auth/user')

      Browser.browserAction.setBadgeText({ text: '' })

      // リスト取得
      let favOnlineUsers, onlineFriends
      if (
        favFriendOnlyNotification === 'on' ||
        showNumberIconIsFavFriend === 'on'
      ) {
        const tmp = await getFavFriend()
        favOnlineUsers = tmp.favOnlineUsers
        Browser.storage.local.set(
          {
            favOfflineUsers: tmp.favOfflineUsers,
            favOnlineUsers: favOnlineUsers,
            favLastUpdate: Date.now()
          }
        )
      }
      if (
        favFriendOnlyNotification === 'off' ||
        showNumberIconIsFavFriend === 'off'
      ) {
        onlineFriends = await getOnlineFriends()
        Browser.storage.local.set(
          {
            onlineUsers: onlineFriends,
            lastUpdate: Date.now()
          }
        )
      }

      // 通知
      if (favFriendOnlyNotification === 'on') {
        newOnlineFriendCheck(favOnlineUsers)
      } else {
        newOnlineFriendCheck(onlineFriends)
      }
      // バッジ表示
      if (showNumberIcon === 'on') {
        if (showNumberIconIsFavFriend === 'on') {
          setOnlineUserNumOverIcon(favOnlineUsers.length)
        } else {
          setOnlineUserNumOverIcon(onlineFriends.length)
        }
      }
    } catch (error) {
      console.error(error)
      Browser.browserAction.setBadgeText({ text: '！' })
      Browser.browserAction.setBadgeBackgroundColor({ color: '#F00' })
    }
  }
})
