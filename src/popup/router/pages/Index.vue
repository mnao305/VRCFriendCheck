<template>
    <div id="main">
        <div id="tabs">
            <input type="radio" v-model="switching" value="onlineTab" id="onlineTab"><label for="onlineTab">online {{ onlineUserNum }}</label>
            <input type="radio" v-model="switching" value="offlineTab" id="offlineTab"><label for="offlineTab">offline {{ offlineUserNum }}</label>
        </div>
        <div v-if="switching == ''">
            {{ msg }}
        </div>
        <div v-else>
            <div id="online" v-show="switching == 'onlineTab'">
                <div class="onlineUser user" v-for="(onlineUser, i) in onlineUsers">
                    <img :src="onlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                    <p class="userInfo">
                        <font-awesome-icon class="icon" icon="user" />{{ onlineUser.displayName }}<br>
                        <font-awesome-icon class="icon" icon="globe" />{{ worldInfos[i].name }}
                    </p>
                    <div class="moreWorldInfo" v-on:click="changeFlag(i)">
                        <font-awesome-icon class="icon" icon="angle-down" />
                    </div>
                    <div v-show="flag == i" class="worldInfo">
                        <img :src="worldInfos[i].thumbnailImageUrl" alt="worldThumbnail">
                        <div>このインスタンスにいる人</div>
                        <div v-for="user in instancesInfos[i].users" class="userInWorld">
                            <font-awesome-icon class="icon" icon="user" />{{ user.displayName }}
                        </div>
                    </div>
                </div>
                <div v-if="onlineUserNum == 0" class="zeroUser">オンラインユーザーはいません</div>
            </div>
            <div id="offline" v-show="switching == 'offlineTab'">
                <div class="offlineUser user" v-for="offlineUser in offlineUsers">
                    <img :src="offlineUser.currentAvatarThumbnailImageUrl" alt="icon">
                    <p class="userInfo"><font-awesome-icon class="icon" icon="user" />{{ offlineUser.displayName }}</p>
                </div>
                <div v-if="offlineUserNum == 0" class="zeroUser">オフラインユーザーいません</div>
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
            worldInfos: [],
            instancesInfos: [],
            switching: "",
            onlineUserNum: 0,
            offlineUserNum: 0,
            flag: null,
            msg: "Loading...",
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
            });
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
                            this.worldInfos[i] = "Private";
                            this.instancesInfos[i] = "Private";
                        } else {
                            this.getWorld(i, this.onlineUsers[i].location);
                            this.getInstances(i, this.onlineUsers[i].location.replace(":", "/"));
                        }
                    }
                    console.log(this.worldInfos);
                    console.log(this.instancesInfos);
                }
            }).catch((err) => {
                console.log(err);
            }).then(() => {
                console.log("読み込み完了！");
                this.msg = "読み込み完了！";
                setTimeout(() => {
                    this.switching = "onlineTab";
                }, 1500);
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
                this.worldInfos[i] = world.data;
            });
        },
        getInstances(i, location) {
            axios.get(`/worlds/${location}`).then((world) => {
                this.instancesInfos[i] = world.data;
                console.log(world.data);
            });
        },
        changeFlag(i) {
            console.log(i);
            if (this.flag == i) {
                this.flag = null;
            } else {
                this.flag = i;
            }
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
        min-height: 40px;
        clear: both;
        img {
            height: 40px;
            width: 53px;
            float: left;
            margin-bottom: 5px;
        }
        .userInfo {
            float: left;
            margin: 0;
            margin-left: 5px;
            width: 160px;
            word-break: break-all;
        }
        .icon {
            margin-right: 5px;
        }
        .moreWorldInfo {
            height: 40px;
            float: left;
            width: 30px;
            text-align: center;
            line-height: 40px;
            font-size: 16px;
            transition: 0.5s;
            -webkit-transition: 0.5s;
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
            min-height: 40px;
            border-top: dashed 1px #bbb;
            div {
                margin-left: 58px;
            }
        }
    }

    .zeroUser {
        margin-top: 10px;
    }
}
</style>
