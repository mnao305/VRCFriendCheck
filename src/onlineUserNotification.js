import axios from 'axios'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

let onlineUsers = []
let onlineUserNum = 0

export function getOnlineUsers (cnt) {
  if (cnt === 0) {
    onlineUsers = []
    onlineUserNum = 0
  }

  axios
    .get('auth/user/friends', {
      params: {
        n: 100,
        offset: cnt
      }
    })
    .then(frend => {
      onlineUsers.push(...frend.data)
      onlineUserNum = onlineUsers.length
      cnt += 100
      if (cnt === onlineUserNum) {
        getOnlineUsers(cnt)
      } else {
        newOnlineFriendCheck()

        chrome.storage.local.set(
          {
            onlineUsers: onlineUsers
          }
        )
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export function getFavFriend () {
  onlineUsers = []
  axios
    .get('auth/user/friends/favorite')
    .then(frend => {
      let tmpAry = frend.data
      tmpAry.forEach(element => {
        if (element.location !== 'offline') {
          onlineUsers.push(element)
        }
      })
      newOnlineFriendCheck()

      chrome.storage.local.set(
        {
          onlineUsers: onlineUsers
        }
      )
    })
    .catch(err => {
      console.log(err)
    })
}

function notification (nweOnlineUsers) {
  const len = nweOnlineUsers.length <= 10 ? nweOnlineUsers.length : 10

  let message = nweOnlineUsers[0]
  for (let i = 1; i < len; i++) {
    message += `, ${nweOnlineUsers[i]}${chrome.i18n.getMessage('nameSan')}`
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
  chrome.notifications.create('onlineUserNotification', options)
}

function newOnlineFriendCheck () {
  // 新しく取得したオンラインユーザの名前のみ抽出
  const newOnlineUsers = []
  for (let i = 0; i < onlineUsers.length; i++) {
    newOnlineUsers.push(onlineUsers[i].displayName)
  }

  // 前回取得したオンラインユーザの名前のみ取得
  chrome.storage.local.get(
    { onlineUsers: [] }, (items) => {
      const tmp = items.onlineUsers
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
        chrome.storage.local.get(
          { NewOnlineUserNotification: 'on' },
          items => {
            const NewOnlineUserNotification = items.NewOnlineUserNotification

            if (NewOnlineUserNotification === 'on') {
              notification(diff)
            }
          }
        )
      }
    }
  )
}
