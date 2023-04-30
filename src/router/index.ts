import { createRouter, createWebHistory, Router, RouteRecordRaw, NavigationGuard } from 'vue-router'

import EnterPage from '../views/EnterPage.vue'
import ChatWorld from '../views/ChatWorld.vue'
import RegistPage from '../views/RegistPage.vue'
import { getToken } from '../utils/token'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/enter'
  },
  {
    path: '/enter',
    name: 'enter',
    component: EnterPage
  },
  {
    path: '/regist',
    name: 'regist',
    component: RegistPage
  },
  {
    path: '/world',
    name: 'world',
    component: ChatWorld,
    meta: {
      isAuthorization: true
    }
  },
  {
    path: '/*',
    redirect: '/enter'
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.isAuthorization) {
    if (token) {
      next()
    } else {
      ElMessage({
        type: 'warning',
        message: '您没有权限, 请登录以获取Token!'
      })
      router.push('/enter')
    }
  } else {
    next()
  }
})

export default router
