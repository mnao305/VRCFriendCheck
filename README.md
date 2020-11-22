[English](README.md) | [日本語](README.ja.md)

# VRCFriendCheck

This is a browser extension that allows you to check your friend's online status on VRChat, and notify you when a friend is online.

## Features

- Online / offline confirmation of friends
- Notify me when my friend is online
- World where online friends exist, instance confirmation
- Review Friend Status and Status Messages
- ~~Confirmation of other users in the instance~~(This currently can not be used)
- Join to that instance
- Sort by name and instance ID order
- Function to display only Favorite Friends
- Show number of friends online over extension icon

## Requirement

- PC version Chrome browser or PC version Firefox browser

## Installation

### When using Chrome browser

Add this extension to Chrome from  [Chrome Web Store](https://chrome.google.com/webstore/detail/vrcfriendcheck/fkhfmlkfiaafmoaobaofhldnlgapekhl).

### When using Firefox browser

Add this extension to Firefox from [Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/vrcfriendcheck/).

### If you build by yourself

node version: 8

Build

```sh
npm i
npm run build:dev   # Developer build
npm run build       # Production build
npm run build-zip   # zip file output
```

Import into browser

---
When installation is complete, a light blue balloon icon will be displayed in the upper right corner of the browser.

## Usage

### Basic

1. Click the balloon icon displayed in the upper right corner of the browser.
2. The login form will be displayed. Log in with a VRChat account.
3. A list of friends is displayed. By default, all friends are listed in order of instance.
4. You can also change the order of options.
5. You can set options to show only your favorite friends.

### notification

1. The notification feature can also be turned off from the options..
2. You can also notify only your favorite friends from the options.

## Anything Else

You need to be logged in as a VRChat account to use this extension.  
When logging in, account information will not be sent or stored on servers other than this extension or VRChat official.

I am not responsible for any damage that occurs using this extension.

I use Google Translate for translation.

## About questions, requests, bug reports, etc

Please feel free to report any issues, requests, or questions from [Issues](https://github.com/mnao305/VRCFriendCheck/issues).

## Author

[mnao305](https://twitter.com/mnao_305)  
mail to: naomasa305@gmail.com

## License

[GNU GENERAL PUBLIC LICENSE](LICENSE)
