<template>
    <div id="main">
        <h3>online</h3>
        <div id="online">
            <div class="onlineUser user" v-for="onlineUser in onlineUsers">
                <img :src="onlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                <p class="userInfo">
                    <font-awesome-icon class="icon" icon="user" />{{ onlineUser.displayName }}<br>
                    <span v-if="onlineUser.location != 'private'"><font-awesome-icon class="icon" icon="globe" />{{ getWorld(onlineUser.location) }}</span>
                    <span v-else><font-awesome-icon class="icon" icon="globe" />Private</span>
                </p>
            </div>
        </div>
        <h3>offline</h3>
        <div id="offline">
            <div class="offlineUser user" v-for="offlineUser in offlineUsers">
                <img :src="offlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                <p class="userInfo"><font-awesome-icon class="icon" icon="user" />{{ offlineUser.displayName }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            onlineUsers: [],
            offlineUsers: [],
            worldName: "",
        };
    },
    mounted() {
        this.loginCheck();
    },
    methods: {
        loginCheck() {
            axios.get('/auth/user').then(() => {
                chrome.browserAction.setBadgeText({text: ``});
                console.log("login");
                this.getOnlineUsers();
                this.getOfflineUsers();
            }).catch(() => {
                // エラーになる(未ログイン時)ログインページに飛ばす
                chrome.browserAction.setBadgeText({text: `！`});
                chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
                router.push("/login");
                location.reload();
            })
        },
        getOnlineUsers() {
            axios.get("auth/user/friends", {
                params: {
                    n: 100,
                },
            }).then((frend) => {
                console.log(frend.data);
                this.onlineUsers = frend.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        getOfflineUsers() {
            axios.get("auth/user/friends", {
                params: {
                    offline: true,
                    n: 100,
                },
            }).then((frend) => {
                console.log(frend.data);
                this.offlineUsers = frend.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        getWorld(location) {
            let index = location.indexOf(":");
            let id = location.substring(0, index);
            axios.get(`/worlds/${id}`).then((world) => {
                this.worldName = world.data.name;
            });
            return this.worldName;
        },
    },
};
</script>

<style lang="scss" scoped>
#main {
    width: 250px;
    margin: 0;
    margin-left: 10px;

    .user {
        width: 100%;
        padding: 10px 0;
        border-bottom: solid 1px;
        height: 40px;
        clear: both;
        img {
            height: 40px;
            width: 53px;
            float: left;
        }
    }
    li {
        float: left;
    }
    .userInfo {
        float: left;
        margin: 0;
        margin-left: 5px;
        width: 160px;
        word-break: break-all;
        .icon {
            margin-right: 5px;
        }
    }
}
</style>
