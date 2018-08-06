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

$('#loginBtn').on('click', () => {
    console.log("login");
    login($('#username').val(), $('#passwd').val());
})

function login(username, password) {
    axios.get("/config").then((config) => {
        const apiKey = config.data.clientApiKey;

        axios.get("/auth/user", {
            params: {
                apiKey,
            },
            auth: {
                username,
                password,
            },
        }).then((user) => {
            console.log(user.data);
            window.location.href = '../pages/popup.html';
        }).catch((err) => {
            console.log(err);
            $('.loginErr').css('display', 'block');
        });
    }).catch((err) => {
        console.log(err);
    });
}

$('#loginForm').submit(() => {
    return false;
});
