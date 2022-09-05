<template>
  <div>
    <button v-on:click="rollButton" class="btn basicBtn wide">
      <div class="basicBtnContents">
        <span class="material-icons selected space">casino</span>
        Roll {{ dice.web }}
      </div>
    </button>
    <dice-render v-if="showRoll" :roll="roll" class="mt-8" />
    <div v-else class="dice-placeholder" />
    <drop-down :title="'Other Dice Options'" :useDiceToggle="true">
      <div class="alignRow">
        <button v-on:click="rollHeroButton" class="btn basicBtn wide">
          <div class="basicBtnContents">
            <span class="material-icons selected space">casino</span>
            Hero point boost
          </div>
        </button>
        <hero-point-button :reason="'Boosted dice roll'" />
      </div>
      <common-dice-settings />
    </drop-down>
  </div>
</template>

<script>
import { DiceRoll } from "rpg-dice-roller";
import DiceRender from "./DiceRender.vue";
import { buildDice } from "../../../utils/diceUtils";
import DropDown from "../DropDown.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import HeroPointButton from "../HeroPointButton.vue";
export default {
  components: { DiceRender, DropDown, CommonDiceSettings, HeroPointButton },
  name: "ToggleableDiceSectionRollable",
  props: { dice: { type: Object, required: true } },
  data() {
    return {
      roll: undefined,
    };
  },
  computed: {
    showRoll() {
      return (
        this.roll !== null &&
        this.roll !== undefined &&
        [this.dice.web, this.heroPointDice.web].includes(this.roll.notation)
      );
    },
    heroPointDice() {
      return buildDice(
        this.dice.settings.count,
        this.dice.settings.sides,
        this.dice.settings.adjust,
        {
          ...this.dice.settings,
          drop: 1,
          end: "+9",
        }
      );
    },
  },
  methods: {
    rollButton() {
      this.roll = new DiceRoll(this.dice.web);
      this.$emit("rollValue", this.roll.total);
    },
    rollHeroButton() {
      this.roll = new DiceRoll(this.heroPointDice.web);
      this.$emit("rollValue", this.roll.total);
    },
  },
};
</script>

<style scoped>
.dice-placeholder {
  height: 51px;
}
</style>
