<template>
  <div>
    <h3>Ability Creation</h3>
    <div class="alignRow gap labelText">
      Remaining AP (Action Points):
      <fraction :top="remainingAP" :bottom="totalAP" />
    </div>
    <!-- TODO: List active abilities -->
    <button v-on:click="addAbilityButton" class="btn roundedButton">
      Add another ability
    </button>
    <cog-ability-creation :cog="cog" v-if="showNewAbilityPanel" />
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import CogAbilityCreation from "./CogAbilityCreation.vue";
export default {
  components: { Fraction, CogAbilityCreation },
  name: "CogAbilityEditableList",
  props: {
    cog: Object,
    totalAP: Number,
  },
  data() {
    return {
      showNewAbilityPanel: true,
    };
  },
  computed: {
    remainingAP() {
      // TODO: Subtract AP as they are used
      return this.totalAP;
    },
  },
  methods: {
    addAbilityButton() {
      this.showNewAbilityPanel = !this.showNewAbilityPanel;
    },
  },
};
</script>

<style></style>
