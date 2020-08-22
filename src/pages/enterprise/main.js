import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import './styles/index.scss' // global css

import App from './App'
import store from '../../store'

import router from '../../router'

import '../../icons' // icon
import '../../permission' // permission control
import '../../utils/error-log' // error log

import * as filters from '../../filters' // global filters
import uploader from 'vue-simple-uploader'

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.use(uploader)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

store.commit('app/SET_PLATFORM', 'enterprise')
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
