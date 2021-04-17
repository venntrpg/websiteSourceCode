<template>
  <div class="largePageWidth">
    <h3>Your Characters</h3>
    <div>
      <router-link
      v-for="(character, id) in characters"
      v-bind:key="id"
      :to="{ name: 'Character', params: { id }}"
      class="btn basicBtn link">
        <div class="basicBtnContents">
          <div v-bind:style="{ 'background-color': charColor(character) }" class="bullet"></div>
          {{ character.name }} - Level: {{ level(character.xp) }}
        </div>
      </router-link>
      <router-link to="/create" class="btn basicBtn link">
        <div class="basicBtnContents">
          <div class="bullet"></div>
          Create or Import a new character
        </div>
      </router-link>
    </div>
    <h3>Your Campaigns</h3>
    <div>(table of campaigns. If you click on a campaign, it will maybe open a new page not sure lol)</div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'HomePageLoggedIn',
  mounted () {
    this.$store.dispatch('listCharacters')
    this.$store.dispatch('listCampaigns')
    // this.$store.dispatch('lookupAbility', 'Roll')
  },
  computed: {
    ...mapState(['characters', 'campagins'])
  },
  methods: {
    level (xp) {
      const level = Math.floor(xp / 1000)
      // if xp < 1000, still return level 1
      return level === 0 ? 1 : level
    },
    charColor (character) {
      const red = character.str + character.agi + character.cha
      const green = character.tek + character.int + character.dex
      const blue = character.wis + character.spi + character.per
      const sum = red + green + blue
      return '#' + this.hexColorComponent(red, sum) + this.hexColorComponent(green, sum) + this.hexColorComponent(blue, sum)
    },
    hexColorComponent (component, sum) {
      if (sum <= 0) {
        sum = 1
      }
      if (component < 0) {
        component = 0
      }
      const numStr = Math.floor((component / sum) * 256).toString(16)
      if (numStr.length === 1) {
        return '0' + numStr
      } else if (numStr.length > 2) {
        return 'ff'
      }
      return numStr
    }
  }
}
</script>

<style scoped>
</style>
