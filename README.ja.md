[English](README.md) | [日本語](README.ja.md)

# VRCFriendCheck

VRChatでのフレンドのオンライ状況の確認、フレンドがオンラインになった際の通知等ができるブラウザ拡張機能です。

## 機能

- フレンドのオンライン・オフライン確認
- フレンドがオンラインになった際に通知
- オンラインフレンドの居るワールド、インスタンス確認
- フレンドのステータスとステータスメッセージの確認
- ~~そのインスタンスに居る他のユーザの確認~~(現在使用できません)
- そのインスタンスへのジョイン
- 名前順、インスタンスID順でのソート機能
- お気に入りフレンドのみ表示する機能
- 現在のオンラインフレンド数を拡張機能アイコン上にバッジ表示

## 必要要件

- PC版Chromeブラウザ、もしくはPC版Firefoxブラウザ

## インストール

### Chromeブラウザを使う場合

[Chromeウェブストア](https://chrome.google.com/webstore/detail/vrcfriendcheck/fkhfmlkfiaafmoaobaofhldnlgapekhl)からこの拡張機能をChromeに追加してください。

### Firefoxブラウザを使う場合

[Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/vrcfriendcheck/)からこの拡張機能をFirefoxに追加してください。

### 自分でビルドする場合

node version: 8

ビルドする

```sh
npm i
npm run build:dev   # 開発者ビルド
npm run build       # プロダクションビルド
npm run build-zip   # zipファイル化
```

ブラウザにインポートする。

---
インストールが完了すればブラウザ右上に水色の吹き出しアイコンが表示されます。

## 使い方

### 基本

1. ブラウザの右上に表示されている吹き出しアイコンをクリックします。
2. ログインフォームが表示されるのでVRChatアカウントでログインします。
3. フレンド一覧が表示されます。デフォルトでは全フレンドがインスタンス順に並んでいます。
4. オプションから名前順に変更することもできます。
5. オプションからお気に入りフレンドのみを表示するように設定できます。

### 通知

1. 通知機能はオプションからオフにすることもできます。
2. オプションからお気に入りフレンドのみを通知することもできます。

## その他

この拡張機能を使うにはVRChatアカウントでログインする必要があります。  
ログインする際、アカウント情報はこの拡張機能やVRChat公式以外のサーバには送信・保存されません。

この拡張機能を利用して発生したいかなる損害も当方は一切の責任を負いかねます。

## 質問・要望・バグ報告などについて

問題の報告や要望、質問などはお気軽に[Issues](https://github.com/mnao305/VRCFriendCheck/issues)からどうぞ。

## 作者

[mnao305](https://twitter.com/mnao_305)  
mail to: naomasa305@gmail.com

## ライセンス

[GNU GENERAL PUBLIC LICENSE](LICENSE)
