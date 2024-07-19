import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

import { asyncRoutes } from '@/router'

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // to and from are both route objects. must call `next`.
  nProgress.start()
  // 存在token的情况下
  if (store.getters.token) {
    // 如果此时要去的页面为登录页
    if (to.path === '/login') {
      // 直接跳转到主页
      next('/')
      nProgress.done()
    } else {
      // 判断是否已经有用户信息，有则跳过，无则获取
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles)
        // console.log()
        const passRoutes = asyncRoutes.filter(item => {
          console.log(item.children[0].name)
          return roles.menus.includes(item.children[0].name)
        })
        store.commit('user/setRoutes', passRoutes)
        console.log(passRoutes)
        router.addRoutes([...passRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)// 让路由拥有信息，router已知缺陷
      } else {
        next()
      }

      // 放行
      next()
    }
  } else {
    // 不存在token的情况下
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // to and from are both route objects.

  nProgress.done()
})
