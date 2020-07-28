import Vue from 'vue'
import Router from 'vue-router'
import app from 'app'

import { tokenName } from 'common'
import { GET_USER_INFO } from 'service'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/components/TheLogin.vue'], resolve)
    }, {
      path: '/home',
      component: (resolve) => require(['@/components/main/TheMain.vue'], resolve),
      children: [
        {
          path: '',
          redirect: '/manage/case'
        },
        {
          path: '/manage/user',
          name: '用户管理',
          component: (resolve) => require(['@/components/main/userManage/index.vue'], resolve)
        },
        {
          path: '/manage/case',
          name: '病理号管理',
          component: (resolve) => require(['@/components/main/caseManage/index.vue'], resolve)
        },
        {
          path: '/manage/label/:organType/:organId',
          name: '标签管理',
          component: (resolve) => require(['@/components/main/labelManage/index.vue'], resolve)
        }
      ]
    },
    {
      path: '/report/:caseNum/:reportStatus',
      name: '病理报告',
      component: (resolve) => require(['@/components/report/index.vue'], resolve)
    },
    {
      path: '*',
      name: 'notFound',
      component: (resolve) => require(['@/components/NotFound.vue'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 判断是否有token
  const token = window.localStorage.getItem(tokenName)
  if (token) {
    (async () => {
      // 获取用户信息,判断是否过期
      const res = await GET_USER_INFO()
      if (res && res.data.success) {
        // 存储用户信息
        app.$store.commit('setUser', {
          name: res.data.data.name,
          userId: res.data.data.id,
          userType: res.data.data.userType,
          userTypeName: res.data.data.userTypeName
        })
        if (to.path === '/login') {
          next({ path: '/' })
        } else {
          next()
        }
      } else {
        if (to.path === '/login') {
          next()
        } else {
          next({ path: '/login' })
        }
      }
    })()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

export default router
