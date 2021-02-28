<template>
  <div id="twoFactorAuth">
    <h2>Two-Factor Authentication</h2>
    <div id="twoFactorForm">
      <label>numeric code:
        <br>
        <input @input="validate" @keyup.enter="twoFactorAuth" type="text" v-model="twoFACode" id="twoFACode" maxlength="6" pattern="[0-9]{6}">
        <br>
      </label>

      <button v-on:click="twoFactorAuth" id="loginBtn">Verify</button>
      <div v-if="verifyErr" class="loginErr error">
        <span>Error!</span>
        <br>
        <span>That code didn't work.</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as vrc from 'vrcapi-client'

export default {
  data () {
    return {
      twoFACode: '',
      verifyErr: false
    }
  },
  methods: {
    validate () {
      this.twoFACode = this.twoFACode.replace(/\D/g, '')
    },
    async twoFactorAuth () {
      const code = this.twoFACode
      try {
        const data = await vrc.user.verify(code)
        console.log(data)
        if (data.verified) {
          this.$router.push('/')
          return
        }
        throw data
      } catch (error) {
        console.error(error)
        this.verifyErr = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#twoFactorAuth {
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
