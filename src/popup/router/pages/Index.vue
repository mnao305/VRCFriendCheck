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
        <div class="onlineUser user" v-for="(onlineUser, i) in onlineUsers" :key="onlineUser.id">
          <img :src="onlineUser.currentAvatarThumbnailImageUrl" alt="icon">
          <p class="userInfo">
            <span :title="onlineUser.displayName">
              <font-awesome-icon class="icon" icon="user"/>
              {{ onlineUser.displayName }}
            </span>
            <br>
            <span :title="worldInfos[i].name">
              <font-awesome-icon class="icon" icon="map-marker-alt"/>
              {{ worldInfos[i].name }}
            </span>
            <br>
            <span :class="onlineUser.status" :title="onlineUser.statusDescription">
              <font-awesome-icon class="icon" icon="circle"/>
              {{onlineUser.statusDescription}}
            </span>
          </p>
          <div
            v-if="worldInfos[i].name != 'Private'"
            class="moreWorldInfo"
            v-on:click="changeFlag(i)"
          >
            <font-awesome-icon class="icon" icon="angle-down"/>
          </div>
          <div v-show="flag[i]" class="worldInfo">
            <div class="instanceInfo">
              <img :src="worldInfos[i].thumbnailImageUrl" alt="worldThumbnail">
              <p v-if="worldInfos[i].name != 'Private'">
                <!-- <template v-if="instancesInfos[i] !== 'err'">
                  {{ instancesInfos[i].users.length }}/{{ worldInfos[i].capacity }}
                </template>
                <br> -->
                <a :href="'vrchat://launch?id=' + onlineUsers[i].location" target="_blank">Join!</a>
              </p>
            </div>
            <!-- <div class="instanceUser">
              <span v-if="instancesInfos[i] === 'err'" class="error">
                  Sory! Acquisition error
              </span>
              <template v-if="instancesInfos[i] !== 'err'">
                <div data-i18n-text="instanceNow"></div>
                <div v-for="user in instancesInfos[i].users" class="userInWorld" :key="user.id">
                  <font-awesome-icon class="icon" icon="user"/>
                  {{ user.displayName }}
                </div>
              </template>
            </div> -->
          </div>
        </div>
        <div v-if="onlineUserNum == 0" class="zeroUser" data-i18n-text="zeroOnlineUser"></div>
      </div>
      <div id="offline" v-show="switching == 'offlineTab'">
        <div class="offlineUser user" v-for="offlineUser in offlineUsers" :key="offlineUser.id">
          <img :src="offlineUser.currentAvatarThumbnailImageUrl" alt="icon">
          <p class="userInfo">
            <font-awesome-icon class="icon" icon="user"/>
            {{ offlineUser.displayName }}
          </p>
        </div>
        <div v-if="offlineUserNum == 0" class="zeroUser" data-i18n-text="zeroOfflineUser"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Browser from 'webextension-polyfill'
import { setOnlineUserNumOverIcon } from '../../../onlineUserNumBadge'
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
  mounted () {
    this.loginCheck()
    this.localizeHtmlPage()
  },
  methods: {
    async loginCheck () {
      try {
        // const tmp = await vrc.system.config()
        // const apiKey = tmp.data.apiKey
        const data = await vrc.user.getUserInfo()

        if (data.requiresTwoFactorAuth) {
          this.$router.push('/twoFactor')
          return
        }
      } catch (error) {
        // エラーになる(未ログイン時)ログインページに飛ばす
        Browser.browserAction.setBadgeText({ text: '！' })
        Browser.browserAction.setBadgeBackgroundColor({ color: '#F00' })
        this.$router.push('/login')
        location.reload()
        return
      }

      await this.setingLoad()

      const badge = await Browser.browserAction.getBadgeText({})
      if (badge === '！') {
        Browser.browserAction.setBadgeText({ text: '' })
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
            const world = await vrc.world.getWorld(id)
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

  .user {
    width: 100%;
    padding: 10px 0;
    border-bottom: solid 1px;
    min-height: 60px;
    clear: both;
    position: relative;
    word-break: break-all;
    img {
      height: 60px;
      float: left;
      margin-bottom: 5px;
    }
    .userInfo {
      float: left;
      margin: 0;
      margin-left: 5px;
      max-width: 260px;
      span {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        width: 250px;
        text-overflow: ellipsis;
      }
    }
    .icon {
      margin-right: 5px;
    }
    .moreWorldInfo {
      height: 60px;
      width: 40px;
      text-align: center;
      line-height: 60px;
      font-size: 16px;
      transition: 0.5s;
      -webkit-transition: 0.5s;
      position: absolute;
      right: 5px;
      cursor: pointer;
      .icon {
        margin: 0;
      }
    }
    .moreWorldInfo:hover {
      transform: scale(1.5);
    }
    .worldInfo {
      clear: both;
      padding-top: 5px;
      min-height: 100px;
      border-top: dashed 1px #bbb;
      .instanceInfo {
        position: absolute;
        p {
          text-align: center;
          word-break: normal;
        }
      }
      .instanceUser {
        position: relative;
        left: 84px;
        width: 300px;
        word-break: break-all;
      }
      .error {
        color: red;
      }
    }
    .join {
      color: blue;
    }
    .active {
      color: green;
    }
    .busy {
      color: red;
    }
  }

  .zeroUser {
    margin-top: 10px;
  }
}
</style>
