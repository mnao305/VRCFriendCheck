<template>
  <div class="offlineUser user">
    <img :src="offlineUser.currentAvatarThumbnailImageUrl" alt="icon">
    <p class="userInfo">
      <font-awesome-icon class="icon" icon="user"/>
      {{ offlineUser.displayName }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    offlineUser: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
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
}
</style>
