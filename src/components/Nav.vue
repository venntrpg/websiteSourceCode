<template>
  <div class="nav">
    <div class="left">
      <router-link to="/" class="homeLink">VENNT</router-link>
    </div>
    <div v-if="!isLoggedIn" class="right">
      <router-link to="/login" class="login linkButton rightItem notMobile">LOGIN</router-link>
      <router-link to="/signup" class="signup linkButton rightItem notMobile">SIGNUP</router-link>
      <!-- TODO: Update this link to be a dropdown with more items (instead of just linking to the login page) -->
      <router-link to="/login" class="login rightItem mobileOnly">
        <!-- SVG comes from https://material.io/resources/icons/?icon=view_headline&style=baseline -->
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="rightItem dropDownLink">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/>
        </svg>
      </router-link>
    </div>
    <div v-else class="right">
      <div class="logout rightItem">
        <button v-on:click="logout()" class="linkButton btn noSelect">LOGOUT</button>
      </div>
    </div>
  </div>
</template>

<script>

// do router links like
// <router-link to="/">Home</router-link>

// TODO: Replace text with links
// TODO: Make logout button call logout api & redirect to home page

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Nav',
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  background-color: var(--purple-500);
  font-size: 18pt;
}

.homeLink {
  padding-left: 15px;
  padding-right: 15px;
  background-color: var(--purple-500);
  text-decoration: none;
  color: white;
  font-family: Copperplate, 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 30pt;
}
.homeLink:hover {
  color: var(--yellow-400);
}
.homeLink:active {
  color: var(--yellow-500);
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rightItem {
  margin-right: 10px;
}

.linkButton {
  border-radius: 2px;
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: var(--purple-500);
  color: white;
  font-weight: 500;
}
.linkButton:hover,
.dropDownLink:hover {
  background-color: var(--purple-600);
}
.linkButton:active,
.dropDownLink:active {
  background-color: var(--purple-700);
}

.dropDownLink {
  height: 35px;
  width: 35px;
  fill: white;
}

/* Mobile Styles */
.mobileOnly {
  display: none;
}

@media screen and (max-width: 400px) {
  .notMobile {
    display: none;
  }
  .mobileOnly {
    display: flex;
  }
}
</style>
