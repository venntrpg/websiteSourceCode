import { ActionTree, MutationTree } from "vuex";
import api from "@/api/apiOther";

const state: OtherState = {
  randomNames: [],
  randomNamesDisabled: true,
};

const mutations: MutationTree<OtherState> = {
  appendRandomNames(state, randomNames) {
    state.randomNamesDisabled = false;
    state.randomNames = state.randomNames.concat(randomNames);
  },
  shiftRandomNames(state) {
    state.randomNames.shift();
  },
  randomNamesIsDisabled(state) {
    state.randomNamesDisabled = true;
  },
};

const actions: ActionTree<OtherState, RootState> = {
  getRandomNames: ({ commit }) => {
    return api.getRandomNames().then((response) => {
      if (response.length && response.length > 0) {
        commit("appendRandomNames", response);
      } else {
        // either the server or the proxy is down :(
        commit("randomNamesIsDisabled");
      }
    });
  },
};

const module = {
  state,
  mutations,
  actions,
  namespaced: true,
};

export default module;
