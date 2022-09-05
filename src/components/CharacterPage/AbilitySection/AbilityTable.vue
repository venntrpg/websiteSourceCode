<template>
  <div class="card column">
    <div class="alignRow tableData tableHeader">
      <div class="abilityName headerFont">
        <b>Ability</b>
      </div>
      <div class="abilityActivation headerFont">
        <b>Activation</b>
      </div>
      <div class="abilityEffect headerFont">
        <b>Effect</b>
      </div>
    </div>
    <div
      v-for="(ability, index) in abilities"
      v-bind:key="index"
      v-bind:id="abilityID(ability)"
      v-bind:class="abilityOpenned(ability) ? 'selected' : ''"
      class="alignRow tableItems"
    >
      <div class="tableData">
        <div class="abilityName">{{ abilityName(ability) }}</div>
        <div class="abilityActivation">
          {{ ability.activation }}
        </div>
        <parse-ability-effect :ability="ability" class="abilityEffect" />
      </div>
      <router-link :to="abilityLink(ability)" class="btn basicBtn link">
        <div class="basicBtnContents">
          <span class="material-icons">{{
            abilityOpenned(ability)
              ? "keyboard_arrow_left"
              : "keyboard_arrow_right"
          }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import ParseAbilityEffect from "../../Common/Abilities/ParseAbilityEffect.vue";
import {
  improveTextForDisplay,
  stringToLinkID,
} from "../../../utils/characterStringFormatting";
export default {
  components: { ParseAbilityEffect },
  name: "AblityTable",
  props: {
    id: {
      type: String,
      required: true,
    },
    abilities: {
      type: Array,
      required: true,
    },
  },
  methods: {
    abilityID(ability) {
      return stringToLinkID(ability.name);
    },
    abilityOpenned(ability) {
      return this.$route.params.detail === ability.name;
    },
    abilityName(ability) {
      return improveTextForDisplay(ability.name);
    },
    abilityLink(ability) {
      if (this.abilityOpenned(ability)) {
        return {
          name: "Character",
          params: { id: this.id, section: this.$route.params.section },
        };
      }
      return {
        name: "Character",
        params: {
          id: this.id,
          section: this.$route.params.section,
          detail: ability.name,
        },
      };
    },
  },
};
</script>

<style scoped>
.abilityName {
  width: 20%;
  font-size: 14pt;
}
.abilityActivation {
  width: 15%;
}
.abilityEffect {
  width: 65%;
}

/* Deep selector effects children */
.abilityEffect >>> p:first-child {
  margin-top: 0px;
  margin-bottom: 0px;
}
.abilityEffect >>> p,
.abilityEffect >>> ul {
  /* reduce margin so we can condense text a bit more */
  margin-top: 5px;
  margin-bottom: 0px;
}

.main.bp750 .abilityName {
  width: 50%;
}
.main.bp750 .abilityActivation {
  width: 50%;
}
.main.bp750 .abilityEffect {
  display: none;
}
</style>
