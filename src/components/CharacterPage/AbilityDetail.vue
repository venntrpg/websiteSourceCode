<template>
  <div>
    <div v-if="ability !== undefined">
      <h2>{{ ability.name }}</h2>
      <div class="bottomMargin"><b>Activation:</b> {{ ability.activation }}</div>
      <div class="bottomMargin" v-html="abilityAffectHtml"></div>
      <button v-if="showUseAbilityButton" :disabled="!canUseAbility" class="btn roundedButton wide bottomMargin">Use ability</button>
      <h3>Additional Details</h3>
      <div class="bottomMargin"><b>Cost:</b> {{ ability.purchase }}</div>
      <div v-if="ability.expedited" class="bottomMargin"><b>Expedited for:</b> {{ ability.expedited }}</div>
      <div v-if="ability.unlocks" class="bottomMargin"><b>Unlocks:</b> {{ ability.unlocks }}</div>
      <div v-if="ability.prereq" class="bottomMargin"><b>Prerequisite:</b> {{ ability.prereq }}</div>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this ability ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'abilityDetail',
  computed: {
    ...mapState(['character']),
    ability () {
      if (this.character.abilities === undefined) {
        return undefined
      }
      return this.character.abilities.find(searchAbility => searchAbility.name === this.$route.params.detail)
    },
    abilityAffectHtml () {
      return '<p><b>Effect:</b> ' + this.ability.effect.replaceAll('\n', '</p><p>') + '</p>'
    },
    showUseAbilityButton () {
      return !(this.ability && this.ability.cost && this.ability.cost.Passive)
    },
    canUseAbility () {
      if (this.ability.cost) {
        if (this.ability.cost.M && this.ability.cost.M > this.character.mp) {
          return false
        }
        if (this.ability.cost.V && this.ability.cost.V > this.character.vim) {
          return false
        }
        if (this.ability.cost.P && this.ability.cost.P > this.character.hero) {
          return false
        }
        return true
      }
      return false
    }
  }
}
</script>

<style>
.bottomMargin {
  margin-bottom: 16px;
}
</style>
