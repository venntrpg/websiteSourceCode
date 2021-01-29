<template>
  <div class="largePageWidth">
    <h3>Your Characters</h3>
    <div>(table of characters. If you click on a row in the table it will take you to /character so you can see it.)</div>
    <h3>Your Campaigns</h3>
    <div>(table of campaigns. If you click on a campaign, it will maybe open a new page not sure lol)</div>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'HomePageLoggedIn',
  mounted () {
  },
  methods: {
    ...mapActions(['getTodoTitle'])
  }
}
</script>
