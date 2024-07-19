import { setToken, removeToken, getToken } from '@/utils/auth'
import { userLoginService, getUserInfoService } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
  routes: constantRoutes
}

const mutations = {
  // 设置token
  setUserToken(state, num) {
    state.token = num
    setToken(num)
  },

  // 删除token
  removeUserToken(state) {
    state.token = null
    removeToken()
  },

  // 设置 获取userInfo
  setUserInfo(state, data) {
    state.userInfo = data
    // console.log(state.userInfo)
  },

  // 修改路由
  setRoutes(state, newRoutes) {
    state.routes = [...state.routes, ...newRoutes]
  },

  // 重置路由
  clearRoutes(state) {
    state.routes = constantRoutes
  }

}

const actions = {

  // 登录
  async login(context, obj) {
    // 执行axios命令
    const res = await userLoginService(obj)
    // token赋值
    context.commit('setUserToken', res)
  },

  // 获取用户基本信息
  async getUserInfo(context) {
    // console.log('aaa')
    const res = await getUserInfoService()
    // console.log(res)
    context.commit('setUserInfo', res)
    return res
  },

  // token无效清理无效token，删除用户信息
  logout(context) {
    context.commit('removeUserToken')
    context.commit('setUserInfo', {})
    // 重置路由
    resetRouter()
    context.commit('clearRoutes')
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
