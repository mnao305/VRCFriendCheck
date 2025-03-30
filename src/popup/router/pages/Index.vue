<template>
  <div id="main">
    <div id="tabs">
      <input type="radio" v-model="switching" value="onlineTab" id="onlineTab">
      <label for="onlineTab">online {{ onlineUserNum }}</label>
      <input type="radio" v-model="switching" value="offlineTab" id="offlineTab">
      <label for="offlineTab">offline {{ offlineUserNum }}</label>
    </div>
    <div v-if="switching == ''">{{ msg }}</div>
    <div v-else>
      <div id="online" v-show="switching == 'onlineTab'">
        <template v-for="(onlineUser, i) in onlineUsers" >
          <online-user-item :key="onlineUser.id" :online-user="onlineUser" :world-info="worldInfos[i]"></online-user-item>
        </template>
        <div v-if="onlineUserNum == 0" class="zeroUser" data-i18n-text="zeroOnlineUser"></div>
      </div>
      <div id="offline" v-show="switching == 'offlineTab'">
        <template class="offlineUser user" v-for="offlineUser in offlineUsers" >
          <offline-user-item :key="offlineUser.id" :offline-user="offlineUser"></offline-user-item>
        </template>
        <div v-if="offlineUserNum == 0" class="zeroUser" data-i18n-text="zeroOfflineUser"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Browser from 'webextension-polyfill'
import { setOnlineUserNumOverIcon } from '../../../onlineUserNumBadge'
import OnlineUserItem from '../components/OnlineUserItem.vue'
import OfflineUserItem from '../components/OfflineUserItem.vue'
import * as vrc from 'vrcapi-client'

export default {
  data () {
    return {
      onlineUsers: [],
      offlineUsers: [],
      worldInfos: [],
      instancesInfos: [],
      switching: '',
      onlineUserNum: 0,
      offlineUserNum: 0,
      flag: [],
      msg: 'Loading...',
      favFriendOnly: false,
      instanceSort: false,
      showNumberIcon: true,
      showNumberIconIsFavFriend: false
    }
  },
  components: {
    'online-user-item': OnlineUserItem,
    'offline-user-item': OfflineUserItem
  },
  mounted () {
    this.loginCheck()
    this.localizeHtmlPage()
  },
  methods: {
    async loginCheck () {
      try {
        // const tmp = await vrc.system.config()
        // const apiKey = tmp.data.apiKey
        const data = await vrc.user.getCurrentUser()

        if (data.requiresTwoFactorAuth) {
          this.$router.push('/twoFactor')
          return
        }
      } catch (error) {
        // エラーになる(未ログイン時)ログインページに飛ばす
        Browser.action.setBadgeText({ text: '！' })
        Browser.action.setBadgeBackgroundColor({ color: '#F00' })
        this.$router.push('/login')
        location.reload()
        return
      }

      await this.setingLoad()

      const badge = await Browser.action.getBadgeText({})
      if (badge === '！') {
        Browser.action.setBadgeText({ text: '' })
      }

      if (!this.favFriendOnly) {
        const storage = await Browser.storage.local.get({ lastUpdate: null, lastOfflineUsersUpdate: null, onlineUsers: [], offlineUsers: [] })

        if (storage.lastOfflineUsersUpdate == null || ((Date.now() - storage.lastOfflineUsersUpdate) / 1000) >= 60) {
          this.getOfflineUsers(0)
        } else {
          this.offlineUsers.push(...storage.offlineUsers)
          this.offlineUserNum = this.offlineUsers.length
        }

        if (storage.lastUpdate == null || ((Date.now() - storage.lastUpdate) / 1000) >= 60) {
          this.getOnlineUsers(0)
        } else {
          this.onlineUsers.push(...storage.onlineUsers)
          this.onlineUserNum = this.onlineUsers.length

          if (this.showNumberIcon && !this.showNumberIconIsFavFriend) {
            setOnlineUserNumOverIcon(this.onlineUsers.length)
          }

          this.getWorldData()

          this.msg = 'Complete!'
          setTimeout(() => {
            this.switching = 'onlineTab'
            setTimeout(() => {
              this.localizeHtmlPage()
            }, 100)
          }, 1500)
        }
      } else {
        const storage = await Browser.storage.local.get({ favLastUpdate: null, favOnlineUsers: [], favOfflineUsers: [] })
        if (storage.favLastUpdate == null || ((Date.now() - storage.favLastUpdate) / 1000) >= 60) {
          this.getFavFriend()
        } else {
          this.onlineUsers.push(...storage.favOnlineUsers)
          this.onlineUserNum = this.onlineUsers.length
          this.offlineUsers.push(...storage.favOfflineUsers)
          this.offlineUserNum = this.offlineUsers.length

          if (this.showNumberIcon && this.showNumberIconIsFavFriend) {
            setOnlineUserNumOverIcon(this.onlineUsers.length)
          }

          this.getWorldData()

          this.msg = 'Complete!'
          setTimeout(() => {
            this.switching = 'onlineTab'
            setTimeout(() => {
              this.localizeHtmlPage()
            }, 100)
          }, 1500)
        }
      }
    },
    async getOnlineUsers (cnt) {
      let frend
      try {
        frend = await vrc.user.getFriends({ n: 100, offset: cnt })
      } catch (error) {
        console.log(error)
        this.msg = 'Error.'
      }

      this.onlineUsers.push(...frend)
      this.onlineUserNum = this.onlineUsers.length
      cnt += 100
      if (cnt === this.onlineUserNum) {
        this.getOnlineUsers(cnt)
      } else {
        this.getWorldData()
        Browser.storage.local.set(
          {
            onlineUsers: this.onlineUsers,
            lastUpdate: Date.now()
          }
        )
      }

      this.msg = 'Complete!'
      setTimeout(() => {
        this.switching = 'onlineTab'
        setTimeout(() => {
          this.localizeHtmlPage()
        }, 100)
      }, 1500)
    },
    async getOfflineUsers (cnt) {
      let frend
      try {
        frend = await vrc.user.getFriends({ offline: true, n: 100, offset: cnt })
      } catch (error) {
        console.log(error)
      }

      this.offlineUsers.push(...frend)
      this.offlineUserNum = this.offlineUsers.length
      cnt += 100
      if (cnt === this.offlineUserNum) {
        this.getOfflineUsers(cnt)
      } else {
        Browser.storage.local.set(
          {
            offlineUsers: this.offlineUsers,
            lastOfflineUsersUpdate: Date.now()
          }
        )
      }
    },
    async getFavFriend () {
      let frend
      try {
        frend = await vrc.user.getFavFriends()
      } catch (error) {
        console.log(error)
        this.msg = 'Error.'
      }
      frend.forEach(element => {
        if (element.location === 'offline') {
          this.offlineUsers.push(element)
        } else {
          this.onlineUsers.push(element)
        }
      })
      this.onlineUserNum = this.onlineUsers.length
      this.offlineUserNum = this.offlineUsers.length
      this.getWorldData()
      Browser.storage.local.set(
        {
          favOfflineUsers: this.offlineUsers,
          favOnlineUsers: this.onlineUsers,
          favLastUpdate: Date.now()
        }
      )

      this.msg = 'Complete!'
      setTimeout(() => {
        this.switching = 'onlineTab'
        setTimeout(() => {
          this.localizeHtmlPage()
        }, 100)
      }, 1500)
    },
    changeFlag (i) {
      this.localizeHtmlPage()
      if (this.flag[i]) {
        this.$set(this.flag, i, false)
      } else {
        this.$set(this.flag, i, true)
      }
    },
    async setingLoad () {
      const storage = await Browser.storage.local.get({
        favFriendOnly: 'off',
        onlineUsersSort: 'instance',
        showNumberIcon: 'on',
        showNumberIconIsFavFriend: 'off'
      })

      this.favFriendOnly = storage.favFriendOnly === 'on'
      this.instanceSort = storage.onlineUsersSort === 'instance'
      this.showNumberIcon = storage.showNumberIcon === 'on'
      this.showNumberIconIsFavFriend = storage.showNumberIconIsFavFriend === 'on'
    },
    localizeHtmlPage () {
      document.querySelectorAll('[data-i18n-text]').forEach(element => {
        const key = element.getAttribute('data-i18n-text')
        element.textContent = Browser.i18n.getMessage(key)
      })

      document.querySelectorAll('[data-i18n-value]').forEach(element => {
        const key = element.getAttribute('data-i18n-value')
        element.value = Browser.i18n.getMessage(key)
      })
    },
    onlineUsersSort () {
      this.onlineUsers.sort((a, b) => {
        return a.displayName.toLowerCase() < b.displayName.toLowerCase()
          ? -1
          : 1
      })
      if (this.instanceSort) {
        this.onlineUsers.sort((a, b) => {
          return a.location < b.location ? 1 : -1
        })
      }
    },
    async getWorldData () {
      this.onlineUsersSort()
      for (let i = 0; i < this.onlineUserNum; i++) {
        if (this.onlineUsers[i].location === 'private' || this.onlineUsers[i].location === 'offline') {
          this.$set(this.worldInfos, i, { name: 'Private' })
          this.$set(this.instancesInfos, i, 'Private')
        } else {
          // ワールド情報取得
          const worldLocation = this.onlineUsers[i].location
          const index = worldLocation.indexOf(':')
          const id = worldLocation.substring(0, index)
          try {
            const world = await vrc.world.getById(id)
            this.$set(this.worldInfos, i, world)
          } catch (error) {
            this.$set(this.worldInfos, i, { name: 'Fetch failed' })
            console.log(error)
          }

          // インスタンス詳細取得
          // インスタンス詳細取得APIが使用不能なため一時的に無効化
          // const instanceLocation = this.onlineUsers[i].location.replace(':', '/')
          // try {
          //   const tmp = await axios.get(`/worlds/${instanceLocation}`)
          //   const world = tmp.data
          //   this.$set(this.instancesInfos, i, world)
          // } catch (error) {
          //   this.$set(this.instancesInfos, i, 'err')
          //   console.log(error)
          // }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #fff;
  border-left: solid 1px #ececec;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
  box-shadow: inset 0 0 0 2px #fff;
}
#main {
  width: 400px;
  max-height: 580px;
  margin: 10px;
  overflow: scroll;
  font-size: 14px;

  #tabs {
    width: 100%;
    height: 40px;
    input {
      display: none;
    }
    label {
      height: 100%;
      width: calc(100% / 2);
      box-sizing: border-box;
      float: left;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px blue solid;
      background-color: #dce1e2;
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    input:checked + label {
      background-color: #d9f9ff;
      color: black;
    }
  }

  #online {
    overflow: hidden;
  }

  .zeroUser {
    margin-top: 10px;
  }
}
</style>
