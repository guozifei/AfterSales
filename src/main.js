// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import { AuthService, authService } from './libs/auth.service'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
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
    'realm':'fdp-gree',
    'auth-server-url': 'http://idm.flydiy.gree.com:7393/auth',
    'ssl-required': 'external',
    'resource': 'nts-front-test',
    'public-client': true,
    'confidential-port': 0
}
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
         i18n,
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
