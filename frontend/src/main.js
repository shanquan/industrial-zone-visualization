import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import api from './api'
// import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
window.API = api;

Vue.filter('fixed2', function (value) {
  if (!value&&value!=0) return ''
  return value.toFixed(2)
})

new Vue({
  router,
  store,
  data:{
    devserver: process.env.VUE_APP_DEV
  },
  render: h => h(App)
}).$mount('#app')
