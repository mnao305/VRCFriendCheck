<template>
  <div class="onlineUser user">
    <img :src="onlineUser.currentAvatarThumbnailImageUrl" alt="icon">
    <p class="userInfo">
      <span :title="onlineUser.displayName">
        <font-awesome-icon class="icon" icon="user"/>
        {{ onlineUser.displayName }}
      </span>
      <br>
      <span :title="worldInfo.name">
        <font-awesome-icon class="icon" icon="map-marker-alt"/>
        {{ worldInfo.name }}
      </span>
      <br>
      <span :class="onlineUser.status" :title="onlineUser.statusDescription">
        <font-awesome-icon class="icon" icon="circle"/>
        {{onlineUser.statusDescription}}
      </span>
    </p>
    <div
      v-if="worldInfo.name != 'Private'"
      class="moreWorldInfo"
      v-on:click="changeFlag()"
    >
      <font-awesome-icon class="icon" icon="angle-down"/>
    </div>
    <div v-show="flag" class="worldInfo">
      <div class="instanceInfo">
        <img :src="worldInfo.thumbnailImageUrl" alt="worldThumbnail">
        <p v-if="worldInfo.name != 'Private'">
          <a :href="'vrchat://launch?id=' + onlineUser.location" target="_blank">Join!</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onlineUser: {
      type: Object
    },
    worldInfo: {
      type: Object
    }
  },
  data () {
    return {
      flag: false
    }
  },
  methods: {
    changeFlag () {
      this.flag = !this.flag
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

</style>
