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
          <Bullet :character="character" />
          {{ character.name }} - Level: {{ level(character.xp) }}
        </div>
      </router-link>
      <router-link to="/create" class="btn basicBtn link">
        <div class="basicBtnContents">
          <Bullet />
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
import Bullet from '../Common/Bullet.vue'

export default {
  name: 'HomePageLoggedIn',
  components: {
    Bullet
  },
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
    }
  }
}
</script>

<style scoped>
</style>
