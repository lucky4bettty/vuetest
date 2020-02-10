import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/pages/Dashboard'
import Products from '@/components/pages/Products'
import OrderForm from '@/components/pages/OrderForm'
import Coupon from '@/components/pages/Coupon'
import Customer from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'



Vue.use(Router)

export default new Router({
  linkActiveClass:'active',
  routes: [
    {
      path:'*',
      redirect: '/login'
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true }
    // },
    {
      path:'/login',
      name: 'login',
      component: Login

    },
    {
      path: '/admin',
      name: 'HelloWorld',
      component:  Dashboard,
      children:[
        {
          path:'product',
          name: 'Product',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path:'orderform',
          name: 'OrderForm',
          component: OrderForm,
          meta: { requiresAuth: true },
        },
        {
          path:'coupon',
          name: 'Coupon',
          component: Coupon,
          meta: { requiresAuth: true },
        }
        // {
        //   path:'customer',
        //   name: 'Customer',
        //   component: Customer,
        //   meta: { requiresAuth: true },
        // },
      ],
    }, 
       {
      path:'/',
      name: 'Dashboard',
      component: Dashboard,
      children:[
       { 
        path:'customer',
        name: Customer,
        component: Customer
      },
      { 
        path:'customer_checkout/:orderId',
        name: CustomerCheckout,
        component: CustomerCheckout
      },

      ]
    },
  ]
})
