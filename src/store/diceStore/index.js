const state = {
  latestRoll: {
    per: null,
    tek: null,
    agi: null,
    dex: null,
    int: null,
    spi: null,
    str: null,
    wis: null,
    cha: null,
    init: null,
  },
  defaultDiceSettings: {
    flow: false,
    ebb: false,
    rr1s: false,
  },
  diceDropDown: false, // shared between componants to hopefully make the experience feel a bit smoother
};

const mutations = {
  updateLatestRoll(state, { attr, roll }) {
    state.latestRoll[attr] = roll;
  },
  toggleDiceSetting(state, setting) {
    state.defaultDiceSettings[setting] = !state.defaultDiceSettings[setting];
  },
  toggleDiceDropDown(state) {
    state.diceDropDown = !state.diceDropDown;
  },
};

const module = {
  state,
  mutations,
  namespaced: true,
};

export default module;
