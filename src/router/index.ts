import { createRouter, createWebHistory, Router, RouteRecordRaw, NavigationGuard } from 'vue-router'

import EnterPage from '../views/EnterPage.vue'
import ChatWorld from '../views/ChatWorld.vue'
import RegistPage from '../views/RegistPage.vue'

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
    component: ChatWorld
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
  if (!to.query) {
    router.replace({
      path: '/enter'
    })
  }

  if (!from.query) {
    router.replace({
      path: '/enter'
    })
  }

  if (from.query) {
    next()
  }
})

export default router
