<template>
  <toggleable-dice-section-copyable
    :dice="dice"
    :attr="check.attr"
    class="card column padded thin"
  />
</template>

<script>
import { mapGetters, mapState } from "vuex";
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
    ...mapGetters("character", ["diceToggles"]),
    dice() {
      return defaultDice(
        this.character,
        this.check.attr,
        {
          ...this.defaultDiceSettings,
          end: this.check.bonus,
        },
        this.diceToggles
      );
    },
  },
};
</script>
