import layer from 'layer'
import app from 'app'

// 错误处理
const ErrorHandler = (res: any) => {
  // 判断是否请求错误
  if (res instanceof Error) {
    if (res.message === 'Network Error' || res.message === 'timeout of 5000ms exceeded') {
      layer.msg('请求失败, 请重试!')
    } else {
      layer.msg(res.message)
    }
  } else {
    if (!res || (!res.code && !res.data)) {
      return false
    }
    const code = res.code || res.data.code
    const message = res.message || res.data.message || res.data.data.message
    switch (Number(code)) {
      case 10000:
      case 10001:
        app.$router.push('/login')
        break
      default:
        layer.msg(message)
        break
    }
  }
}

// 日期格式化函数
function dateFormatter (value: string): string {
  if (!value) {
    return ''
  }
  const date: Date = new Date(value)
  const year: number = date.getFullYear()
  let month: number | string = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }

  let day: number | string = date.getDate()
  if (day < 10) {
    day = '0' + day
  }

  let hour: number | string = date.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }

  let minute: number | string = date.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  let second: number | string = date.getSeconds()
  if (second < 10) {
    second = '0' + second
  }
  // return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

// size 格式化
function sizeFormatter (fileSize: number) {
  if (typeof fileSize !== 'number' || fileSize < 0) {
    return '0M'
  } else if (fileSize < 1024 * 1024 * 500) {
    const size = Math.round(fileSize / (1014 * 1024) * 100) / 100
    return `${size}M`
  } else if (fileSize < 1024 * 1024 * 1024 * 600) {
    const size = Math.round(fileSize / (1014 * 1024 * 1024) * 100) / 100
    return `${size}G`
  } else {
    const size = Math.round(fileSize / (1014 * 1024 * 1024 * 1024) * 100) / 100
    return `${size}T`
  }
}

// 添加生成 guid 的函数
function createGuid (): string {
  let guid: string = ''
  for (let i = 1; i <= 32; i++) {
    const n: string = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
      guid += '-'
    }
  }
  return guid
}

// 对象序列号
function sequenceObject (obj: { [pro: string]: string }): string {
  if (!obj) {
    return ''
  }
  const arr = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      arr.push(`${key}=${obj[key]}`)
    }
  }
  return arr.sort().join('&')
}

// 获取二进制流图片
function getImage (imgUrl: string, defaultImgUrl: string, token: string, el: any, cb: any): void {
  const xhr: any = new XMLHttpRequest()
  let flag: boolean = false
  xhr.open('get', imgUrl, true)
  xhr.setRequestHeader('Authorization', token)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (this.status === 200) {
      if (this.response.type === 'text/xml' || this.response.type === '' || this.response.type === 'image/png' || this.response.type === 'image/jpeg' || this.response.type === 'image/jpg') {
        const blob = this.response
        const src = window.URL.createObjectURL(blob)
        el.onload = () => {
          window.URL.revokeObjectURL(src)
        }
        el.src = src
        flag = true
        if (cb) {
          cb(flag, el)
        }
      } else {
        el.src = defaultImgUrl
        flag = false
        if (cb) {
          cb(flag, el)
        }
      }
    } else {
      el.src = defaultImgUrl
      flag = false
      if (cb) {
        cb(flag, el)
      }
    }
  }
  xhr.onerror = (err: Error): void => {
    console.log('请求失败:', err)
    el.src = defaultImgUrl
    flag = false
    if (cb) {
      cb(flag, el)
    }
  }
  xhr.send()
}

// 获取二进制图片并转成base64
function getImageToBase64 (imgUrl: string, defaultImgUrl: string, token: string, el: any, cb: any): void {
  const xhr: any = new XMLHttpRequest()
  let flag: boolean = false
  xhr.open('get', imgUrl, true)
  xhr.setRequestHeader('Authorization', token)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (this.status === 200) {
      if (this.response.type === 'text/xml' || this.response.type === '' || this.response.type === 'image/png' || this.response.type === 'image/jpeg' || this.response.type === 'image/jpg') {
        const buffer = this.response.arrayBuffer()
        buffer.then((res: any) => {
          let binary = ''
          const bytes = new Uint8Array(res)
          const len = bytes.byteLength
          for (let i = 0; i < len; i += 1) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64String = `data:image/png;base64,${window.btoa(binary)}`
          el.src = base64String
          flag = true
          if (cb) {
            cb(flag, el)
          }
        }).catch(() => {
          el.src = defaultImgUrl
          flag = false
          if (cb) {
            cb(flag, el)
          }
        })
      } else {
        el.src = defaultImgUrl
        flag = false
        if (cb) {
          cb(flag, el)
        }
      }
    } else {
      el.src = defaultImgUrl
      flag = false
      if (cb) {
        cb(flag, el)
      }
    }
  }
  xhr.onerror = (err: Error): void => {
    console.log('请求失败:', err)
    el.src = defaultImgUrl
    flag = false
    if (cb) {
      cb(flag, el)
    }
  }
  xhr.send()
}

// 通用变量
const tokenName = 'cervixAdminToken'
const version = {
  number: require('../../../package.json').version,
  date: require('../../../package.json').date
}

export {
  ErrorHandler,
  dateFormatter,
  sizeFormatter,
  createGuid,
  sequenceObject,
  tokenName,
  getImage,
  getImageToBase64,
  version
}
