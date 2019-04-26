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

function notification () {
  const options = {
    iconUrl: 'icons/icon-128.png',
    type: 'basic',
    title: 'VRCFriendCheck',
    message: chrome.i18n.getMessage('newOnlineUserNotificationMessage')
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
      const diff = newOnlineUsers.concat(oldOnlineUsers).filter(item => !newOnlineUsers.includes(item) || !oldOnlineUsers.includes(item))
      const hoge = diff.concat(newOnlineUsers).filter((x, i, self) => self.indexOf(x) === i && i !== self.lastIndexOf(x))

      if (hoge.length > 0) {
        chrome.storage.local.get(
          { NewOnlineUserNotification: 'off' },
          items => {
            const NewOnlineUserNotification = items.NewOnlineUserNotification

            if (NewOnlineUserNotification === 'on') {
              notification()
            }
          }
        )
      }
    }
  )
}
