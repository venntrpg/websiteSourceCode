<template>
  <div>
    <h3>Ability Creation</h3>
    <div class="alignRow gap labelText">
      Remaining AP (Action Points):
      <fraction :top="remainingAP" :bottom="totalAP" />
    </div>
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
export default {
  components: { Fraction },
  name: "CogAbilityCreation",
  props: {
    cog: Object,
  },
  computed: {
    totalAP() {
      if (!this.cog.level) {
        return 0;
      }
      const level = parseInt(this.cog.level);
      let ap = level * 2;
      if (this.cog.template === "mook") {
        ap = level;
      }
      return ap;
    },
    remainingAP() {
      // TODO: Subtract AP as they are used
      return this.totalAP;
    },
  },
};
</script>

<style>
.labelText {
  font-size: 16pt;
}
</style>
