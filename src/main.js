// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import App from './App'
import router from './router'
import './bus';
import currencyFilter from './filter/currency'


Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.component('Loading',Loading);
Vue.filter('currency' , currencyFilter)
axios.defaults.withCredentials = true ;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
  console.log('to',to,'from',from,'next',next)
  
// 判斷是否需要驗證
  if(to.meta.requiresAuth){
    const api =`${process.env.APIPATH}/api/user/check`;
    // console.log(api)
    axios.post(api).then((response) => {
      console.log(response.data)
      // 連至用戶狀態之API
      // 若為登入則跳轉至下一個指定頁面，指定頁面寫在 Login.vue 上
      if(response.data.success){
        next();
      }else{
      // 若狀態為登出集跳轉至login頁面
        next({
          path:'/login',
        });
      }
    })
    
    console.log('需驗證')
  }else{
    next();
  }
  
  // meta: { requiresAuth: true }
})
