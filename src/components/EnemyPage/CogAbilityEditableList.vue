<template>
  <div>
    <h3>Ability Creation</h3>
    <div class="alignRow gap labelText">
      Remaining AP (Action Points):
      <fraction :top="remainingAP" :bottom="totalAP" />
    </div>
    <div v-for="(ability, index) in cogAbilities" v-bind:key="index">
      <div class="card border padded column mb-8 ability">
        <display-basic-ability-details :ability="ability.formatted" />
        <!-- TODO: Can probably remove list and just leave a header and edit / delete buttons 
        since abilities should be listed in the side panel soon -->
        <div class="alignRow end gap">
          <button
            v-on:click="editAbilityButton(index)"
            class="btn roundedButton"
          >
            Edit
          </button>
        </div>
      </div>
      <cog-ability-creation
        v-if="editorsOpen[index]"
        :cog="cog"
        :givenAbility="ability.ability"
        :index="index"
        @createAbility="addAbility"
        @deleteAbility="deleteTempAbility"
      />
    </div>
    <button v-on:click="addAbilityButton" class="btn roundedButton mb-8">
      Add another ability
    </button>
    <cog-ability-creation
      v-if="showNewAbilityPanel"
      :cog="cog"
      @createAbility="addAbility"
      @deleteAbility="deleteTempAbility"
    />
  </div>
</template>

<script>
import DisplayBasicAbilityDetails from "../Common/Abilities/DisplayBasicAbilityDetails.vue";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import CogAbilityCreation from "./CogAbilityCreation.vue";
export default {
  components: { Fraction, CogAbilityCreation, DisplayBasicAbilityDetails },
  name: "CogAbilityEditableList",
  props: {
    cog: Object,
    totalAP: Number,
    cogAbilities: Array,
  },
  data() {
    return {
      showNewAbilityPanel: false,
      editorsOpen: {},
    };
  },
  computed: {
    remainingAP() {
      const totalAPCost = this.cogAbilities.reduce(
        (sum, ability) => sum + ability.formatted.ap,
        0
      );
      return this.totalAP - totalAPCost;
    },
  },
  methods: {
    addAbilityButton() {
      this.showNewAbilityPanel = !this.showNewAbilityPanel;
    },
    addAbility(ability) {
      const abilities = [...this.cogAbilities];
      if (ability.index === -1) {
        abilities.push(ability.data);
        this.showNewAbilityPanel = false;
      } else {
        abilities[ability.index] = ability.data;
        this.editorsOpen[ability.index] = false;
      }
      this.$emit("updateAbilities", abilities);
    },
    deleteTempAbility(index) {
      if (index !== -1) {
        const abilities = [...this.cogAbilities];
        abilities.splice(index, 1);
        this.$emit("updateAbilities", abilities);
        this.editorsOpen[index] = false;
      } else {
        this.showNewAbilityPanel = false;
      }
    },
    editAbilityButton(index) {
      this.editorsOpen[index] = true;
      this.$forceUpdate(); // not ideal, but seems to fix issue
    },
  },
};
</script>

<style scoped>
.labelText {
  font-size: 16pt;
}
.mt-2 {
  margin-top: 2px;
}
.mt-8 {
  margin-top: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.ability {
  padding-top: 0px; /* Padding gets added by header */
}
</style>
