import axios from 'axios'
import { getOnlineUsers, getFavFriend } from './onlineUserNotification'
import Browser from 'webextension-polyfill'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

Browser.alarms.create('check', { periodInMinutes: 5 })
Browser.alarms.onAlarm.addListener(async (alarm) => {
  const badge = await Browser.browserAction.getBadgeText({})

  if (alarm.name === 'check' && badge !== '！') {
    try {
      await axios.get('/auth/user')

      Browser.browserAction.setBadgeText({ text: `` })

      const { favFriendOnlyNotification } = await Browser.storage.local.get({ favFriendOnlyNotification: 'off' })

      if (favFriendOnlyNotification === 'on') {
        getFavFriend()
      } else {
        getOnlineUsers(0)
      }
    } catch (error) {
      Browser.browserAction.setBadgeText({ text: '！' })
      Browser.browserAction.setBadgeBackgroundColor({ color: '#F00' })
    }
  }
})
