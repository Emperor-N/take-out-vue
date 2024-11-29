import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainView from '@/views/mainView.vue'
import dishView from '@/views/dish/dishView.vue'
import employeeView from '@/views/employee/employeeView.vue'
import setmealView from '@/views/setmeal/setmealView.vue'
import orderView from '@/views/order/orderView.vue'
import dataView from '@/views/data/dataView.vue'
import spaceworkView from '@/views/spacework/spaceworkView.vue'
import addEmployee from '@/views/employee/addEmployee.vue'
import categoryView from '@/views/category/categoryView.vue'
import loginView from '@/views/login/loginView.vue'
import modifypwView from '@/views/modifypwView.vue'
import AddCategory from '@/views/category/addCategory.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: loginView
  },
  {
    path: '/main',
    name: 'home',
    component: MainView,
    redirect: "/employee",
    children: [
      {
        path: '/modify',
        name: 'modifypwView',
        component: modifypwView
      },
      {
        path: '/employee',
        name: 'employee',
        component: employeeView
      },
      {
        path: '/employee/add',
        name: 'addEmployee', 
        component: addEmployee
      },
      {
        path: '/dish',
        name: 'dish', 
        component: dishView
      },
      {
        path: '/setmeal',
        name: 'setmeal', 
        component: setmealView
      },
      {
        path: '/category',
        name: 'category', 
        component: categoryView
      },
      {
        path: '/category/add',
        name: 'addCategory',
        component: AddCategory
      },
      {
        path: '/order',
        name: 'order', 
        component: orderView
      },
      {
        path: '/data',
        name: 'data',
        component: dataView
      },
      {
        path: '/spacework',
        name: 'spacework', 
        component: spaceworkView
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
