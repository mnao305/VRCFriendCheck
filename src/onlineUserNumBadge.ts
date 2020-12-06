import { browser } from 'webextension-polyfill-ts'

export function setOnlineUserNumOverIcon (num: number): void {
  const text = num >= 100 ? '99+' : String(num)
  void browser.browserAction.setBadgeText({ text: text })
  void browser.browserAction.setBadgeBackgroundColor({ color: '#888' })
}
