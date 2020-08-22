import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import router1 from '@/pages/lab/router'
import store from './../store'
// create an axios instance
const service = axios.create({
  baseURL: 'http://test.web.yibeirui.com:5550/admin', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.message === '试用期30天已到，请购买服务') {
      return
    }
    if (res.code && res.code !== 200 && res.code !== 401) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.message === '当前会话已过期，请重新登录...') {
        if (window.location.pathname === '/standard.html') {
          router.replace(`/login?redirect_url=${encodeURIComponent(window.location.href)}`)
        } else if (window.location.pathname === '/lab.html') {
          router1.replace('/login')
        }
      }
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      if (res === '') {
        return res
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
