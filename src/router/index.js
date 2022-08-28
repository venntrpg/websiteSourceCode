import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NotFoundComponent from "../components/NotFound.vue";
import { stringToLinkID } from "../utils/characterStringFormatting";
import {
  SECTION_ABILITIES,
  SECTION_INVENTORY,
  SECTION_SHOP,
} from "../utils/constants";

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

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition; // default behavior when using forward & backward buttons
  }
  if (to.name === "Character" && from.name === "Character") {
    const releventSubRoutes = [
      SECTION_ABILITIES,
      SECTION_INVENTORY,
      SECTION_SHOP,
    ];
    if (
      to.params.section === from.params.section &&
      releventSubRoutes.includes(to.params.section)
    ) {
      const toDetail = to.params.detail;
      const fromDetail = from.params.detail;
      const detail = toDetail || fromDetail;
      // only attempt jump if only 1 detail is defined
      if ((toDetail !== undefined) !== (fromDetail !== undefined)) {
        // attempt jump after 0.1 seconds to allow for the page to reshuffle
        setTimeout(() => {
          const el = document.getElementById(stringToLinkID(detail));
          if (el) {
            const height =
              el.getBoundingClientRect().top +
              window.pageYOffset -
              window.innerHeight / 2;
            window.scrollTo(0, height);
          }
        }, 50);
      }
    }
  }
};

const router = new VueRouter({
  routes,
  scrollBehavior,
});

export default router;
