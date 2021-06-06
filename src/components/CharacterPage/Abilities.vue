<template>
  <div>
    <h1>Abilities</h1>
    <div v-if="sortedAbilities.length > 0" class="card column">
      <div class="alignRow ability header">
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
      class="alignRow">
        <div class="ability">
          <div class="abilityName">{{ ability.name }}</div>
          <div class="abilityActivation">{{ ability.activation }}</div>
          <div class="abilityEffect">{{ ability.effect }}</div>
        </div>
        <router-link
          :to="{ name: 'Character', params: { id: character.id, section: 'abilities', detail: ability.name }}"
          class="btn basicBtn link">
          <div class="basicBtnContents">
            <RightArrowSVG class="basicBtnSVG" />
          </div>
        </router-link>
      </div>
    </div>
    <h2>Add New Abilities</h2>
    <div class="inputRow">
      <input placeholder="Search Ability" v-on:keyup.enter="abilitySearch()" v-model="abilityField" class="input abilityInput">
      <button v-on:click="abilitySearch()" :disabled="lookupButtonDisabled" class="btn roundedButton addAbilityButton">Lookup</button>
      <button v-on:click="addAbility()" :disabled="abilityButtonDisabled" class="btn roundedButton addAbilityButton">Add ability</button>
    </div>
    <div v-if="showSearchSuggestions" class="card border column">
      <div class="searchTitle">
        Search suggestions:
      </div>
      <div class="searchScrollable">
        <button
        v-for="suggestion in searchAbilitySuggestions"
        v-bind:key="suggestion"
        v-on:click="searchSuggestionButton(suggestion)"
        class="btn basicBtn noSelect wide">
          <div class="basicBtnContents">
            {{ suggestion }}
          </div>
        </button>
      </div>
    </div>
    <div v-if="showSearchResult">
      <div v-html="searchResultHtml"></div>
    </div>
  </div>
</template>

<script>

// TODO: Make button actually do something:
// Option 1. Open up a panel on the left - might look a little weird though with the character stats panel on the right???
// Option 2. Open up a dropdown with more info - could make this page kind of messy, but that might be ok

// NOTE: could update abilityInput on every change in input with 'v-on:input="abilitySearch()"'

import { mapState } from 'vuex'
import RightArrowSVG from '../Common/SVGs/RightArrowSVG.vue'

export default {
  name: 'Abilities',
  components: {
    RightArrowSVG
  },
  data () {
    return {
      abilityField: '',
      lastSearch: ''
    }
  },
  computed: {
    ...mapState(['character', 'searchAbility', 'searchAbilitySuggestions', 'pendingApis']),
    lookupButtonDisabled () {
      return this.abilityField === ''
    },
    abilityButtonDisabled () {
      return this.lookupButtonDisabled ||
      !((this.abilityField === this.lastSearch && this.searchAbility !== '') || (this.searchAbilitySuggestions.includes(this.abilityField))) ||
      this.character.abilities.some(ability => ability.name.replace('\n', '') === this.abilityField)
    },
    showSearchResult () {
      return this.searchAbility !== ''
    },
    showSearchSuggestions () {
      return this.searchAbilitySuggestions.length > 0
    },
    searchResultHtml () {
      return this.searchAbility.replaceAll('\n\n', '<br>')
    },
    sortedAbilities () {
      if (this.character.abilities === undefined) {
        return []
      }
      const abilityCopy = this.character.abilities.filter(ability => ability !== undefined && ability.name !== 'NULL')
      return abilityCopy.sort((a1, a2) => {
        // put Passive abilities at the end of the list
        const a1Passive = a1.activation === 'Passive'
        const a2Passive = a2.activation === 'Passive'
        if (!a1Passive && a2Passive) {
          return -1
        } else if (a1Passive && !a2Passive) {
          return 1
        }
        // sort by XP price otherwise (for now at least)
        return parseInt(a1.purchase) - parseInt(a2.purchase)
      })
    }
  },
  methods: {
    abilitySearch () {
      // would be cool if this automatically looked up input, but we need to be careful not to run into rate limiting issues
      if (this.abilityField !== '' && this.lastSearch !== this.abilityField) {
        // this timeout logic check is duplicated in the store api for now since we can actually do logic off it here
        const timeout = this.pendingApis.lookupAbility
        if (timeout !== undefined && (timeout === false || timeout > Date.now())) {
          return
        }
        this.lastSearch = this.abilityField
        this.$store.dispatch('lookupAbility', this.abilityField)
      }
    },
    addAbility () {
      if (this.abilityField) {
        this.$store.dispatch('addAbility', { id: this.character.id, name: this.abilityField })
      }
    },
    searchSuggestionButton (suggestion) {
      this.abilityField = suggestion
      this.abilitySearch()
    }
  }
}
</script>

<style scoped>

.inputRow {
  display: flex;
}
.abilityInput {
  max-width: 400px;
}
.addAbilityButton {
  width: 200px;
  min-width: 120px;
  margin-left: 16px;
}

.searchTitle {
  margin: 4px;
  font-size: 11pt;
  color: var(--gray-800);
}
.searchScrollable {
  max-height: 260px;
  overflow-y: auto;
}

.alignRow {
  display: flex;
  align-items: center;
}

.header {
  margin-right: 46px;
}

.ability {
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 14pt;
  text-align: left;
  flex-grow: 1;
}
.abilityName {
  width: 20%;
}
.abilityActivation {
  width: 15%;
}
.abilityEffect {
  width: 65%;
  font-size: 12pt;
}

.headerFont {
  font-size: 15pt;
}

.tall {
  height: 64px;
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

.main.bp500 .inputRow {
  display: block;
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
