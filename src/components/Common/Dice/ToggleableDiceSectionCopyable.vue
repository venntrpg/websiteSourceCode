<template>
  <div>
    <dice-copy :dice="dice" class="mb-4" />
    <drop-down :title="'Other Dice Options'" :useDiceToggle="true">
      <div class="labelText mt-8 ml-8">Hero Point boost:</div>
      <div class="alignRow split">
        <dice-copy :dice="heroPointDice" />
        <hero-point-button :reason="'Boosted dice roll'" />
      </div>
      <common-dice-settings />
    </drop-down>
  </div>
</template>

<script>
import DiceCopy from "./DiceCopy.vue";
import CommonDiceSettings from "./CommonDiceSettings.vue";
import DropDown from "../DropDown.vue";
import HeroPointButton from "../HeroPointButton.vue";
import { buildDice } from "../../../utils/diceUtils";
export default {
  components: { DiceCopy, DropDown, CommonDiceSettings, HeroPointButton },
  name: "ToggleableDiceSectionCopyable",
  props: { dice: { type: Object, required: true } },
  computed: {
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
};
</script>
