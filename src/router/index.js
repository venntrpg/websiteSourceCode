import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NotFoundComponent from "../components/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/SignUp.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/create/:section?",
    name: "Create",
    component: () =>
      import(/* webpackChunkName: "create" */ "../views/Create.vue"),
  },
  {
    path: "/enemy/:section?",
    name: "Enemy",
    component: () =>
      import(/* webpackChunkName: "enemy" */ "../views/Enemy.vue"),
  },
  {
    path: "/character/:id/:section?/:detail?",
    name: "Character",
    component: () =>
      import(/* webpackChunkName: "character" */ "../views/Character.vue"),
  },
  {
    path: "/campaign/:campaignId/:characterId?",
    name: "Campaign",
    component: () =>
      import(/* webpackChunkName: "campaign" */ "../views/Campaign.vue"),
  },
  {
    path: "/credits",
    name: "Credits",
    component: () =>
      import(/* webpackChunkName: "credits" */ "../views/Credits.vue"),
  },
  {
    path: "/style",
    name: "Style",
    component: () =>
      import(/* webpackChunkName: "style" */ "../views/Style.vue"),
  },
  { path: "*", component: NotFoundComponent },
];

const router = new VueRouter({
  routes,
});

export default router;
