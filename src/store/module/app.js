import Vue from 'vue'
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
  localRead
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
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
    menuRspList: [],
    menuUrl: [],
    hasInfo: false,
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters) => getMenuByRouter(state.menuRspList),
    errorCount: state => state.errorList.length,
    getUrl: (rootState) => {
      alert()
      let data = Vue.ls.get('url')
      let url
      console.log(router.currentRoute.name)
      for (let i of data) {
        if (i.name === router.currentRoute.name) {
          url = i.url
        }
      }
      return (url)
    }
  },
  mutations: {
    setMenuRspList (state, list) {
      state.menuRspList = []
      let len = list.length
      for (let i = 0; i < len; i++) {
        state.menuRspList.push(list[i])
      }
      state.hasInfo = true
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
        name: data.routerName,
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
    getMenuData ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        Vue.httpADP.post(`https://adp.gree.com:8082/zaw/bi_manager/manager/navigation`, { username: rootState.user.userId }).then((response) => {
          const { success } = response.data
          if (success) {
            const { data } = response.data
            resolve(data)
          } else {
            const { message } = response.data
            reject(message)
          }
        }).catch((error) => {
          console.log('error:', error)
          reject(error)
        })
      })
    },
    dealMenuData ({ state, commit, rootState }) {
      if (rootState.user.userId) {
        return new Promise((resolve, reject) => {
          Vue.httpADP.post(`https://adp.gree.com:8082/zaw/bi_manager/manager/navigation`, { username: rootState.user.userId }).then((response) => {
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
      }
    },
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    }
  }
}
