import Vue from 'vue'
import { authService } from '@/libs/auth.service'
import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  // 处理动态路由的方法引入一下
  backendMenusToRouters,
  dealRouter
  // getUserMenuByRouter
} from '@/libs/util'
import router from '@/router'
import routers from '@/router/routers'
// import { getRouterReq } from '@/api/routers'
// import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    // menuRspList: [],
    menuUrl: [],
    routers: [], // 拿到的路由数据
    hasGetRouter: false, // 是否已经拿过路由数据
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state) => getMenuByRouter(routers.concat(state.routers)),
    errorCount: state => state.errorList.length,
    setRouters (state, routers) {
      state.routers = routers
    }
  },
  mutations: {
    // 设置路由数据
    setRouters (state, routers) {
      state.routers = routers
    },
    // 设置是否已经拿过路由
    setHasGetRouter (state, status) {
      state.hasGetRouter = status
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    cleanMenuUrl (state, data) {
      state.menuUrl = []
      Vue.ls.remove('url')
    },
    setMenuUrl (state, data) {
      state.menuUrl.push({
        name: data.name,
        url: data.url
      })
    },
    setUrlCookie (state) {
      Vue.ls.set('url', state.menuUrl)
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    /**
     * 获取系统路由
     * @param commit
     * @returns {Promise<unknown>}
     */
    getRouters ({ state, commit, rootState }) {
      return new Promise((resolve, reject) => {
        try {
          Vue.httpADP.post(`https://adp.gree.com:8082/zaw/bi_manager/manager/usernavigation`, {
            sys_gid: '009',
            parent_id: '888-009',
            user_code: rootState.user.userId }).then((res) => {
            commit('cleanMenuUrl')
            let it = dealRouter(res.data.data)
            let routers = backendMenusToRouters(it)
            for (let i of res.data.data) {
              for (let j of i.children[0]) {
                commit('setMenuUrl', j)
              }
            }
            commit('setRouters', routers)
            commit('setHasGetRouter', true)
            commit('setUrlCookie')
            resolve(routers)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    getNowUrl () {
      return new Promise((resolve, reject) => {
        let data = Vue.ls.get('url')
        let url
        for (let i of data) {
          if (i.name === router.currentRoute.name) {
            url = i.url
          }
        }
        resolve(url)
      })
    },
    dealMenuData ({ commit, rootState }) {
      if (rootState.user.userName) {
        return new Promise((resolve, reject) => {
          Vue.httpADP.post(`https://adp.gree.com:8082/zaw/bi_manager/manager/usernavigation`, {
            sys_gid: '025',
            parent_id: '888-025',
            username: rootState.user.userId }).then((response) => {
            const { success } = response.data
            if (success) {
              commit('cleanMenuUrl')
              let menudata = response.data.data
              let menuList = []
              for (let i of menudata) {
                let it = () => {
                  let tree = []
                  for (let j of i.children[0]) {
                    commit('setMenuUrl', j)
                    tree.push({
                      name: j.routerName,
                      meta: {
                        icon: j.iconCls,
                        title: j.name
                      }
                    })
                  }
                  return tree
                }
                menuList.push({
                  name: i.routerName,
                  meta: {
                    icon: i.iconCls,
                    title: i.name
                  },
                  children: it()
                })
              }
              commit('setUrlCookie')
              commit('setMenuRspList', menuList)
            } else {
              const { message } = response.data
              reject(message)
            }
          }).catch((error) => {
            console.log('error:', error)
            reject(error)
          })
        })
      } else {
        authService.logout()// 登出
      }
    }
  }
}
