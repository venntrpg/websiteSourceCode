<template>
  <div class="subNavPage">
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav">
      Todo: put buttons here, also make this horizontally scrollable
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar">
      <CombatStats :character="character" />
    </div>
    <div class="page sideBarPage">
      <div class="largePageWidth main">
        <h1>Character page! Wowzers</h1>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import isUUID from 'is-uuid'
import CombatStats from '../components/CreatePage/CombatStats.vue'

export default {
  name: 'Character',
  components: {
    CombatStats
  },
  data () {
    return {
      id: ''
    }
  },
  beforeMount () {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      this.$router.push({ name: 'Home' })
    }
    this.id = this.$route.params.id
    if (this.id.charAt(0) !== 'C' || !isUUID.v4(this.id.substring(1))) {
      // id is not valid, redirect to Home
      this.$router.push({ name: 'Home' })
    }
  },
  mounted () {
    this.$store.dispatch('getCharacter', this.id)
  },
  computed: {
    ...mapState(['isLoggedIn', 'character'])
  }
}
</script>

<style scoped>
</style>
