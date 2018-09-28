<template>
    <div id="main">
        <div id="tabs">
            <input type="radio" v-model="switching" value="onlineTab" id="onlineTab"><label for="onlineTab">online {{ onlineUserNum }}</label>
            <input type="radio" v-model="switching" value="offlineTab" id="offlineTab"><label for="offlineTab">offline {{ offlineUserNum }}</label>
        </div>
        <div id="online" v-show="switching == 'onlineTab'">
            <div class="onlineUser user" v-for="(onlineUser, i) in onlineUsers">
                <img :src="onlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                <p class="userInfo">
                    <font-awesome-icon class="icon" icon="user" />{{ onlineUser.displayName }}<br>
                    <span><font-awesome-icon class="icon" icon="globe" />{{ worldNames[i] }}</span>
                </p>
            </div>
            <div v-if="onlineUserNum == 0" class="zeroUser">There isn't anyone.</div>
        </div>
        <div id="offline" v-show="switching == 'offlineTab'">
            <div class="offlineUser user" v-for="offlineUser in offlineUsers">
                <img :src="offlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                <p class="userInfo"><font-awesome-icon class="icon" icon="user" />{{ offlineUser.displayName }}</p>
            </div>
            <div v-if="offlineUserNum == 0" class="zeroUser">There isn't anyone.</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            onlineUsers: [],
            offlineUsers: [],
            worldNames: [],
            switching: "onlineTab",
            onlineUserNum: 0,
            offlineUserNum: 0,
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
                this.getOnlineUsers(0);
                this.getOfflineUsers(0);
            }).catch(() => {
                // エラーになる(未ログイン時)ログインページに飛ばす
                chrome.browserAction.setBadgeText({text: `！`});
                chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
                router.push("/login");
                location.reload();
            })
        },
        getOnlineUsers(cnt) {
            axios.get("auth/user/friends", {
                params: {
                    n: 100,
                    offset: cnt,
                },
            }).then((frend) => {
                console.log(frend.data);
                Array.prototype.push.apply(this.onlineUsers, frend.data);
                this.onlineUserNum = this.onlineUsers.length;
                cnt += 100;
                if (cnt == this.onlineUserNum) {
                    this.getOnlineUsers(cnt);
                } else {
                    for (let i = 0; i < this.onlineUserNum; i++) {
                        if (this.onlineUsers[i].location == "private") {
                            this.worldNames[i] = "Private";
                        } else {
                            this.getWorld(i, this.onlineUsers[i].location);
                        }
                    }
                    console.log(this.worldNames);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        getOfflineUsers(cnt) {
            axios.get("auth/user/friends", {
                params: {
                    offline: true,
                    n: 100,
                    offset: cnt,
                },
            }).then((frend) => {
                console.log(frend.data);
                Array.prototype.push.apply(this.offlineUsers, frend.data);
                this.offlineUserNum = this.offlineUsers.length;
                cnt += 100;
                if (cnt == this.offlineUserNum) {
                    this.getOfflineUsers(cnt);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        getWorld(i, location) {
            let index = location.indexOf(":");
            let id = location.substring(0, index);
            axios.get(`/worlds/${id}`).then((world) => {
                this.worldNames[i] = world.data.name;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#main {
    width: 250px;
    margin: 0;

    #tabs {
        width: 100%;
        height: 40px;
        input {
            display: none;
        }
        label {
            height: 100%;
            width: 123px;
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

    .zeroUser {
        margin-top: 10px;
        font-size: 14px;
    }
}
</style>
