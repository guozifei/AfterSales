import _ from 'lodash'
import router from '../router'

import { ADP_SKEY } from './config'
import { checksum } from './ADPUtil'

/**
* 获取token的逻辑封装
* @param getters
* @param dispatch
* @returns {Promise<any>}
*/
function getToken ({ getters, dispatch }) {
  return new Promise((resolve, reject) => {
    let token = getters['token']
    if (!token) {
      dispatch('loadToken').then(_token => {
        resolve(_token)
      }).catch(() => {
        // 请求获取token
        dispatch('adpLogin').then(__token => {
          resolve(__token)
        }).catch(error => {
          // 请求获取token 失败
          reject(error)
        })
      })
    } else {
      setTimeout(() => {
        resolve(token)
      })
    }
  })
}

/**
* 计算api的header参数
* @param token
* @param config
*/
function makeHeaders (token, config) {
  const now = new Date().getTime()
  let _checksum = ''
  if (!_.isEmpty(config.data)) {
    // console.log('config.data:', config.data)
    _checksum = checksum(token.userInstance, now, JSON.stringify(config.data), ADP_SKEY)
    // _checksum = checksum(token.userInstance, now, config.data, ADP_SKEY)
  } else {
    _checksum = checksum(token.userInstance, now, ADP_SKEY)
  }

  const _headers = {
    'X-TOKEN': token.token,
    'X-USERNAME': token.userInstance,
    'X-NOW': now,
    'X-CHECKSUM': _checksum
  }

  // 合并到headers里
  _.assign(config.headers, _headers)
}

export default function install (Vue, _http) {
  if (install.installed) {
    return
  }
  install.installed = true

  _http.interceptors.request.use(function (config) {
    // 在发送请求之前显示loading
    _.debounce(() => {
    // iView.LoadingBar.start();
    }, 300)

    // 获取token的请求忽略
    if (_.endsWith(config.url, '/token/get')) {
      return config
    }

    const app = router.app
    const { getters, dispatch } = app.$options.store

    return new Promise((resolve, reject) => {
      getToken({ getters, dispatch }).then(token => {
        makeHeaders(token, config)
        // console.log('new config:', config.headerso);
        resolve(config)
      }).catch(error => {
        console.log(error)
        // iView.LoadingBar.error();
        reject(config)
      })
    })

    // return config;
  }, function (error) {
    // 对请求错误做些什么
    // iView.LoadingBar.error();
    return Promise.reject(error)
  })

  _http.interceptors.response.use(function (response) {
    const app = router.app
    const { commit } = app.$options.store

    // if (response.headers[REFRESH_TOKEN] === 'Yes') {
    //
    // console.log('刷新Token');
    // Vue.refreshToken();
    // }

    if (response.status === 401) {
      _.debounce(() => {
        app.$warning('登录过期')
        // iView.LoadingBar.error();
      }, 300)

      commit('userCenter/removeUserInfo')
      return Promise.reject(response)
    }

    if (response.status === 499) {
      const { error, message, 'error-details': details } = response.data
      app.$error(!error ? error : '', message)
      console.error('错误信息:', details)
      // iView.LoadingBar.error();
      return Promise.reject(response)
    }
    return response
  }, (_error) => {
    const app = router.app

    app.$error(_error)
    return Promise.reject(_error)
  })
}
