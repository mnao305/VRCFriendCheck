<template>
    <div id="main">
        <h3>Login to your Account</h3>
        <p data-i18n-text="loginMsg"></p>
        <div id="loginForm">
            <label>
                UserName/EMAIL:<br>
                <input @keyup.enter="login" type="text" v-model="username" id="username"><br>
            </label>
            <label>
                Password:<br>
                <input @keyup.enter="login" type="password" v-model="passwd" id="passwd"><br>
            </label>
            <button v-on:click="login" id="loginBtn">Login!</button>
            <div v-if="loginErr" class="loginErr"><span data-i18n-text="loginErrTitle"></span><br><span data-i18n-text="loginErrMsg"></span></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            passwd: "",
            loginErr: false,
        };
    },
    mounted() {
        this.localizeHtmlPage();
    },
    methods: {
        login() {
            axios.get("/config").then((config) => {
                const apiKey = config.data.clientApiKey;

                axios.get("/auth/user", {
                    params: {
                        apiKey,
                    },
                    auth: {
                        username: this.username,
                        password: this.passwd,
                    },
                }).then((user) => {
                    console.log(user.data);
                    router.push("/");
                    location.reload();
                }).catch((err) => {
                    console.log(err);
                    this.loginErr = true;
                    setTimeout(() => {
                        this.localizeHtmlPage();
                    }, 100);
                });
            }).catch((err) => {
                this.loginErr = true;
                console.log(err);
            });
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
#main {
    width: 270px;
    margin: 10px;
    input {
        margin-bottom: 10px;
    }
    .loginErr {
        color: red;
        margin-top: 8px;
    }
}
</style>
