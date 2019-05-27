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
            <font-awesome-icon class="icon" icon="user"/>
            {{ onlineUser.displayName }}
            <br>
            <font-awesome-icon class="icon" icon="map-marker-alt"/>
            {{ worldInfos[i].name }}
            <br>
            <span :class="onlineUser.status">
              <font-awesome-icon class="icon" icon="circle"/>{{onlineUser.statusDescription}}
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
                <template v-if="instancesInfos[i] !== 'err'">
                  {{ instancesInfos[i].users.length }}/{{ worldInfos[i].capacity }}
                </template>
                <br>
                <a :href="'vrchat://launch?id=' + onlineUsers[i].location" target="_blank" v-if="instancesInfos[i] !== 'err'">Join!</a>
              </p>
            </div>
            <div class="instanceUser">
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
            </div>
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
import axios from 'axios'

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
      instanceSort: false
    }
  },
  mounted () {
    this.setingLoad()
    this.loginCheck()
    this.localizeHtmlPage()
  },
  methods: {
    loginCheck () {
      axios
        .get('/auth/user')
        .then(() => {
          chrome.browserAction.setBadgeText({ text: `` })
          console.log('login')
          if (!this.favFriendOnly) {
            this.getOnlineUsers(0)
            this.getOfflineUsers(0)
          } else {
            this.getFavFriend()
          }
        })
        .catch(() => {
          // エラーになる(未ログイン時)ログインページに飛ばす
          chrome.browserAction.setBadgeText({ text: `！` })
          chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' })
          this.$router.push('/login')
          location.reload()
        })
    },
    getOnlineUsers (cnt) {
      axios
        .get('auth/user/friends', {
          params: {
            n: 100,
            offset: cnt
          }
        })
        .then(frend => {
          this.onlineUsers.push(...frend.data)
          this.onlineUserNum = this.onlineUsers.length
          cnt += 100
          if (cnt === this.onlineUserNum) {
            this.getOnlineUsers(cnt)
          } else {
            this.onlineUsersSort()
            for (let i = 0; i < this.onlineUserNum; i++) {
              if (this.onlineUsers[i].location === 'private' || this.onlineUsers[i].location === 'offline') {
                this.$set(this.worldInfos, i, { name: 'Private' })
                this.$set(this.instancesInfos, i, 'Private')
              } else {
                this.getWorld(i, this.onlineUsers[i].location)
                this.getInstances(
                  i,
                  this.onlineUsers[i].location.replace(':', '/')
                )
              }
            }
            chrome.storage.local.set(
              {
                onlineUsers: this.onlineUsers,
                lastUpdate: Date.now()
              }
            )
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.msg = 'Complete!'
          setTimeout(() => {
            this.switching = 'onlineTab'
            setTimeout(() => {
              this.localizeHtmlPage()
            }, 100)
          }, 1500)
        })
    },
    getOfflineUsers (cnt) {
      axios
        .get('auth/user/friends', {
          params: {
            offline: true,
            n: 100,
            offset: cnt
          }
        })
        .then(frend => {
          this.offlineUsers.push(...frend.data)
          this.offlineUserNum = this.offlineUsers.length
          cnt += 100
          if (cnt === this.offlineUserNum) {
            this.getOfflineUsers(cnt)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFavFriend () {
      axios
        .get('auth/user/friends/favorite')
        .then(frend => {
          let tmpAry = frend.data
          tmpAry.forEach(element => {
            if (element.location === 'offline') {
              this.offlineUsers.push(element)
            } else {
              this.onlineUsers.push(element)
            }
          })
          this.onlineUserNum = this.onlineUsers.length
          this.offlineUserNum = this.offlineUsers.length
          for (let i = 0; i < this.onlineUserNum; i++) {
            if (this.onlineUsers[i].location === 'private' || this.onlineUsers[i].location === 'offline') {
              this.$set(this.worldInfos, i, { name: 'Private' })
              this.$set(this.instancesInfos, i, 'Private')
            } else {
              this.getWorld(i, this.onlineUsers[i].location)
              this.getInstances(
                i,
                this.onlineUsers[i].location.replace(':', '/')
              )
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.msg = 'Complete!'
          setTimeout(() => {
            this.switching = 'onlineTab'
            setTimeout(() => {
              this.localizeHtmlPage()
            }, 100)
          }, 1500)
        })
    },
    getWorld (i, location) {
      let index = location.indexOf(':')
      let id = location.substring(0, index)
      axios
        .get(`/worlds/${id}`)
        .then(world => {
          this.$set(this.worldInfos, i, world.data)
        })
        .catch(err => {
          this.$set(this.worldInfos, i, { name: 'Fetch failed' })
          console.log(err)
        })
    },
    getInstances (i, location) {
      axios.get(`/worlds/${location}`).then(world => {
        this.$set(this.instancesInfos, i, world.data)
      }).catch(err => {
        this.$set(this.instancesInfos, i, 'err')
        console.log(err)
      })
    },
    changeFlag (i) {
      this.localizeHtmlPage()
      if (this.flag[i]) {
        this.$set(this.flag, i, false)
      } else {
        this.$set(this.flag, i, true)
      }
    },
    setingLoad () {
      chrome.storage.local.get(
        {
          favFriendOnly: 'off',
          onlineUsersSort: 'instance'
        },
        items => {
          this.favFriendOnly = items.favFriendOnly === 'on'
          this.instanceSort = items.onlineUsersSort === 'instance'
        }
      )
    },
    localizeHtmlPage () {
      document.querySelectorAll('[data-i18n-text]').forEach(element => {
        const key = element.getAttribute('data-i18n-text')
        element.textContent = chrome.i18n.getMessage(key)
      })

      document.querySelectorAll('[data-i18n-value]').forEach(element => {
        const key = element.getAttribute('data-i18n-value')
        element.value = chrome.i18n.getMessage(key)
      })
    },
    onlineUsersSort () {
      console.log(this.instancesInfos)
      console.log(this.worldInfos)
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
      word-break: break-all;
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
