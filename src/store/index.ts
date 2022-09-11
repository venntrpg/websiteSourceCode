import Vue from "vue";
import Vuex, { ActionTree, MutationTree } from "vuex";
import api from "@/api/api";
import router from "@/router/index";
import campaignStore from "./campaignStore";
import characterStore from "./characterStore";
import diceStore from "./diceStore";
import otherStore from "./otherStore";

Vue.use(Vuex);

// ------------------------- STATE ------------------------- //

const state: RootState = {
  isLoggedIn: false, // This variable is set in App.vue on loading the website
  username: "", // This variable is set in App.vue on loading the website
  signupErrorMsg: "",
  loginErrorMsg: "",
  pendingApis: {}, // Used to prevent spamming apis
};

const mutations: MutationTree<RootState> = {
  setIsLoggedIn(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  },
  setUsername(state, username) {
    state.username = username;
  },
  setSignupErrorMsg(state, signupErrorMsg) {
    state.signupErrorMsg = signupErrorMsg;
  },
  setLoginErrorMsg(state, loginErrorMsg) {
    state.loginErrorMsg = loginErrorMsg;
  },
  addDisabledToPendingApis(state, name) {
    state.pendingApis[name] = false;
  },
  addApiToPendingApis(state, { name, timeout }) {
    state.pendingApis[name] = Date.now() + timeout;
  },
};

const actions: ActionTree<RootState, RootState> = {
  // ------------------------- ACCOUNT APIS ------------------------- //

  signup: ({ commit }, { username, password }) => {
    console.log("singing up!");
    if (username === undefined || password === undefined) {
      console.log(
        "Login: username or password were undefined. Username: " +
          username +
          ", Password: " +
          password
      );
      return;
    }
    return api.signup(username, password).then((response) => {
      if (response && response.success !== undefined) {
        if (response.success === false && response.info) {
          commit("setSignupErrorMsg", response.info);
        } else if (response.success === true && response.auth_token) {
          commit("setIsLoggedIn", true);
          localStorage.setItem("auth", response.auth_token);
          commit("setUsername", username);
          localStorage.setItem("username", username);
          if (router.currentRoute.name !== "Home") {
            router.push({ name: "Home" });
          }
        }
      }
    });
  },

  login: ({ commit }, { username, password }) => {
    if (username === undefined || password === undefined) {
      return;
    }
    return api.login(username, password).then((response) => {
      if (response && response.success !== undefined) {
        if (response.success === false && response.info) {
          commit("setLoginErrorMsg", response.info);
        } else if (response.success === true && response.auth_token) {
          commit("setIsLoggedIn", true);
          localStorage.setItem("auth", response.auth_token);
          commit("setUsername", username);
          localStorage.setItem("username", username);
          if (router.currentRoute.name !== "Home") {
            router.push({ name: "Home" });
          }
        }
      }
    });
  },

  logout: ({ commit }) => {
    return api.logout().then((response) => {
      if (response && response.success !== undefined) {
        if (response.success === true) {
          // Clear local storage - future api calls will fail
          // It may be a better idea to move this above the api call, so we can't make api calls immediately after logging out
          commit("setIsLoggedIn", false);
          localStorage.removeItem("auth");
          commit("setUsername", "");
          localStorage.removeItem("username");
          router.push({ name: "Home" });
          if (router.currentRoute.name !== "Home") {
            router.push({ name: "Home" });
          }
        }
      }
    });
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    campaign: campaignStore,
    character: characterStore,
    dice: diceStore,
    other: otherStore,
  },
});
