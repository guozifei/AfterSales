import { authService } from '@/libs/auth.service'
import Vue from 'vue'
import moment from 'moment'
import { checksum } from '../../plugin/ADPUtil'
// import { setToken, getToken } from '@/libs/util'
import { ADP_CALLER, ADP_SKEY, ADP_PWD } from '../../plugin/config'
export const USER_COOKIE_KEY = 'USER-KEY'
export const TOKEN_COOKIE_KEY = 'TOKEN-KEY'
export default {
  state: {
    userName: '未知',
    userId: '',
    avatarImgPath: '',
    hasGetInfo: false,
    token: null,
    access: ''
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    updateToken (state, newToken) {
      if (newToken) {
        state.token = newToken
      } else {
        state.token = null
      }
    },
    updataTokenCookie (state) {
      if (state.token) {
        Vue.ls.set(TOKEN_COOKIE_KEY, state.token, 60 * 60 * 1000 * 23)// 10天
      } else {
        Vue.ls.remove(TOKEN_COOKIE_KEY)
      }
    }
  },
  getters: {
    getUserID: state => state.userId,
    accessGet: state => state.access,
    token: (state) => state.token
  },
  actions: {
    adpLogin ({ state, commit }) {
      return new Promise((resolve, reject) => {
        const now = new Date().getTime()
        const _checksum = checksum(ADP_CALLER, now, ADP_SKEY)
        const headers = {
          'X-USERNAME': ADP_CALLER,
          'X-NOW': now,
          'X-CHECKSUM': _checksum
        }
        Vue.httpADP.post('/token/get', {
          password: ADP_PWD
        }, {
          headers
        }).then((response) => {
          const {
            success,
            token
          } = response.data
          if (success) {
            commit('updateToken', token, {
              root: true
            })
            commit('updataTokenCookie', {}, {
              root: true
            })
            resolve(token)
          } else {
            reject(response.data)
          }
        }).catch((error) => {
          console.error('出错了', error)
          reject(error)
        })
      })
    },
    loadToken ({ commit }) {
      const token = Vue.ls.get(TOKEN_COOKIE_KEY)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (token) {
            // 检查token是否过期
            const isVaild = moment().isBefore(moment(token.expireTime, 'YYYY-MM-DD HH:mm:ss'))
            if (isVaild) {
              commit('updateToken', token)
              commit('updataTokenCookie')
              resolve(token)
            } else { // eslint-disable-next-line
              reject()
            }
          } else { // eslint-disable-next-line
            reject()
          }
        })
      })
    },
    // idm登录
    idmLogin ({ commit }) {

    },
    // 退出登录
    handleLogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setAccess', [])
        commit('updateToken', null)
        commit('updataTokenCookie')
        commit('setHasGetRouter', false, { root: true })
        authService.logout()
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          authService.loadUserProfile().then(res => {
            const data = res
            if (!data.czrmc) {
              data.czrmc = '未知'
            }
            commit('setAvatar', 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3968417432,4100418615&fm=26&gp=0.jpg')
            commit('setUserName', data.realName)
            commit('setUserId', data.usid)
            commit('setAccess', ['admin'])
            commit('setHasGetInfo', true)
            // console.log(state)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
