<template>
  <div>
    <div v-if="ability !== undefined">
      <display-basic-ability-details :ability="ability" />
      <button
        v-if="showUseAbilityButton"
        :disabled="!canUseAbility"
        class="btn roundedButton wide bottomMargin"
      >
        Use ability
      </button>
      <h3>Additional Details</h3>
      <div class="bottomMargin">
        <b>Cost:</b> {{ ability.purchase }}
        <i v-if="actualCost">(Actual cost: {{ actualCost }} XP)</i>
      </div>
      <div v-if="ability.expedited" class="bottomMargin">
        <b>Expedited for:</b> {{ ability.expedited }}
      </div>
      <div v-if="ability.unlocks" class="bottomMargin">
        <b>Unlocks:</b> {{ ability.unlocks }}
      </div>
      <div v-if="ability.partial_unlocks" class="bottomMargin">
        <b>Partially Unlocked:</b> {{ ability.partial_unlocks }}
      </div>
      <div v-if="ability.prereq" class="bottomMargin">
        <b>Prerequisite:</b> {{ ability.prereq }}
      </div>
      <div v-if="ability.not_required" class="bottomMargin">
        This ability is not required for the Path Completion Bonus.
      </div>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this ability ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DisplayBasicAbilityDetails from "../Common/Abilities/DisplayBasicAbilityDetails.vue";

export default {
  name: "abilityDetail",
  components: { DisplayBasicAbilityDetails },
  computed: {
    ...mapState(["character"]),
    ability() {
      if (this.character.abilities === undefined) {
        return undefined;
      }
      return this.character.abilities.find(
        (searchAbility) => searchAbility.name === this.$route.params.detail
      );
    },
    showUseAbilityButton() {
      return !(this.ability && this.ability.cost && this.ability.cost.Passive);
    },
    canUseAbility() {
      if (this.ability && this.ability.cost) {
        if (this.ability.cost.M && this.ability.cost.M > this.character.mp) {
          return false;
        }
        if (this.ability.cost.V && this.ability.cost.V > this.character.vim) {
          return false;
        }
        if (this.ability.cost.P && this.ability.cost.P > this.character.hero) {
          return false;
        }
        return true;
      }
      return false;
    },
    actualCost() {
      if (
        this.ability.expedited &&
        this.character.gift !== "None" &&
        this.ability.expedited.includes(this.character.gift)
      ) {
        return parseInt(this.ability.purchase) / 2;
      }
      return false;
    },
  },
};
</script>

<style>
.bottomMargin {
  margin-bottom: 16px;
}
</style>
