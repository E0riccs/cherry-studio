import { AxiosInstance, default as axios_ } from 'axios'

import { proxyManager } from './ProxyManager'

class AxiosProxy {
  private cacheAxios: AxiosInstance | undefined
  private proxyURL: string | undefined

  get axios(): AxiosInstance {
    // 动态获取代理配置，每次get axios时都会重新获取代理配置
    const currentProxyURL = proxyManager.getProxyUrl() // 单例模式的 proxyManager
    if (this.proxyURL !== currentProxyURL) {
      this.proxyURL = currentProxyURL
      const agent = proxyManager.getProxyAgent()
      this.cacheAxios = axios_.create({
        proxy: false,
        ...(agent && { httpAgent: agent, httpsAgent: agent })
      })
    }

    if (this.cacheAxios === undefined) {
      this.cacheAxios = axios_.create({ proxy: false })
    }
    return this.cacheAxios
  }
}

// 单例模式
export default new AxiosProxy()
