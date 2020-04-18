export const routersData = [
  {
    path: '/gfrpt',
    name: 'gfrpt',
    component: 'components/main',
    meta: {
      title: '广佛报表',
      icon: 'md-albums'
    },
    children: [
      {
        path: 'gfrptUnfinishAssignCount',
        name: 'gfrptUnfinishAssignCount',
        url: 'https://cn.bing.com/',
        meta: {
          title: '未完工工单汇总',
          icon: 'md-analytics'
        },
        component: 'view/chartCompoent/chart'
      },

      {
        path: 'gfrptInsSatisfaction',
        name: 'gfrptInsSatisfaction',
        url: 'https://www.baidu.com',
        meta: {
          title: '满意度分析表（安装）',
          icon: 'md-analytics'
        },
        component: 'view/chartCompoent/chart'
      },
      {
        path: 'gfrptMtSatisfaction',
        name: 'gfrptMtSatisfaction',
        url: 'https://www.qq.com',
        meta: {
          title: '满意度分析表（维修）',
          icon: 'md-analytics'
        },
        component: 'view/chartCompoent/chart'
      }
    ]
  },
  {
    path: '/ins',
    name: 'ins',
    component: 'components/main',
    meta: {
      title: '安装服务',
      icon: 'md-albums'
    },
    children: [
      {
        path: 'insSatisfactionDetail',
        name: 'insSatisfactionDetail',
        url: 'https://unbug.github.io/codelf/',
        meta: {
          title: '安装满意度明细',
          hideInMenu: false,
          icon: 'md-analytics'
        },
        component: 'view/chartCompoent/chart'
      }
    ]
  }
]
// export const routersData = [{
//   path: '/pet',
//   name: 'Pet',
//   meta: {
//     title: '宠物',
//     hideInMenu: false,
//     icon: 'logo-freebsd-devil'
//   },
//   component: 'components/main',
//   children: [{
//     path: 'cat',
//     name: 'Cat',
//     meta: {
//       title: '猫咪',
//       hideInMenu: false,
//       icon: 'ios-cloudy-night'
//     },
//     component: 'view/pet/cat/Cat.vue'
//   }, {
//     path: 'dog',
//     name: 'Dog',
//     meta: {
//       hideInMenu: false,
//       title: '狗娃',
//       icon: 'ios-color-filter'
//     },
//     component: 'view/pet/dog/Dog.vue'
//   },
//   {
//     path: 'adog',
//     name: 'aDog',
//     meta: {
//       hideInMenu: false,
//       title: '狗菜',
//       icon: 'ios-color-filter'
//     },
//     component: 'view/pet/dog/Dog.vue'
//   },
//   {
//     path: 'pig',
//     name: 'Pig',
//     meta: {
//       hideInMenu: false,
//       title: '猪啊',
//       icon: 'ios-contact'
//     },
//     component: 'view/pet/pig/Pig.vue',
//     children: [
//       {
//         path: 'female',
//         name: 'Female',
//         meta: {
//           hideInMenu: false,
//           title: '母猪',
//           icon: 'ios-contact'
//         },
//         component: 'view/pet/pig/Pig.vue'
//       },
//       {
//         path: 'male',
//         name: 'Male',
//         meta: {
//           hideInMenu: false,
//           title: '公猪',
//           icon: 'ios-contact'
//         },
//         component: 'view/pet/pig/Pig.vue'
//       }
//     ]
//   }]
// }]
