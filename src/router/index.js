import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFoundComponent from '../components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    // route level code-splitting
    // this generates a separate chunk (signup.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/SignUp.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/character/:id/:section?/:detail?',
    name: 'Character',
    // route level code-splitting
    // this generates a separate chunk (character.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "character" */ '../views/Character.vue')
  },
  {
    path: '/create',
    name: 'Create',
    // route level code-splitting
    // this generates a separate chunk (create.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "create" */ '../views/Create.vue')
  },
  {
    path: '/style',
    name: 'Style',
    // route level code-splitting
    // this generates a separate chunk (style.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "style" */ '../views/Style.vue')
  },
  { path: '*', component: NotFoundComponent }
]

const router = new VueRouter({
  routes
})

export default router
