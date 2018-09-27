<template>
    <div id="main">
        <h3>Login to your Account</h3>
        <p>VRChatアカウントでログインしてください</p>
        <form id="loginForm">
            <label>
                UserName/EMAIL:<br>
                <input type="text" v-model="username" id="username"><br>
            </label>
            <label>
                Password:<br>
                <input type="password" v-model="passwd" id="passwd"><br>
            </label>
            <button v-on:click="login" id="loginBtn">Login!</button>
            <div v-if="loginErr" class="loginErr">ログイン失敗<br>ユーザ名またはパスワードが不正です</div>
        </form>
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
                });
            }).catch((err) => {
                this.loginErr = true;
                console.log(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
#main {
    width: 250px;
    input {
        margin-bottom: 10px;
    }
    .loginErr {
        color: red;
        margin-top: 8px;
    }
}
</style>
