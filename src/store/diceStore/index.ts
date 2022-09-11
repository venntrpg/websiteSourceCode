import { MutationTree } from "vuex";

const state: DiceState = {
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
  diceDropDown: false, // shared between components to hopefully make the experience feel a bit smoother
  useBuiltinDice: true,
};

const mutations: MutationTree<DiceState> = {
  updateLatestRoll(state, { attr, roll }) {
    state.latestRoll[attr] = roll;
  },
  setDefaultDiceSetting(state, { setting, val }) {
    state.defaultDiceSettings[setting as keyof DiceSettings] = val;
  },
  toggleDiceDropDown(state) {
    state.diceDropDown = !state.diceDropDown;
  },
  toggleUseBuiltinDice(state) {
    state.useBuiltinDice = !state.useBuiltinDice;
  },
};

const module = {
  state,
  mutations,
  namespaced: true,
};

export default module;
