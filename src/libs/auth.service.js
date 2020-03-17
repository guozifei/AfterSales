import Vue from 'vue'
import axios from 'axios'
import '../assets/lib/idm/idm.js'
export class AuthService {
  static idm;
  static init (config, options) {
    AuthService.idmAuth = new Idm(config) // window.Idm
    return new Promise((resolve, reject) => {
      AuthService.idmAuth.init(options)
        .success((res) => {
          resolve()
        })
        .error((errorData) => {
          reject(errorData)
        })
    })
  }
  authenticated () {
    return AuthService.idmAuth.authenticated
  }

  login () {
    AuthService.idmAuth.login()
  }

  logout () {
    AuthService.idmAuth.logout()
  }

  accountManagement () {
    AuthService.idmAuth.accountManagement()
  }

  /**
   * 获取用户信息
   */
  loadUserProfile () {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios.post('https://apishyun.gree.com/api/sso/autoapp-default-server-greeshinstall/api/core/auth!queryCurrentUser', {}, {
        // axios.post('http://gateway.flydiy.gree.com:7393/api/sso/autoapp-default-server-greeshmerge/api/core/auth!queryCurrentUser', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }).then((response) => {
          resolve(response.data.data)
        })
      })
    })
  }

  /**
   * 获取Token
   */
  getToken () {
    return new Promise((resolve, reject) => {
      if (AuthService.idmAuth.token) {
        AuthService.idmAuth
          .updateToken(5)
          .success(() => {
            resolve(AuthService.idmAuth.token)
          })
          .error(() => {
            reject(new Error('Failed to refresh token'))
          })
      } else {
        reject(new Error('Not login'))
      }
    })
  }
}

export const authService = new AuthService()
Plugin.install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    AuthService: {
      get () {
        return authService
      }
    }
  })
}

Vue.use(Plugin)
export default authService
