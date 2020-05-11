import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setTitle } from '@/libs/util'
import config from '@/config'
// const { homeName } = config
Vue.use(Router)
const router = new Router({
  routes
  // mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'
const initRouters = (store) => {
  // 这个人登录了已经
  if (store.state.user.hasGetInfo) {
    // 路由加载过了
    if (store.state.app.hasGetRouter && store.state.app.routers && store.state.app.routers.length > 0) {
      console.log('已经加载过了路由')
    } else {
      // 加载路由
      console.log('开始加载路由权限...')
      store.dispatch('getRouters').then(routers => {
        // 此处routers已经是按照权限过滤后的路由了，没权限的，不加入路由，无法访问
        // 路由重置一下把404放最后
        const newRouter = new Router({
          routes,
          mode: config.routerModel
        })
        router.matcher = newRouter.matcher
        // 把404加最后面，如果用router.push({name:'xxxx'})这种的话，404页面可能空白，用path:'/aa/bb'
        router.addRoutes(routers.concat([{
          path: '*',
          name: 'error_404',
          meta: {
            hideInMenu: true
          },
          component: () => import(/* webpackChunkName: "404" */'@/view/error-page/404.vue')
        }]))
      }).finally(() => {
      })
    }
  }
}
// const turnTo = (to, access, next) => {
//   if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//   else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  store.dispatch('getUserInfo').then(user => {
    initRouters(store)
    next()
  })
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
