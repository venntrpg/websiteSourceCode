<template>
  <div>
    <cog-toggleable-effects
      :options="options"
      :selected="selected"
      :progressiveOptions="progressiveOptions"
      :disabled="disabledOptions"
      @newSelected="emitNewList"
    />
  </div>
</template>

<script>
import CogToggleableEffects from "./CogToggleableEffects.vue";
import {
  weaknessOptions,
  progressiveWeaknessOptions,
  disabledWeaknesses,
} from "./CogFlowUtils/CogTraitsUtils";

export default {
  components: { CogToggleableEffects },
  name: "CogWeaknesses",
  props: {
    cog: Object,
    selected: Array,
  },
  computed: {
    options() {
      return weaknessOptions(this.cog);
    },
    progressiveOptions() {
      return progressiveWeaknessOptions;
    },
    disabledOptions() {
      return disabledWeaknesses(this.cog);
    },
  },
  methods: {
    emitNewList(list) {
      this.$emit("newWeaknessesList", list);
    },
  },
};
</script>
