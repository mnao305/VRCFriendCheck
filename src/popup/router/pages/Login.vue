<template>
  <div id="main">
    <h2>Login to your Account</h2>
    <p data-i18n-text="loginMsg"></p>
    <div id="loginForm">
      <label>UserName/EMAIL:
        <br>
        <input @keyup.enter="login" type="text" v-model="username" id="username">
        <br>
      </label>
      <label>Password:
        <br>
        <input @keyup.enter="login" type="password" v-model="passwd" id="passwd">
        <br>
      </label>
      <button v-on:click="login" id="loginBtn">Login!</button>
      <div v-if="loginErr" class="loginErr error">
        <span data-i18n-text="loginErrTitle"></span>
        <br>
        <span data-i18n-text="loginErrMsg"></span>
      </div>
      <div v-if="unknownErr" class="unknownErr error">
        <span data-i18n-text="unknownErrTitle">Error!</span>
        <br>
        <span data-i18n-text="unknownErrMsg">Unknown error</span>
      </div>
    </div>
  </div>
</template>

<script>
import Browser from 'webextension-polyfill'
import * as vrc from 'vrcapi-client'

export default {
  data () {
    return {
      username: '',
      passwd: '',
      loginErr: false,
      unknownErr: false
    }
  },
  mounted () {
    this.localizeHtmlPage()
  },
  methods: {
    async login () {
      // let apiKey
      // try {
      //   const tmp = await vrc.system.config()
      //   apiKey = tmp.apiKey
      // } catch (error) {
      //   this.unknownErr = true
      //   console.log(error)
      //   return
      // }

      try {
        await vrc.user.login(this.username, this.passwd)
        this.$router.push('/')
        location.reload()
      } catch (error) {
        console.log(error)
        const { status } = error.response
        if (status === 401) {
          this.loginErr = true
          setTimeout(() => {
            this.localizeHtmlPage()
          }, 100)
        } else {
          this.unknownErr = true
        }
      }
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
#main {
  width: 400px;
  margin: 10px;
  font-size: 14px;
  input {
    margin-bottom: 10px;
  }
  .error {
    color: red;
    margin-top: 8px;
  }
}
</style>
