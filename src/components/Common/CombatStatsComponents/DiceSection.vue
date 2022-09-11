<template>
  <div>
    <div class="alignRow split">
      <div class="labelText stronger">
        <a
          v-if="isAttribute"
          v-bind:href="getAttrLink"
          target="_blank"
          class="link stealth"
          >{{ attrFullName }}</a
        >
        <span v-else>{{ attrFullName }}</span>
        (
        <span class="number">{{ character[attr] }}</span>
        )
      </div>
      <button
        v-if="!useCopyableDice"
        v-on:click="rollButton"
        class="btn basicBtn noSelect"
      >
        <div class="basicBtnContents">
          <span class="material-icons selected space">casino</span>
          Roll {{ attr.toUpperCase() }}
        </div>
      </button>
    </div>
    <div v-if="!useCopyableDice" class="diceSection mt-8">
      <div v-if="showDice">
        <dice-render :roll="dice" />
        <div>
          Dice Rolled:
          <span class="number">{{ diceNotation }}</span>
        </div>
        <div>
          Average Roll:
          <span class="number">{{ diceAverage }}</span>
        </div>
      </div>
    </div>
    <toggleable-dice-section-copyable v-else :dice="computedDice" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DiceRoll } from "rpg-dice-roller";
import DiceRender from "../Dice/DiceRender.vue";
import { ATTRIBUTES } from "../../../utils/constants";
import { getAttrFullName } from "../../../utils/attributeUtils";
import { defaultDice } from "../../../utils/diceUtils";
import ToggleableDiceSectionCopyable from "../Dice/ToggleableDiceSectionCopyable.vue";

export default {
  components: { DiceRender, ToggleableDiceSectionCopyable },
  name: "DiceSection",
  props: {
    character: Object,
    attr: String,
    useCopyableDice: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState("dice", ["latestRoll", "defaultDiceSettings", "diceDropDown"]),
    attrFullName() {
      return getAttrFullName(this.attr);
    },
    isAttribute() {
      return ATTRIBUTES.includes(this.attr);
    },
    getAttrLink() {
      return `https://vennt.fandom.com/wiki/${
        this.attrFullName
      }_(${this.attr.toUpperCase()})`;
    },
    dice() {
      return this.latestRoll[this.attr];
    },
    showDice() {
      return this.dice !== null && this.dice !== undefined;
    },
    diceNotation() {
      return this.dice.notation;
    },
    diceAverage() {
      return this.dice.averageTotal;
    },
    computedDice() {
      return defaultDice(this.character, this.attr, this.defaultDiceSettings);
    },
  },
  methods: {
    rollButton() {
      this.$store.commit("dice/updateLatestRoll", {
        attr: this.attr,
        roll: new DiceRoll(this.computedDice.web),
      });
    },
  },
};
</script>

<style scoped>
.diceSection {
  min-height: 90px;
}
</style>
