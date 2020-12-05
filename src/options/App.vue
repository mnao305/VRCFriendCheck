<template>
  <div>
    <h2 data-i18n-text="optionTitle"></h2>
    <div id="setting">
      <ul>
        <li>
          <span data-i18n-text="optionFavFriendOnly"></span>(β)：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="favFriendOnly" value="on">ON
          </label>
          <label>
            <input type="radio" v-model="favFriendOnly" value="off">OFF
          </label>
        </li>
        <li>
          <span data-i18n-text="optionOnlineUsersSort"></span>：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="onlineUsersSort" value="instance">
            <span data-i18n-text="optionOnlineUsersSort_instance"></span>
          </label>
          <label>
            <input type="radio" v-model="onlineUsersSort" value="name">
            <span data-i18n-text="optionOnlineUsersSort_name"></span>
          </label>
        </li>
        <li>
          <span data-i18n-text="optionNewOnlineUserNotification"></span>：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="NewOnlineUserNotification" value="on">ON
          </label>
          <label>
            <input type="radio" v-model="NewOnlineUserNotification" value="off">OFF
          </label>
        </li>
        <li>
          <span data-i18n-text="optionFavFriendOnlyNotification"></span>：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="favFriendOnlyNotification" value="on">ON
          </label>
          <label>
            <input type="radio" v-model="favFriendOnlyNotification" value="off">OFF
          </label>
        </li>
        <li>
          <span data-i18n-text="optionIsOnlineFriendBadgeDisplay"></span>：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="showNumberIcon" value="on">ON
          </label>
          <label>
            <input type="radio" v-model="showNumberIcon" value="off">OFF
          </label>
        </li>
        <li>
          <span data-i18n-text="optionFavFriendOnlyBadgeDisplay"></span>：<br>
          <label class="optionMarginLeft">
            <input type="radio" v-model="showNumberIconIsFavFriend" value="on">ON
          </label>
          <label>
            <input type="radio" v-model="showNumberIconIsFavFriend" value="off">OFF
          </label>
        </li>
      </ul>
      <button v-on:click="configSave" data-i18n-text="optionSaveButton"></button>
      <transition name="msg">
        <span id="savedMessage" v-show="savedMessage" data-i18n-text="optionSavedMessage"></span>
      </transition>
    </div>
  </div>
</template>

<script>
import Browser from 'webextension-polyfill'
export default {
  name: 'App',
  data () {
    return {
      favFriendOnly: '',
      onlineUsersSort: '',
      savedMessage: false,
      NewOnlineUserNotification: '',
      favFriendOnlyNotification: '',
      showNumberIcon: '',
      showNumberIconIsFavFriend: ''
    }
  },
  mounted () {
    this.defaultConfig()
  },
  methods: {
    async defaultConfig () {
      const data = await Browser.storage.local.get({
        favFriendOnly: 'off',
        onlineUsersSort: 'instance',
        NewOnlineUserNotification: 'on',
        favFriendOnlyNotification: 'off',
        showNumberIcon: 'on',
        showNumberIconIsFavFriend: 'off'
      })
      this.favFriendOnly = data.favFriendOnly
      this.onlineUsersSort = data.onlineUsersSort
      this.NewOnlineUserNotification = data.NewOnlineUserNotification
      this.favFriendOnlyNotification = data.favFriendOnlyNotification
      this.showNumberIcon = data.showNumberIcon
      this.showNumberIconIsFavFriend = data.showNumberIconIsFavFriend
      setTimeout(() => {
        this.localizeHtmlPage()
      }, 100)
    },
    configSave () {
      Browser.storage.local.set(
        {
          favFriendOnly: this.favFriendOnly,
          onlineUsersSort: this.onlineUsersSort,
          NewOnlineUserNotification: this.NewOnlineUserNotification,
          favFriendOnlyNotification: this.favFriendOnlyNotification,
          showNumberIcon: this.showNumberIcon,
          showNumberIconIsFavFriend: this.showNumberIconIsFavFriend
        }
      )
      this.savedMessage = true
      setTimeout(() => {
        this.savedMessage = false
      }, 1000)
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
    }
  }
}
</script>

<style lang="scss" scoped>
#setting {
  margin-left: 6px;

  ul {
    list-style: none;
    padding-left: 0;
  }

  #savedMessage {
    margin-left: 10px;
  }

  input[type="radio"] {
    margin: 5px;
  }

  // 保存時メッセージの動き
  .msg-enter-active,
  .msg-leave-active {
    transition: opacity 0.5s;
  }
  .msg-enter,
  .msg-leave-to {
    opacity: 0;
  }

  .optionMarginLeft {
    margin-left: 12px;
  }
}
</style>
