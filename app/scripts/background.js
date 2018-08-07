const axiosBase = require("axios");

const axios = axiosBase.create({
    baseURL: "https://api.vrchat.cloud/api/1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

chrome.alarms.create('check', {periodInMinutes: 5});
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "check") {
        axios.get('/auth/user').then(() => {
            chrome.browserAction.setBadgeText({text: ``});
        }).catch(() => {
            chrome.browserAction.setBadgeText({text: `✓`});
            chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
        });
    }
});
