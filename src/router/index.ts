import { createRouter, createWebHistory, Router, RouteRecordRaw, NavigationGuard } from 'vue-router'

import EnterPage from '../views/EnterPage.vue'
import ChatWorld from '../views/ChatWorld.vue'

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
  next()
})

export default router
