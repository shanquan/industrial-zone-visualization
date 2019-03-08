import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/vzone/:id',
      name: 'zone',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "frontend" */ './views/Zone.vue')
    },
    {
      path: '/vbuilding/:id',
      name: 'building',
      component: () => import(/* webpackChunkName: "frontend" */ './views/Building.vue')
    }, {
      path: '/vworkshop/:id',
      name: 'workshop',
      component: () => import( /* webpackChunkName: "frontend" */ './views/Workshop.vue')
    }, {
      path: '/vprofit',
      name: 'profit',
      component: () => import( /* webpackChunkName: "admin" */ './views/_Profit.vue')
    }, {
      path: '/vusers',
      name: 'users',
      component: () => import( /* webpackChunkName: "admin" */ './views/_Users.vue')
    }, {
      path: '/vfloors',
      name: 'floors',
      component: () => import( /* webpackChunkName: "admin" */ './views/_Floors.vue')
    }
  ]
})
