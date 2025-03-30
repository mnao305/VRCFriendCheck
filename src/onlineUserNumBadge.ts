import { browser } from 'webextension-polyfill-ts'

export function setOnlineUserNumOverIcon (num: number): void {
  const text = num >= 100 ? '99+' : String(num)
  void browser.action.setBadgeText({ text: text })
  void browser.action.setBadgeBackgroundColor({ color: '#888' })
}
