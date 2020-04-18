// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import axios from 'axios'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/css/all.css'
import '@/assets/icons/iconfont.css'
import { AuthService, authService } from './libs/auth.service'

// 插件
import httpADP from './plugin/httpADP'
import HttpInterceptor from './plugin/ADPHttpInterceptor'

import VueLocalStorage from 'vue-ls'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.use(httpADP, axios);
Vue.use(HttpInterceptor, Vue.httpADP);
Vue.prototype.$axios = axios
Vue.prototype.$store = store
Vue.use(iView)
Vue.use(VueLocalStorage)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
 window._FLY_GLOBAL_CONFIG = {};
   window._FLY_GLOBAL_CONFIG.idm ={
    'realm': 'gree-shyun',
    'auth-server-url': 'https://idmshyun.gree.com/auth/',
    'ssl-required': 'external',
    'resource': 'gree-shyun-big-data',
    'public-client': true,
    'confidential-port': 0
}   
//   window._FLY_GLOBAL_CONFIG.idm ={
//     'realm': 'flydiy-sit',
//     'auth-server-url': 'https://idm.flydiy.cn:8887/auth',
//     'ssl-required': 'external',
//     'resource': 'nts-front-test',
//     'public-client': true,
//     'confidential-port': 0
// }   
 AuthService
  .init({
    url: _FLY_GLOBAL_CONFIG.idm['auth-server-url'],
    realm: _FLY_GLOBAL_CONFIG.idm['realm'],
    clientId: _FLY_GLOBAL_CONFIG.idm['resource'],
  }, { onLoad: 'login-required', checkLoginIframeInterval: 1 })
  .then(() => {
    authService.loadUserProfile().then((userProfile)=>{
    store.dispatch('idmLogin')
      Object.defineProperties(Vue.prototype, {
        UserProfile: {
          get() {
            return userProfile;
          }
        }
      });
    
      new Vue({
         el: '#app',
         router,
         store,
         template: `<a-config-provider :autoInsertSpaceInButton="false">
         <App />
       </a-config-provider>`,
        render: h => h(App)
      });
    });
  })
  .catch(e => {
    console.log('Authenticated Failed: ' + e);
  }); 
