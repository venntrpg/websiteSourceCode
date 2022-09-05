import api from "@/api/api";
import router from "@/router/index";
import {
  localItem2Server,
  serverItem2Local,
  serverCharacter2Local,
} from "@/api/apiUtil";
import { checkResponse } from "../../utils/storeUtil";
import { consolidateItemList, calculateItemArmor } from "../../utils/itemUtils";
import { CHAR_LOCAL_STORAGE, COG_LOCAL_STORAGE } from "../../utils/constants";

const state = {
  characters: {},
  character: {},
  searchAbility: "",
  searchAbilitySuggestions: [],
  searchAbilityError: "",
};

const getters = {
  consolidatedItems: (state) => {
    return consolidateItemList(state.character.items);
  },
  itemArmorMap: (state) => {
    return calculateItemArmor(state.character.items);
  },
  sortedPaths: (state) => {
    // sort by minimum purchased ability cost, at least for now - There are definetly better ways to do this sorting,
    // like using a predefined list from scraping the server or something. Maybe I should add that to the vennt-scripts
    // folder and automatically run and populate the resulting jsons into this repo when I deploy??
    if (state.character.abilities === undefined) {
      return [];
    }
    const pathCostMap = {};
    state.character.abilities.forEach((ability) => {
      let cost = parseInt(ability.purchase);
      if (isNaN(cost)) {
        cost = 5000; // arbitrary amount that costs a lot
      }
      if (
        ability === undefined ||
        ability.name === "NULL" ||
        ability.path === undefined
      ) {
        return;
      }
      if (ability.path in pathCostMap) {
        pathCostMap[ability.path] = Math.min(cost, pathCostMap[ability.path]);
      } else {
        pathCostMap[ability.path] = cost;
      }
    });
    const paths = Object.keys(pathCostMap);
    paths.sort((p1, p2) => pathCostMap[p1] - pathCostMap[p2]);
    return paths;
  },
  sortedAbilities: (state, getters) => {
    if (state.character.abilities === undefined) {
      return [];
    }
    const abilityCopy = state.character.abilities.filter(
      (ability) => ability !== undefined && ability.name !== "NULL"
    );
    return abilityCopy.sort((a1, a2) => {
      // 1. put Passive abilities at the end of the list
      const a1Passive = a1.cost && "Passive" in a1.cost && a1.cost.Passive;
      const a2Passive = a2.cost && "Passive" in a2.cost && a2.cost.Passive;
      if (!a1Passive && a2Passive) {
        return -1;
      } else if (a1Passive && !a2Passive) {
        return 1;
      }
      // 2. put abilities which use SP instead of XP at the end of the list when passive
      if (a1Passive && a1.purchase && a2Passive && a2.purchase) {
        const a1SP = a1.purchase.includes("sp");
        const a2SP = a2.purchase.includes("sp");
        if (!a1SP && a2SP) {
          return -1;
        } else if (a1SP && !a2SP) {
          return 1;
        }
      }
      // 3. sort by path gathering
      if (a1.path !== a2.path) {
        const pathIdx = (given) =>
          getters.sortedPaths.findIndex((path) => path === given);
        return pathIdx(a1.path) - pathIdx(a2.path);
      }
      // 4. sort by XP price otherwise (for now at least)
      const costInt = (purchase) => {
        const cost = parseInt(purchase);
        if (isNaN(cost)) {
          return 0;
        }
        return cost;
      };
      return costInt(a1.purchase) - costInt(a2.purchase);
    });
  },
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
  updateCharacterAttributes(state, { attrs, msg }) {
    Object.entries(attrs).forEach(([attr, val]) => {
      if (msg !== undefined) {
        if (!state.character.changelog) {
          state.character.changelog = [];
        }
        const log = { attr, msg, time: Math.floor(Date.now() / 1000) };
        if (state.character[attr]) {
          log.prev = state.character[attr];
        }
        state.character.changelog.push(log);
      }
      state.character[attr] = val;
    });
  },
  filterCharacterChangelog(state, attr) {
    if (!state.character.changelog) {
      state.character.changelog = [];
    }
    state.character.changelog = state.character.changelog.filter(
      (log) => log.attr !== attr
    );
  },
  appendItem(state, item) {
    const localItem = serverItem2Local(item);
    state.character.items.push(localItem);
  },
  updateItem(state, item) {
    const localItem = serverItem2Local(item);
    const itemList = [...state.character.items];
    const idx = itemList.findIndex((search) => search.id === localItem.id);
    itemList[idx] = localItem;
    state.character.items = itemList;
  },
  setSearchAbility(state, ability) {
    state.searchAbility = ability;
  },
  setSearchAbilitySuggestions(state, suggestions) {
    state.searchAbilitySuggestions = suggestions;
  },
  setSearchAbilityError(state, error) {
    state.searchAbilityError = error;
  },
};

const actions = {
  // ------------------------- CHARACTER APIS ------------------------- //

  createCharacter: ({ commit }, { character, redirectToCharacter }) => {
    return api.createCharacter(character).then((response) => {
      if (checkResponse(response)) {
        localStorage.removeItem(CHAR_LOCAL_STORAGE);
        character.id = response.id;
        commit("setCharacter", character);
        if (redirectToCharacter) {
          router.push({ name: "Character", params: { id: response.id } });
        }
      }
    });
  },

  createEnemy: ({ commit }, { enemy, campaign, redirectToCharacter }) => {
    return api.createEnemy(enemy, campaign).then((response) => {
      if (checkResponse(response)) {
        localStorage.removeItem(COG_LOCAL_STORAGE);
        enemy.id = response.id;
        commit("setCharacter", enemy);
        if (campaign) {
          router.push({ name: "Campaign", params: { campaignId: campaign } });
        } else if (redirectToCharacter) {
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
        commit("setSearchAbility", "");
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

  updateAttributes: ({ commit }, { id, attrs, msg }) => {
    if (Object.keys(attrs).length === 0) {
      return;
    }
    // upate value locally immediately so it looks seamless
    commit("updateCharacterAttributes", { attrs, msg });
    return api.updateAttributes(id, attrs, msg).then((response) => {
      checkResponse(response);
    });
  },

  filterChangelog: ({ commit }, { id, attr }) => {
    return api.filterChangelog(id, attr).then((response) => {
      if (checkResponse(response)) {
        commit("filterCharacterChangelog", attr);
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
        commit("setSearchAbilityError", "");
      } else {
        if (
          response.info &&
          response.info.includes("More than one match") &&
          response.matches
        ) {
          commit("setSearchAbilitySuggestions", response.matches);
          commit("setSearchAbilityError", "");
        } else if (response.info && response.info.includes("No such ability")) {
          commit("setSearchAbilitySuggestions", []);
          commit("setSearchAbilityError", response.info);
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

  removeAbility: ({ dispatch }, { id, name }) => {
    return api.removeAbility(id, name).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
        router.push({
          name: "Character",
          params: { id: response.id, section: "abilities" },
        });
      }
    });
  },

  refreshAbility: ({ dispatch }, { id, name }) => {
    return api.refreshAbility(id, name).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
      }
    });
  },

  updateAbilityComment: ({ dispatch }, { id, name, comment }) => {
    return api.updateAbilityComment(id, name, comment).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
      }
    });
  },

  createCustomAbility: ({ dispatch }, { id, ability }) => {
    return api.createCustomAbility(id, ability).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
      }
    });
  },

  updateAbility: ({ dispatch }, { id, name, ability }) => {
    return api.updateAbility(id, name, ability).then((response) => {
      if (checkResponse(response)) {
        // regrab character info with new ability set
        dispatch("getCharacter", id);
      }
    });
  },

  // ------ ITEM APIS ------ //

  addItem: (
    { commit, dispatch },
    { id, item, refreshCharacter = false, redirectToDetail = false }
  ) => {
    return api.addItem(id, localItem2Server(item)).then((response) => {
      if (checkResponse(response) && response.id) {
        if (refreshCharacter) {
          // regrab character info with new item when `refreshCharacter` is true
          dispatch("getCharacter", id);
        } else {
          item.id = response.id;
          commit("appendItem", item);
        }
        if (redirectToDetail) {
          router.push({
            name: "Character",
            params: { id, section: "inventory", detail: response.id },
          });
        }
      }
    });
  },

  removeItem: ({ dispatch }, { id, itemId, redirectToInventory = false }) => {
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

  updateItem: ({ commit }, { id, item }) => {
    return api.updateItem(id, localItem2Server(item)).then((response) => {
      if (checkResponse(response)) {
        commit("updateItem", response.value);
      }
    });
  },
};

const module = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

export default module;
