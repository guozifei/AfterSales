import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { canTurnTo, setTitle } from '@/libs/util'
// const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes
  // mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  store.dispatch('getUserInfo').then(user => {
    turnTo(to, store.getters.accessGet, next)
    store.dispatch('dealMenuData').then(res => {

    })
  })
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
