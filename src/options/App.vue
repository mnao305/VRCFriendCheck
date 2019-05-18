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
      </ul>
      <button v-on:click="configSave" data-i18n-text="optionSaveButton"></button>
      <transition name="msg">
        <span id="savedMessage" v-show="savedMessage" data-i18n-text="optionSavedMessage"></span>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      favFriendOnly: '',
      onlineUsersSort: '',
      savedMessage: false,
      NewOnlineUserNotification: '',
      favFriendOnlyNotification: ''

    }
  },
  mounted () {
    this.defaultConfig()
  },
  methods: {
    defaultConfig () {
      chrome.storage.local.get(
        { favFriendOnly: 'off', onlineUsersSort: 'instance', NewOnlineUserNotification: 'on', favFriendOnlyNotification: 'off' },
        items => {
          this.favFriendOnly = items.favFriendOnly
          this.onlineUsersSort = items.onlineUsersSort
          this.NewOnlineUserNotification = items.NewOnlineUserNotification
          this.favFriendOnlyNotification = items.favFriendOnlyNotification
        }
      )
      setTimeout(() => {
        this.localizeHtmlPage()
      }, 100)
    },
    configSave () {
      chrome.storage.local.set(
        {
          favFriendOnly: this.favFriendOnly,
          onlineUsersSort: this.onlineUsersSort,
          NewOnlineUserNotification: this.NewOnlineUserNotification,
          favFriendOnlyNotification: this.favFriendOnlyNotification
        },
        () => {
          this.savedMessage = true
          setTimeout(() => {
            this.savedMessage = false
          }, 1000)
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
