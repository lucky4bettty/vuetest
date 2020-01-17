// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
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

  if(to.meta.requiresAuth){
    // const api =`${process.env.APIPATH}/api/user/check`;
    // console.log(api)
    // axios.get(api).then((response) => {
    // console.log(response.data)
    // })

    // console.log('需驗證')
  }else{
    next();
  }
  
  // meta: { requiresAuth: true }
})
