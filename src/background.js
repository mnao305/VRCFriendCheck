import axios from 'axios';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = 'https://api.vrchat.cloud/api/1';
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json';

var badge;

chrome.alarms.create('check', {periodInMinutes: 25});
chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.browserAction.getBadgeText({}, (res) => {badge = res;});
    if (alarm.name === "check" && badge !== "！") {
        axios.get('/auth/user').then(() => {
            chrome.browserAction.setBadgeText({text: ``});
        }).catch(() => {
            chrome.browserAction.setBadgeText({text: `！`});
            chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
        });
    }
});
