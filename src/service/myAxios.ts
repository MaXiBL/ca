// 封装axios
import Axios from 'axios'
import qs from 'qs'
import { sequenceObject, tokenName } from 'common'

const axios = Axios.create({
  timeout: 5000,
  data: {},
  params: {},
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  transformRequest: [(data: any) => {
    if (!data) {
      data = {}
    }
    return qs.stringify(data)
  }]
})

// 声明一个数组用于存储每个ajax 请求标志, 重复请求时取消上一次请求
const pending: { [prop: string]: any } = {}
const CancelToken = Axios.CancelToken
const removePending = (ever: any) => {
  for (const p in pending) {
    if (pending.hasOwnProperty(p)) {
      // 把参数带上
      const url = `${ever.url}?${sequenceObject(ever.params)}&${sequenceObject(ever.data)}`
      if (p === `${url}&${ever.method}`) {
        pending[p]()
        delete pending[p]
      }
    }
  }
}

// 拦截请求,每次请求设置 header
axios.interceptors.request.use((config: any) => {
  if (!config.params) {
    config.params = {}
  }
  config.headers.Authorization = window.localStorage.getItem(tokenName) || ''
  // 在ajax 发送前,取消该接口的上一次请求
  removePending(config)
  config.cancelToken = new CancelToken((cancel: any) => {
    // 构造 ajax 请求标志
    const url = `${config.url}?${sequenceObject(config.params)}&${sequenceObject(config.data)}`
    pending[`${url}&${config.method}`] = cancel
  })
  return config
}, (error: Error) => {
  return Promise.reject(error)
})

// 拦截响应,如果请求错误则重新请求
const retry: number = 2
const retryDelay: number = 500

axios.interceptors.response.use((res: any) => {
  // 请求成功之后,把请求标志从pending 队列中删除
  removePending(res.config)
  return res
}, (err) => {
  if (err.message) {
    console.log('请求失败:', err)
  }
  const config = err.config
  if (!config) {
    return Promise.reject(err)
  }
  config.retryCount = config.retryCount || 0
  console.log(`第${config.retryCount + 1}次请求`)
  if (config.retryCount >= retry || err.message === 'Network Error') {
    return Promise.reject(err)
  }
  config.retryCount += 1
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, retryDelay)
  })

  // Return the promise in which recalls axios to retry the request
  return backoff.then(() => {
    config.data = qs.parse(config.data)
    return axios(config)
  })
})

export default axios
