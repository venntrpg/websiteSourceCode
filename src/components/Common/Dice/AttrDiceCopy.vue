<template>
  <dice-copy :dice="dice" />
</template>

<script>
import DiceCopy from "./DiceCopy.vue";
import { defaultDice } from "../../../utils/diceUtils";

export default {
  name: "AttrDiceCopy",
  components: { DiceCopy },
  props: {
    character: { type: Object, required: true },
    attr: { type: String, required: false },
    settings: { type: Object, default: () => {} },
  },
  computed: {
    dice() {
      return defaultDice(this.character, this.attr, this.settings);
    },
  },
};
</script>
