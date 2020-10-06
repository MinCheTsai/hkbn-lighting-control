import Vue from 'vue'
import VueRouter from 'vue-router'
import DefaultLayout from '@/views/DefaultLayout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
      },
      {
        path: '/device-management',
        name: 'DeviceManagement',
        component: () => import(/* webpackChunkName: "device" */ '../views/Device.vue')
      },
      {
        path: '/scheduling-management',
        name: 'SchedulingManagement',
        component: () => import(/* webpackChunkName: "scheduling" */ '../views/Scheduling.vue')
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue')
      },
      {
        path: '/user-management',
        name: 'UserManagement',
        component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
