<template>
  <div>
    <div class="stickyHeader thin">
      <div class="alignRow gap labelText">
        Remaining Trait Selections:
        <fraction :top="totalTraits - selected.length" :bottom="totalTraits" />
      </div>
    </div>
    <cog-toggleable-effects
      :options="options"
      :selected="selected"
      :mutuallyExclusive="mutuallyExclusiveOptions"
      :progressiveOptions="progressiveOptions"
      :disabled="disabledOptions"
      :maxSelections="totalTraits"
      @newSelected="emitNewList"
    />
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import CogToggleableEffects from "./CogToggleableEffects.vue";
import {
  traitOptions,
  progressiveTraitOptions,
  disabledTraits,
} from "./CogFlowUtils/CogTraitsUtils";

export default {
  components: { Fraction, CogToggleableEffects },
  name: "CogTraits",
  props: {
    cog: Object,
    totalTraits: Number,
    selected: Array,
  },
  computed: {
    options() {
      return traitOptions(this.cog);
    },
    mutuallyExclusiveOptions() {
      return [["Small I", "Large I"]];
    },
    progressiveOptions() {
      return progressiveTraitOptions;
    },
    disabledOptions() {
      return disabledTraits(this.cog);
    },
  },
  methods: {
    emitNewList(list) {
      this.$emit("newTraitsList", list);
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 800px) {
  .stickyHeader {
    top: var(--total-nav-height);
  }
}
</style>
