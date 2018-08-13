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
    chrome.browserAction.setBadgeText({text: ``});
    console.log("login");
}).catch(() => {
    // エラーになる(未ログイン時)ログインページに飛ばす
    chrome.browserAction.setBadgeText({text: `！`});
    chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
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
        $('#online').append(`<div class="user" id="${frend.data[i].id}"></div>`);
        $(`#${frend.data[i].id}`).append(`<img src="${frend.data[i].currentAvatarThumbnailImageUrl}">`);

        if (frend.data[i].location !== "private") {
            let world = frend.data[i].location;
            const index = world.indexOf(":");
            world = world.substring(0, index);
            axios.get(`/worlds/${world}`).then((world) => {
                $(`#${frend.data[i].id}`).append(`<p class="userInfo"><i class="fas fa-user"></i>${escapeHtml(frend.data[i].displayName)}<br><i class="fas fa-globe"></i>${escapeHtml(world.data.name)}</p>`);
            });
        } else {
            $(`#${frend.data[i].id}`).append(`<p class="userInfo"><i class="fas fa-user"></i>${escapeHtml(frend.data[i].displayName)}<br><i class="fas fa-globe"></i>Private</p>`);
        }
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
        $('#offline').append(`<div class="user" id="${frend.data[i].id}"></div>`);
        $(`#${frend.data[i].id}`).append(`<img src="${frend.data[i].currentAvatarThumbnailImageUrl}">`);
        $(`#${frend.data[i].id}`).append(`<p class="userInfo"><i class="fas fa-user"></i>${escapeHtml(frend.data[i].displayName)}</p>`);
    }
}).catch((err) => {
    console.log(err);
});


function escapeHtml(string) {
    if(typeof string !== 'string') {
        return string;
    }
    return string.replace(/[&'`"<>]/g, (match) => {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}
