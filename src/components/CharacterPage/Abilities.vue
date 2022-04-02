<template>
  <div>
    <h1>Abilities</h1>
    <div v-if="!isEnemy" class="alignRow xpLabel">
      Current XP:
      <fraction :top="usedXP" :bottom="character.xp" class="xpFraction" />
    </div>
    <div v-if="sortedAbilities.length > 0" class="card column">
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
      <div class="seperator thin"></div>
      <div
        v-for="(ability, index) in sortedAbilities"
        v-bind:key="index"
        class="alignRow tableItems"
      >
        <div class="tableData">
          <div class="abilityName">{{ ability.name }}</div>
          <div class="abilityActivation">{{ ability.activation }}</div>
          <parse-ability-effect :ability="ability" class="abilityEffect" />
        </div>
        <router-link
          :to="{
            name: 'Character',
            params: {
              id: character.id,
              section: 'abilities',
              detail: ability.name,
            },
          }"
          class="btn basicBtn link"
        >
          <div class="basicBtnContents">
            <span class="material-icons">keyboard_arrow_right</span>
          </div>
        </router-link>
      </div>
    </div>
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
    <div class="tall"></div>
  </div>
</template>

<script>
// NOTE: could update abilityInput on every change in input with 'v-on:input="abilitySearch()"'

import { mapState } from "vuex";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import ParseAbilityEffect from "../Common/Abilities/ParseAbilityEffect.vue";

export default {
  name: "Abilities",
  components: {
    ParseAbilityEffect,
    Fraction,
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
      return this.character.abilities.reduce((sum, ability) => {
        let cost = parseInt(ability.purchase);
        if (
          ability.expedited &&
          this.character.gift !== "None" &&
          ability.expedited.includes(this.character.gift)
        ) {
          cost = cost / 2;
        }
        return sum + cost;
      }, 0);
    },
    sortedAbilities() {
      if (this.character.abilities === undefined) {
        return [];
      }
      const abilityCopy = this.character.abilities.filter(
        (ability) => ability !== undefined && ability.name !== "NULL"
      );
      return abilityCopy.sort((a1, a2) => {
        // put Passive abilities at the end of the list
        const a1Passive = a1.activation === "Passive";
        const a2Passive = a2.activation === "Passive";
        if (!a1Passive && a2Passive) {
          return -1;
        } else if (a1Passive && !a2Passive) {
          return 1;
        }
        // sort by XP price otherwise (for now at least)
        return parseInt(a1.purchase) - parseInt(a2.purchase);
      });
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

.main.bp500 .abilityInput {
  max-width: 100%;
}
.main.bp500 .addAbilityButton {
  width: calc(100% - 20px);
  margin-top: 8px;
  margin-left: 0px;
}
</style>
