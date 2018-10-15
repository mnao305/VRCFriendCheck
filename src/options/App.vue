<template>
    <div>
        <h2>設定</h2>
        <div id="setting">
            <ul>
                <li>お気に入りフレンドのみ表示する(β版)：<label><input type="radio" v-model="favFriendOnly" value="on">オン</label><label><input type="radio" v-model="favFriendOnly" value="off">オフ</label></li>
            </ul>
            <button v-on:click="configSave">保存</button>
            <transition name="msg">
                <span id="savedMessage" v-if="savedMessage">保存しました</span>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            favFriendOnly: "",
            savedMessage: false,
        };
    },
    mounted() {
        this.defaultConfig();
    },
    methods: {
        defaultConfig() {
            chrome.storage.sync.get({
                favFriendOnly: "off",
            }, ((items) => {
                this.favFriendOnly = items.favFriendOnly;
            }));
        },
        configSave() {
            chrome.storage.sync.set({
                favFriendOnly: this.favFriendOnly,
            }, (() => {
                this.savedMessage = true;
                setTimeout(() => {
                    this.savedMessage = false;
                }, 1000);
            }));
        },
    },
};

</script>

<style lang="scss" scoped>
#setting {
    margin-left: 15px;

    ul {
        list-style: none;
        padding-left: 0;
    }

    #savedMessage {
        margin-left: 10px;
    }

    input[type=radio] {
        margin: 5px;
    }

    // 保存時メッセージの動き
    .msg-enter-active, .msg-leave-active {
        transition: opacity 0.5s;
    }
    .msg-enter, .msg-leave-to{
        opacity: 0;
    }
}
</style>
