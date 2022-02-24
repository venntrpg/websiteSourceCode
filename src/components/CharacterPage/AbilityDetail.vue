<template>
  <div>
    <div v-if="ability !== undefined">
      <h2>{{ ability.name }}</h2>
      <div class="bottomMargin">
        <i>{{ ability.path }}</i>
      </div>
      <div class="bottomMargin">
        <b>Activation:</b> {{ ability.activation }}
      </div>
      <div class="bottomMargin">
        <p><b>Effect:</b></p>
        <p>
          <i>{{ ability.flavor }}</i>
        </p>
        <parse-ability-effect :ability="ability" />
      </div>
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
import ParseAbilityEffect from "./ParseAbilityEffect.vue";

export default {
  name: "abilityDetail",
  components: { ParseAbilityEffect },
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
    abilityAffectHtml() {
      let result = "";
      let inList = false;
      for (const line of this.ability.effect.split("\n")) {
        if (line.length <= 0) {
          continue;
        }
        if (line.at(0) === "-" && line.length > 1) {
          if (!inList) {
            inList = true;
            result += "<ul>";
          }
          result += "<li>" + line.substring(2) + "</li>";
        } else {
          if (inList) {
            result += "</ul>";
          }
          result += "<p>" + line + "</p>";
        }
      }
      return result;
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
