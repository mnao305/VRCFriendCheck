import axios from 'axios'
import { getOnlineUsers, getFavFriend } from './onlineUserNotification'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

global.browser = require('webextension-polyfill')

var badge

chrome.alarms.create('check', { periodInMinutes: 20 })
chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.browserAction.getBadgeText({}, (res) => {
    badge = res
  })
  if (alarm.name === 'check' && badge !== '！') {
    axios
      .get('/auth/user')
      .then(() => {
        chrome.browserAction.setBadgeText({ text: `` })

        chrome.storage.local.get(
          { favFriendOnlyNotification: 'off' },
          items => {
            const favFriendOnlyNotification = items.favFriendOnlyNotification

            if (favFriendOnlyNotification === 'on') {
              getFavFriend()
            } else {
              getOnlineUsers(0)
            }
          }
        )
      })
      .catch(() => {
        chrome.browserAction.setBadgeText({ text: `！` })
        chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' })
      })
  }
})
