
let baseUrl = 'https://adp.gree.com:8082/zaw/auth/'

// 设置了 Base_url 为优先
if (process.env.ADP_BASE_URL && process.env.ADP_BASE_URL !== 'undefined') {
  baseUrl = process.env.ADP_BASE_URL
}

/**
* HTTP实例
* @param Vue
* @param axios
* @returns {*}
*/
export default function install (Vue, axios) {
  if (install.installed) {
    return
  }
  install.installed = true

  if (!axios) {
    console.error('You have to install axios')
    return
  }

  // 从这里可以定义多个实例
  // 实例1
  let _http1 = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
    validateStatus: function (status) {
      // 499 也算是业务失败
      return (status >= 200 && status < 300) || status === 499 || status === 401 || status === 500
    }
  })

  // Vue.loading = false;
  Vue.httpADP = _http1

  Object.defineProperties(Vue.prototype, {
    $httpADP: {
      get () {
        return _http1
      }
    }
  })
}
