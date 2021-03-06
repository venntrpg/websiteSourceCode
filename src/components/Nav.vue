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
        <MenuSVG class="rightItem dropDownLink" />
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

import MenuSVG from './Common/MenuSVG.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Nav',
  components: {
    MenuSVG
  },
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 42px;
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
  color: var(--yellow-300);
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
