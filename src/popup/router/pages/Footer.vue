<template>
  <div id="footer">{{mode}} / ©mnao305(@mnao_305)</div>
</template>

<script>
import Browser from 'webextension-polyfill'
export default {
  data () {
    return {
      mode: 'normalMode'
    }
  },
  mounted () {
    this.checkMode()
  },
  methods: {
    async checkMode () {
      const { favFriendOnly } = await Browser.storage.local.get({ favFriendOnly: 'off' })
      this.mode = favFriendOnly === 'on' ? 'favoriteOnlyMode' : 'normalMode'
    }
  }
}
</script>

<style lang="scss" scoped>
#footer {
  height: 20px;
  background-color: #eee;
  text-align: center;
  border-top: 1px solid;
  position: sticky;
  bottom: 0;
}
</style>
