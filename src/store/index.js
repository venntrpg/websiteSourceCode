import Vue from "vue";
import Vuex from "vuex";
import api from "@/api/api";
import router from "@/router/index";

Vue.use(Vuex);

// ------------------------- HELPER FUNCTIONS ------------------------- //

function checkResponse(response) {
  if (!response || response.success !== true) {
    if (response.info && response.info.includes("Authentication invalid")) {
      // user has been logged out
      state.isLoggedIn = false;
      localStorage.removeItem("auth");
      state.username = "";
      localStorage.removeItem("username");
      if (router.currentRoute.name !== "Home") {
        router.push({ name: "Home" });
      }
    } else {
      // something went wrong
      console.log(response);
    }
    return false;
  }
  return true;
}

function convertApiCharacter(character) {
  return {
    name: character.name,
    id: character.id,
    agi: parseInt(character.AGI),
    cha: parseInt(character.CHA),
    dex: parseInt(character.DEX),
    int: parseInt(character.INT),
    per: parseInt(character.PER),
    spi: parseInt(character.SPI),
    str: parseInt(character.STR),
    tek: parseInt(character.TEK),
    wis: parseInt(character.WIS),
    hp: parseInt(character.HP),
    maxHp: parseInt(character.MAX_HP),
    mp: parseInt(character.MP),
    maxMp: parseInt(character.MAX_MP),
    vim: parseInt(character.VIM),
    maxVim: parseInt(character.MAX_VIM),
    hero: parseInt(character.HERO),
    maxHero: parseInt(character.MAX_HERO),
    init: parseInt(character.INIT),
    speed: parseInt(character.SPEED),
    xp: parseInt(character.XP),
    sp: parseInt(character.SP),
    armor: parseInt(character.ARMOR),
    gift: character.gift,
    isEnemy: character.is_enemy,
    items: character.items,
    abilities: character.abilities,
  };
}

// ------------------------- STATE ------------------------- //

const state = {
  isLoggedIn: false, // This variable is set in App.vue on loading the website
  username: "", // This variable is set in App.vue on loading the website
  signupErrorMsg: "",
  loginErrorMsg: "",
  characters: {},
  campaigns: [],
  campaignInvites: [],
  character: {},
  searchAbility: "",
  searchAbilitySuggestions: [],
  campaign: {},
  randomNames: [],
  randomNamesDisabled: true,
  pendingApis: {}, // Used to prevent spamming apis
};

const getters = {
  // TODO make some getters when you have something worthwhile to get
  // Maybe put function here to get isLoggedIn, by checking for auth token
};

const mutations = {
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
  clearCharactersList(state) {
    state.characters.clear();
  },
  setCharactersList(state, characters) {
    state.characters = characters;
  },
  setCampaigns(state, campaigns) {
    state.campaigns = campaigns;
  },
  appendToCampains(state, campaign) {
    state.campaigns.push(campaign);
  },
  setCampaignsInvite(state, campaignInvites) {
    state.campaignInvites = campaignInvites;
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
  setCampaign(state, campaign) {
    state.campaign = campaign;
  },
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
  addDisabledToPendingApis(state, name) {
    state.pendingApis[name] = false;
  },
  addApiToPendingApis(state, { name, timeout }) {
    state.pendingApis[name] = Date.now() + timeout;
  },
};

const actions = {
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
    console.log("logging in!");
    if (username === undefined || password === undefined) {
      console.log(
        "Login: username or password were undefined. Username: " +
          username +
          ", Password: " +
          password
      );
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
    console.log("logging out!");
    // could clear auth here before doing api call
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

  // ------------------------- CHARACTER APIS ------------------------- //

  // eslint-disable-next-line no-unused-vars
  createCharacter: ({ commit }, { character, redirectToCharacter }) => {
    return api.createCharacter(character).then((response) => {
      // TODO: Also commit items / weapons here!
      if (checkResponse(response) && redirectToCharacter) {
        router.push({ name: "Character", params: { id: response.id } });
      }
    });
  },

  listCharacters: ({ commit }) => {
    return api.listCharacters().then((response) => {
      if (checkResponse(response) && response.value) {
        const characters = response.value;
        for (const char in characters) {
          characters[char] = convertApiCharacter(characters[char]);
        }
        commit("setCharactersList", characters);
      }
    });
  },

  getCharacter: ({ commit }, id) => {
    return api.getCharacter(id).then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setCharacter", convertApiCharacter(response.value));
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

  lookupAbility: ({ commit, state }, name) => {
    // currently the only api I am specifically making sure we don't hit too hard
    const timeout = state.pendingApis.lookupAbility;
    if (timeout !== undefined && (timeout === false || timeout > Date.now())) {
      return false;
    }
    commit("addDisabledToPendingApis", "lookupAbility");
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
      commit("addApiToPendingApis", { name: "lookupAbility", timeout: 1000 });
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

  // ------------------------- CAMPAIGN APIS ------------------------- //

  createCampaign: ({ commit }, { name, redirectToCampaign }) => {
    return api.createCampaign(name).then((response) => {
      if (checkResponse(response) && response.campaign_id) {
        console.log(response);
        const campaign = { name: name, id: response.campaign_id };
        commit("appendToCampains", campaign);
        if (redirectToCampaign) {
          router.push({
            name: "Campaign",
            params: { campaignId: response.campaign_id },
          });
        }
      }
    });
  },

  listCampaigns: ({ commit }) => {
    return api.listCampaigns().then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setCampaigns", response.value);
      }
    });
  },

  getCampaign: ({ commit }, campaginId) => {
    return api.getCampaign(campaginId).then((response) => {
      if (checkResponse(response) && response.value) {
        commit("setCampaign", response.value);
      }
    });
  },

  listCampaignInvites: ({ commit }) => {
    return api.listCampaignInvites().then((response) => {
      if (checkResponse(response) && response.value) {
        console.log(response);
        commit("setCampaignsInvite", response.value);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  sendCampaignInvite: ({ commit }, { campaginId, username }) => {
    return api.sendCampaignInvite(campaginId, username).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  acceptCampaignInvite: ({ commit }, campaginId) => {
    return api.acceptCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  declineCampaignInvite: ({ commit }, campaginId) => {
    return api.declineCampaignInvite(campaginId).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // eslint-disable-next-line no-unused-vars
  setCampaignRole: ({ commit }, { campaginId, username, role }) => {
    return api.setCampaignRole(campaginId, username, role).then((response) => {
      if (checkResponse(response)) {
        console.log(response);
      }
    });
  },

  // ------------------------- OTHER / RANDOM APIS ------------------------- //

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

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
