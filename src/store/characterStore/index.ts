import api from "@/api/api";
import router from "@/router/index";
import {
  localItem2Server,
  serverItem2Local,
  serverCharacter2Local,
} from "@/api/apiUtil";
import { checkResponse } from "../../utils/storeUtil";
import { sortedAbilities } from "../../utils/abilityUtils";
import { consolidateItemList } from "../../utils/itemUtils";
import { characterAttributesMap } from "../../utils/attributeUtils";
import { CHAR_LOCAL_STORAGE, COG_LOCAL_STORAGE } from "../../utils/constants";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { diceToggles } from "@/utils/diceUtils";

const state: CharacterState = {
  characters: {},
  character: {
    id: "",
    name: "",
    agi: 0,
    cha: 0,
    dex: 0,
    int: 0,
    per: 0,
    spi: 0,
    str: 0,
    tek: 0,
    wis: 0,
    hp: 0,
    maxHp: 0,
    mp: 0,
    maxMp: 0,
    vim: 0,
    maxVim: 0,
    hero: 0,
    maxHero: 0,
    init: 0,
    speed: 0,
    xp: 0,
    sp: 0,
    armor: 0,
    gift: "",
    isEnemy: false,
    items: [],
    abilities: [],
    changelog: [],
  },
  searchAbility: "",
  searchAbilitySuggestions: [],
  searchAbilityError: "",
  levelsToProcess: 0,
};

const getters: GetterTree<CharacterState, RootState> = {
  consolidatedItems: (state) => {
    if (state.character === undefined) {
      return [];
    }
    return consolidateItemList(state.character.items);
  },
  sortedAbilities: (state) => {
    if (state.character === undefined) {
      return [];
    }
    return sortedAbilities(state.character);
  },
  characterAttributes: (state) => {
    if (state.character === undefined) {
      return {};
    }
    return characterAttributesMap(state.character);
  },
  diceToggles: (state) => {
    if (state.character === undefined) {
      return {};
    }
    return diceToggles(state.character);
  },
};

const mutations: MutationTree<CharacterState> = {
  setCharactersList(state, characters) {
    state.characters = characters;
  },
  setCharacter(state, character) {
    state.character = character;
  },
  updateCharacterAttribute(state, { attr, val }) {
    if (state.character == undefined) {
      return;
    }
    if (typeof val === "string") {
      state.character[attr as CharacterStrAttrs] = val;
    } else if (typeof val === "number") {
      state.character[attr as CharacterNumAttrs] = val;
    }
  },
  updateCharacterAttributes(state, { attrs, msg }) {
    Object.entries(attrs).forEach(([attr, val]) => {
      if (state.character === undefined) {
        return;
      }
      if (msg !== undefined) {
        if (!state.character.changelog) {
          state.character.changelog = [];
        }
        const log: ChangelogRow = {
          attr,
          msg,
          time: Math.floor(Date.now() / 1000),
        };
        if (attr in state.character) {
          const prevVal = state.character[attr as keyof Character];
          if (typeof prevVal === "string" || typeof prevVal === "number") {
            log.prev = prevVal;
          }
        }
        state.character.changelog.push(log);
      }
      if (typeof val === "string") {
        state.character[attr as CharacterStrAttrs] = val;
      } else if (typeof val === "number") {
        state.character[attr as CharacterNumAttrs] = val;
      }
    });
  },
  filterCharacterChangelog(state, attr) {
    if (state.character === undefined) {
      return;
    }
    if (!state.character.changelog) {
      state.character.changelog = [];
    }
    state.character.changelog = state.character.changelog.filter(
      (log) => log.attr !== attr
    );
  },
  appendItem(state, item) {
    if (state.character === undefined) {
      return;
    }
    const localItem = serverItem2Local(item);
    state.character.items.push(localItem);
  },
  updateItem(state, item) {
    if (state.character === undefined) {
      return;
    }
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
  setLevelsToProcess(state, levels) {
    state.levelsToProcess = levels;
  },
};

const actions: ActionTree<CharacterState, RootState> = {
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
