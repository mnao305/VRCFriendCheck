const axiosBase = require("axios");
const $ = require("jquery");

const axios = axiosBase.create({
    baseURL: "https://api.vrchat.cloud/api/1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

const online = document.getElementById("online");
const offline = document.getElementById("offline");


// オンラインユーザの取得
axios.get("auth/user/friends", {
    params: {
        n: 25,
    },
}).then((frend) => {
    console.log(frend.data);
    for (let i = 0; i < frend.data.length; i++) {
        console.log(frend.data[i].displayName);
        $(online).append(`<div><img src="${frend.data[i].currentAvatarThumbnailImageUrl}"><li>${frend.data[i].displayName}</li></div>`);
    }
}).catch((err) => {
    console.log(err);
    login();
});

// オフラインユーザの取得
axios.get("auth/user/friends", {
    params: {
        offline: true,
        n: 25,
        offset: 0,
    },
}).then((frend) => {
    console.log(frend.data);
    for (let i = 0; i < frend.data.length; i++) {
        console.log(frend.data[i].displayName);
        $(offline).append(`<div><img src="${frend.data[i].currentAvatarThumbnailImageUrl}"><li>${frend.data[i].displayName}</li></div>`);
    }
}).catch((err) => {
    console.log(err);
    login();
});

function login() {
    axios.get("/config").then((config) => {
        const apiKey = config.data.clientApiKey;

        axios.get("/auth/user", {
            params: {
                apiKey,
            },
            auth: {
                username: "", // ログイン画面実装するまでの仮対応
                password: "",
            },
        }).then((user) => {
            console.log(user.data);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}
