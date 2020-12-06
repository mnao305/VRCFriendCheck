import Browser from 'webextension-polyfill'

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

export async function newOnlineFriendCheck (onlineUsers) {
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
