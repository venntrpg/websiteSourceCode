<template>
  <div>
    <dice-copy-button v-if="combineDice" :dice="dice.discord" />
    <div v-else class="alignRow gap">
      <dice-copy-button :dice="dice.discord" text="Discord" />
      <dice-copy-button :dice="dice.roll20" text="Roll20" />
    </div>
  </div>
</template>

<script>
import DiceCopyButton from "./DiceCopyButton.vue";
import { defaultDice } from "../../../utils/diceUtils";

export default {
  components: { DiceCopyButton },
  name: "DiceCopy",
  props: {
    character: { type: Object, required: true },
    attr: { type: String, required: false },
    settings: { type: Object, default: () => {} },
  },
  computed: {
    dice() {
      return defaultDice(this.character, this.attr, this.settings);
    },
    combineDice() {
      return this.dice.discord === this.dice.roll20;
    },
  },
};
</script>
