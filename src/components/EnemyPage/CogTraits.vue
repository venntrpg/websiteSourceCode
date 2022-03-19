<template>
  <div>
    <div class="alignRow gap labelText">
      Remaining Traits
      <fraction :top="selected.length" :bottom="totalTraits" />
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
      // TODO: Block options if their corresponding weakness was selected
      return [];
    },
  },
  methods: {
    emitNewList(list) {
      this.$emit("newTraitsList", list);
    },
  },
};
</script>
