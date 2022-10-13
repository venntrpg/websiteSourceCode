<template>
  <toggleable-dice-section-copyable
    :dice="dice"
    class="card column padded thin"
  />
</template>

<script>
import { mapState } from "vuex";
import ToggleableDiceSectionCopyable from "@/components/Common/Dice/ToggleableDiceSectionCopyable.vue";
import { defaultDice } from "@/utils/diceUtils";
export default {
  components: { ToggleableDiceSectionCopyable },
  name: "ItemCheckUse",
  props: {
    item: { type: Object, required: true },
    check: { type: Object, required: true },
  },
  computed: {
    ...mapState("character", ["character"]),
    ...mapState("dice", ["defaultDiceSettings"]),
    dice() {
      return defaultDice(this.character, this.check.attr, {
        ...this.defaultDiceSettings,
        end: this.check.bonus,
      });
    },
  },
};
</script>
