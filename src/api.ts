import axios from 'axios'

/**
 * VRChat APIを叩くときに使用するAxiosインスタンス
 */
export const VRC_API = axios.create({
  baseURL: 'https://api.vrchat.cloud/api/1',
  withCredentials: true,
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  }
})
