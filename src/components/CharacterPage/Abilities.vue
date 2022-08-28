<template>
  <div>
    <h1>Abilities</h1>
    <div v-if="!isEnemy" class="alignRow xpLabel">
      Spent XP:
      <fraction :top="usedXP" :bottom="character.xp" class="xpFraction" />
    </div>
    <ability-table
      v-if="sortedAbilities.length > 0"
      :abilities="sortedAbilities"
      :id="character.id"
    />
    <div v-if="!isEnemy">
      <label for="abiltiy-search"><h2>Add New Abilities</h2></label>
      <div class="alignRow gap">
        <input
          placeholder="Search Ability"
          v-on:keyup.enter="abilitySearch()"
          v-model="abilityField"
          id="abiltiy-search"
          class="input abilityInput"
        />
        <button
          v-on:click="abilitySearch()"
          :disabled="lookupButtonDisabled"
          class="btn basicBtn"
        >
          <div class="basicBtnContents">
            <span class="material-icons space">search</span>
            Search
          </div>
        </button>
      </div>
      <div v-if="showSearchSuggestions" class="card border padded column">
        <div class="searchTitle">Search suggestions:</div>
        <div class="searchScrollable">
          <button
            v-for="suggestion in searchAbilitySuggestions"
            v-bind:key="suggestion"
            v-on:click="searchSuggestionButton(suggestion)"
            class="btn basicBtn noSelect wide"
          >
            <div class="basicBtnContents">
              {{ suggestion }}
            </div>
          </button>
        </div>
      </div>
      <div v-else-if="showSearchResult" class="card border padded column">
        <h4 class="mt-0">Found Result:</h4>
        <p v-html="searchResultHtml"></p>
        <button
          v-on:click="addAbility()"
          :disabled="abilityButtonDisabled"
          class="btn roundedButton addAbilityButton"
        >
          Add ability
        </button>
      </div>
      <div v-else-if="searchAbilityError !== ''" class="errorText mt-8">
        {{ searchAbilityError }}
      </div>
    </div>
  </div>
</template>

<script>
// NOTE: could update abilityInput on every change in input with 'v-on:input="abilitySearch()"'

import { mapGetters, mapState } from "vuex";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import AbilityTable from "./AbilityTable.vue";
import { actualCost } from "../../utils/abilityUtils";
export default {
  name: "Abilities",
  components: {
    Fraction,
    AbilityTable,
  },
  data() {
    return {
      abilityField: "",
      lastSearch: "",
    };
  },
  computed: {
    ...mapState("character", [
      "character",
      "searchAbility",
      "searchAbilitySuggestions",
      "searchAbilityError",
    ]),
    ...mapGetters("character", ["sortedAbilities"]),
    isEnemy() {
      return this.character.id && this.character.id.startsWith("E");
    },
    lookupButtonDisabled() {
      return this.abilityField === "" && this.abilityField === this.lastSearch;
    },
    abilityButtonDisabled() {
      return (
        this.lookupButtonDisabled ||
        !(
          (this.abilityField === this.lastSearch &&
            this.searchAbility !== "") ||
          this.searchAbilitySuggestions.includes(this.abilityField)
        ) ||
        this.character.abilities.some(
          (ability) => ability.name.replace("\n", "") === this.abilityField
        )
      );
    },
    showSearchResult() {
      return this.searchAbility !== "";
    },
    showSearchSuggestions() {
      return this.searchAbilitySuggestions.length > 0;
    },
    searchResultHtml() {
      return this.searchAbility.replaceAll("\n\n", "<br>");
    },
    usedXP() {
      if (!this.character.abilities) {
        return 0;
      }
      return this.character.abilities.reduce(
        (sum, ability) => sum + actualCost(this.character, ability),
        0
      );
    },
  },
  methods: {
    abilitySearch() {
      // would be cool if this automatically looked up input, but we need to be careful not to run into rate limiting issues
      if (this.abilityField !== "" && this.lastSearch !== this.abilityField) {
        this.lastSearch = this.abilityField;
        this.$store.dispatch("character/lookupAbility", this.abilityField);
      }
    },
    addAbility() {
      if (this.abilityField) {
        this.$store.dispatch("character/addAbility", {
          id: this.character.id,
          name: this.abilityField,
        });
        this.abilityField = "";
      }
    },
    searchSuggestionButton(suggestion) {
      this.abilityField = suggestion;
      this.abilitySearch();
    },
  },
};
</script>

<style scoped>
.xpLabel {
  font-size: 16pt;
  margin-bottom: 16px;
}
.xpFraction {
  margin-left: 16px;
}

.abilityInput {
  max-width: 400px;
}
.addAbilityButton {
  width: 200px;
  min-width: 120px;
  margin-left: 8px;
}

.searchTitle {
  margin: 4px;
  font-size: 11pt;
  color: var(--text-muted);
}
.searchScrollable {
  max-height: 260px;
  overflow-y: auto;
}

.main.bp500 .abilityInput {
  max-width: 100%;
}
.main.bp500 .addAbilityButton {
  width: calc(100% - 20px);
  margin-top: 8px;
  margin-left: 0px;
}
</style>
