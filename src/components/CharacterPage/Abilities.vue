<template>
  <div>
    <h1>Abilities</h1>
    <div class="inputRow">
      <input placeholder="Roll" v-on:input="abilityInput()" v-model="abilityField" class="input abilityInput">
      <button v-on:click="addAbility()" :disabled="abilityButtonDisabled" class="btn roundedButton addAbilityButton">Add ability</button>
    </div>
    <div class="tall"></div>
    <button v-on:click="lookupAbility()" :disabled="abilityButtonDisabled" class="btn roundedButton">Lookup</button>
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
export default {
  name: 'Abilities',
  props: {
    character: Object
  },
  data () {
    return {
      abilityField: ''
    }
  },
  computed: {
    abilityButtonDisabled () {
      return this.abilityField === ''
    }
  },
  methods: {
    abilityInput () {
      // would be cool if this automatically looked up input, but we need to be careful not to run into rate limiting issues
      console.log(this.abilityField)
    },
    lookupAbility () {
      if (this.abilityField) {
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
