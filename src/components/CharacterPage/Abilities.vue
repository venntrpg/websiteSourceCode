<template>
  <div>
    <h1>Abilities</h1>
    <div class="inputRow">
      <input placeholder="Roll" v-on:keyup.enter="abilitySearch()" v-model="abilityField" class="input abilityInput">
      <button v-on:click="addAbility()" :disabled="abilityButtonDisabled" class="btn roundedButton addAbilityButton">Add ability</button>
    </div>
    <div v-if="showSearchResult">
      Description:
      {{ searchAbility }}
    </div>
    <div v-if="showSearchSuggestions">
      Search suggestions:
      {{ searchAbilitySuggestions }}
    </div>
    <div class="tall"></div>
    <button v-on:click="abilitySearch()" :disabled="abilityButtonDisabled" class="btn roundedButton">Lookup</button>
    <div>
      <div
      v-for="(ability, index) in character.abilities"
      v-bind:key="index">
        {{ ability.name }}
      </div>
    </div>
  </div>
</template>

<script>

// NOTE: could update abilityInput on every change in input with 'v-on:input="abilitySearch()"'

import { mapState } from 'vuex'

export default {
  name: 'Abilities',
  data () {
    return {
      abilityField: '',
      lastSearch: ''
    }
  },
  computed: {
    ...mapState(['character', 'searchAbility', 'searchAbilitySuggestions', 'pendingApis']),
    abilityButtonDisabled () {
      return this.abilityField === ''
    },
    showSearchResult () {
      return this.searchAbility !== ''
    },
    showSearchSuggestions () {
      return this.searchAbilitySuggestions.length > 0
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
  margin-left: 16px;
}

.tall {
  height: 64px;
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
