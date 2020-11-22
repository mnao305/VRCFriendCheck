import axios from 'axios'
import Browser from 'webextension-polyfill'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

let onlineUsers = []
let onlineUserNum = 0

export function setOnlineUserNumOverIcon (num) {
  const text = num >= 100 ? '99+' : String(num)
  Browser.browserAction.setBadgeText({ text: text })
  Browser.browserAction.setBadgeBackgroundColor({ color: '#888' })
}

export async function getOnlineUsers (cnt) {
  if (cnt === 0) {
    onlineUsers = []
    onlineUserNum = 0
  }

  let frend
  try {
    const tmp = await axios.get('auth/user/friends', {
      params: {
        n: 100,
        offset: cnt
      }
    })
    frend = tmp.data
  } catch (error) {
    console.log(error)
    return
  }

  onlineUsers.push(...frend)
  onlineUserNum = onlineUsers.length
  cnt += 100
  if (cnt === onlineUserNum) {
    getOnlineUsers(cnt)
  } else {
    newOnlineFriendCheck()
    setOnlineUserNumOverIcon(onlineUsers.length)

    Browser.storage.local.set(
      {
        onlineUsers: onlineUsers,
        lastUpdate: Date.now()
      }
    )
  }
}

export async function getFavFriend () {
  onlineUsers = []
  let frend
  try {
    const tmp = await axios.get('auth/user/friends/favorite')
    frend = tmp.data
  } catch (error) {
    console.log(error)
    return
  }

  const favOfflineUsers = []
  frend.forEach(element => {
    if (element.location !== 'offline') {
      onlineUsers.push(element)
    } else {
      favOfflineUsers.push(element)
    }
  })
  newOnlineFriendCheck()
  setOnlineUserNumOverIcon(onlineUsers.length)

  Browser.storage.local.set(
    {
      favOfflineUsers: favOfflineUsers,
      favOnlineUsers: onlineUsers,
      favLastUpdate: Date.now()
    }
  )
}

function notification (nweOnlineUsers) {
  const len = nweOnlineUsers.length <= 10 ? nweOnlineUsers.length : 10

  let message = nweOnlineUsers[0]
  for (let i = 1; i < len; i++) {
    message += `, ${nweOnlineUsers[i]}${Browser.i18n.getMessage('nameSan')}`
  }
  if (nweOnlineUsers.length > 10) {
    message += `, Another ${nweOnlineUsers.length - 10} users.`
  }
  const options = {
    iconUrl: 'icons/icon-128.png',
    type: 'basic',
    title: 'New online users',
    message: message
  }
  Browser.notifications.create('onlineUserNotification', options)
}

async function newOnlineFriendCheck () {
  // 新しく取得したオンラインユーザの名前のみ抽出
  const newOnlineUsers = []
  for (let i = 0; i < onlineUsers.length; i++) {
    newOnlineUsers.push(onlineUsers[i].displayName)
  }

  // 前回取得したオンラインユーザの名前のみ取得
  const data = await Browser.storage.local.get({ onlineUsers: [], favOnlineUsers: [], favFriendOnlyNotification: 'off' })

  const tmp = data.favFriendOnlyNotification === 'off' ? data.onlineUsers : data.favOnlineUsers

  const oldOnlineUsers = []
  for (let i = 0; i < tmp.length; i++) {
    oldOnlineUsers.push(tmp[i].displayName)
  }

  // ２つを比較してnewOnlineUsersにいる人のみを抽出
  const diff = []
  for (let i = 0; i < newOnlineUsers.length; i++) {
    if (oldOnlineUsers.indexOf(newOnlineUsers[i]) === -1) {
      diff.push(newOnlineUsers[i])
    }
  }

  if (diff.length > 0) {
    const { NewOnlineUserNotification } = await Browser.storage.local.get({ NewOnlineUserNotification: 'on' })
    if (NewOnlineUserNotification === 'on') {
      notification(diff)
    }
  }
}
