import api from "@/api/api";
import router from "@/router/index";
import { serverCharacter2Local } from "@/api/apiUtil";
import { checkResponse } from "../storeUtil";

const state = {
  characters: {},
  character: {},
  searchAbility: "",
  searchAbilitySuggestions: [],
};

const mutations = {
  clearCharactersList(state) {
    state.characters.clear();
  },
  setCharactersList(state, characters) {
    state.characters = characters;
  },
  setCharacter(state, character) {
    state.character = character;
  },
  updateCharacterAttribute(state, { attr, val }) {
    state.character[attr] = val;
  },
  setSearchAbility(state, ability) {
    state.searchAbility = ability;
  },
  setSearchAbilitySuggestions(state, suggestions) {
    state.searchAbilitySuggestions = suggestions;
  },
};

const actions = {
  // ------------------------- CHARACTER APIS ------------------------- //

  // eslint-disable-next-line no-unused-vars
  createCharacter: ({ commit }, { character, redirectToCharacter }) => {
    return api.createCharacter(character).then((response) => {
      // TODO: Also commit items / weapons here!
      if (checkResponse(response)) {
        localStorage.removeItem("creation-new-wip");
        if (redirectToCharacter) {
          router.push({ name: "Character", params: { id: response.id } });
        }
      }
    });
  },

  listCharacters: ({ commit }) => {
    return api.listCharacters().then((response) => {
      if (checkResponse(response) && response.value) {
        const characters = response.value;
        for (const char in characters) {
          characters[char] = serverCharacter2Local(characters[char]);
        }
        commit("setCharactersList", characters);
      }
    });
  },

  getCharacter: ({ commit }, id) => {
    return api.getCharacter(id).then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setCharacter", serverCharacter2Local(response.value));
      }
    });
  },

  setAttribute: ({ commit }, { id, attr, val }) => {
    // upate value locally immediately so it looks seamless
    commit("updateCharacterAttribute", { attr, val });
    return api.setAttribute(id, attr, val).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // ------ ABILITY APIS ------ //

  lookupAbility: ({ commit, rootState }, name) => {
    // currently the only api I am specifically making sure we don't hit too hard
    const timeout = rootState.pendingApis.lookupAbility;
    if (timeout !== undefined && (timeout === false || timeout > Date.now())) {
      console.log("lookupAbility rate limited. timeout: " + timeout);
      return false;
    }
    commit("addDisabledToPendingApis", "lookupAbility", { root: true });
    return api.lookupAbility(name).then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setSearchAbility", response.value);
        commit("setSearchAbilitySuggestions", []);
      } else {
        if (
          response.info &&
          response.info.includes("More than one match") &&
          response.matches
        ) {
          commit("setSearchAbilitySuggestions", response.matches);
        }
        commit("setSearchAbility", "");
      }
      commit(
        "addApiToPendingApis",
        { name: "lookupAbility", timeout: 1000 },
        { root: true }
      );
    });
  },

  addAbility: ({ dispatch }, { id, name }) => {
    return api.addAbility(id, name).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
      }
    });
  },

  // ------ ITEM APIS ------ //

  addItem: ({ dispatch }, { id, item, refreshCharacter }) => {
    return api.addItem(id, item).then((response) => {
      if (checkResponse(response) && response.id && refreshCharacter) {
        // regrab character info with new item when `refreshCharacter` is true
        dispatch("getCharacter", id);
      }
    });
  },

  removeItem: ({ dispatch }, { id, itemId, redirectToInventory }) => {
    return api.removeItem(id, itemId).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with item removed
        dispatch("getCharacter", id);
        if (redirectToInventory) {
          router.push({
            name: "Character",
            params: { id, section: "inventory" },
          });
        }
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
