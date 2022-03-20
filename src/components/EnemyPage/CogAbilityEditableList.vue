<template>
  <div>
    <h3>Ability Creation</h3>
    <div class="alignRow gap labelText">
      Spent AP (Action Points):
      <fraction :top="usedAP" :bottom="totalAP" />
    </div>
    <div v-for="(ability, index) in cogAbilities" v-bind:key="index">
      <div class="card padded column mb-8 ability">
        <div class="alignRow split gap">
          <h3>{{ ability.name }}</h3>
          <div class="alignRow gap">
            <button
              v-on:click="editAbilityButton(index)"
              class="btn roundedButton"
            >
              Edit
            </button>
            <confirmation-modal
              :buttonText="'Delete'"
              :buttonClass="'clear'"
              :confStr="'Delete'"
              :details="'Are you sure you want to delete this ability? It will not be saved.'"
              @mainButton="deleteAbility(index)"
            />
          </div>
        </div>
      </div>
      <cog-ability-creation
        v-if="editorsOpen[index]"
        :cog="cog"
        :givenAbility="ability"
        :index="index"
        @createAbility="addAbility"
        @deleteAbility="deleteAbility"
        class="mb-8"
      />
    </div>
    <button v-on:click="addAbilityButton" class="btn roundedButton mb-8">
      Add another ability
    </button>
    <cog-ability-creation
      v-if="showNewAbilityPanel"
      :cog="cog"
      @createAbility="addAbility"
      @deleteAbility="deleteAbility"
    />
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import ConfirmationModal from "../Common/ConfirmationModal.vue";
import CogAbilityCreation from "./CogAbilityCreation.vue";

export default {
  components: { Fraction, CogAbilityCreation, ConfirmationModal },
  name: "CogAbilityEditableList",
  props: {
    cog: Object,
    totalAP: Number,
    usedAP: Number,
    cogAbilities: Array,
  },
  data() {
    return {
      showNewAbilityPanel: false,
      editorsOpen: {},
    };
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
    deleteAbility(index) {
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
      if (this.editorsOpen[index] == true) {
        this.editorsOpen[index] = false;
      } else {
        this.editorsOpen[index] = true;
      }
      this.$forceUpdate(); // not ideal, but seems to fix issue
    },
  },
};
</script>

<style scoped>
.ability {
  /* Padding gets added by header */
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
