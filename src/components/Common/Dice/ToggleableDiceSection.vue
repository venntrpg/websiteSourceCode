<template>
  <div>
    <button v-on:click="toggleUseBuiltinDice" class="btn basicBtn wide">
      <div v-if="useBuiltinDice" class="basicBtnContents">
        <span class="material-icons space">toggle_off</span>
        Show Copy Buttons
      </div>
      <div v-else class="basicBtnContents">
        <span class="material-icons space">toggle_on</span>
        Show Built-in Dice
      </div>
    </button>
    <div class="seperator thin"></div>
    <toggleable-dice-section-rollable
      v-if="useBuiltinDice"
      :dice="parsedDice"
      @rollValue="rollValue"
      class="mt-8 mb-8 ml-8 mr-8"
    />
    <toggleable-dice-section-copyable
      v-else
      :dice="parsedDice"
      class="mt-8 mb-8 ml-8 mr-8"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { diceParseFromString } from "../../../utils/diceUtils";
import ToggleableDiceSectionCopyable from "./ToggleableDiceSectionCopyable.vue";
import ToggleableDiceSectionRollable from "./ToggleableDiceSectionRollable.vue";
export default {
  components: { ToggleableDiceSectionRollable, ToggleableDiceSectionCopyable },
  name: "ToggleableDiceSection",
  props: { dice: { type: String, required: true } },
  data() {
    return { copyDice: false };
  },
  computed: {
    ...mapState("dice", ["defaultDiceSettings", "useBuiltinDice"]),
    parsedDice() {
      return diceParseFromString(this.dice, this.defaultDiceSettings);
    },
  },
  methods: {
    toggleUseBuiltinDice() {
      this.$store.commit("dice/toggleUseBuiltinDice");
    },
    rollValue(value) {
      // pass value up components
      this.$emit("rollValue", value);
    },
  },
};
</script>
