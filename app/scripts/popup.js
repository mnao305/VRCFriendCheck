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

// ログイン状態の確認
axios.get('/auth/user').then(() => {
    console.log("login");
}).catch(() => {
    // エラーになる(未ログイン時)ログインページに飛ばす
    console.log("未ログイン。ログインページに移動します");
    window.location.href = '../pages/login.html';
})

// オンラインユーザの取得
axios.get("auth/user/friends", {
    params: {
        n: 25,
    },
}).then((frend) => {
    console.log(frend.data);
    for (let i = 0; i < frend.data.length; i++) {
        console.log(frend.data[i].displayName);
        $('#online').append(`<div><img src="${frend.data[i].currentAvatarThumbnailImageUrl}"><li>${frend.data[i].displayName}</li></div>`);
    }
}).catch((err) => {
    console.log(err);
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
        $('#offline').append(`<div><img src="${frend.data[i].currentAvatarThumbnailImageUrl}"><li>${frend.data[i].displayName}</li></div>`);
    }
}).catch((err) => {
    console.log(err);
});
