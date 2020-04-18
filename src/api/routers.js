import axios from '@/libs/api.request'
/**
 * 从后台拿动态路由的数据
 * @param access
 * @returns {*}
 */

export const getRouterReq = (access) => {
  return axios.request({
    url: '/sys/routers',
    params: {
      access
    },
    method: 'get'
  })
}
