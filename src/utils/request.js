import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000

})

service.interceptors.request.use((config) => {
  // 成功  注入token
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  // 判断是否为blob文件对象
  if (response.data instanceof Blob) return response.data
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({
      type: 'warning',
      message: message
    })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if (error.response.status === 401) {
    Message({ type: 'warning', message: 'token失效' })
    await store.dispatch('user/logout')

    router.push('/login')
    return Promise.reject(error)
  }

  Message({
    type: 'warning',
    message: error.message
  })
  return Promise.reject(error)
})

export default service
