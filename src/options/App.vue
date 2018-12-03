<template>
    <div>
        <h2 data-i18n-text="optionTitle"></h2>
        <div id="setting">
            <ul>
                <li><span data-i18n-text="optionFavFriendOnly"></span>(β)：<label><input type="radio" v-model="favFriendOnly" value="on">ON</label><label><input type="radio" v-model="favFriendOnly" value="off">OFF</label></li>
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
            setTimeout(() => {
                this.localizeHtmlPage();
            }, 100);
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
        localizeHtmlPage() {
            document.querySelectorAll("[data-i18n-text]").forEach((element) => {
                const key = element.getAttribute("data-i18n-text");
                element.textContent = chrome.i18n.getMessage(key);
            });

            document.querySelectorAll("[data-i18n-value]").forEach((element) => {
                const key = element.getAttribute("data-i18n-value");
                element.value = chrome.i18n.getMessage(key);
            });
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
