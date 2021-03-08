<template>
  <div class="nav">
    <div class="left">
      <router-link to="/" class="navButton homeLink">VENNT</router-link>
    </div>
    <div v-if="!isLoggedIn" class="right">
      <router-link to="/login" class="login navButton rightItem notMobile">LOGIN</router-link>
      <router-link to="/signup" class="signup navButton rightItem notMobile">SIGNUP</router-link>
      <!-- TODO: Update this link to be a dropdown with more items (instead of just linking to the login page) -->
      <router-link to="/login" class="login navButton rightItem mobileOnly">
        <MenuSVG class="dropDownLink" />
      </router-link>
    </div>
    <div v-else class="right">
      <div class="logout rightItem">
        <button v-on:click="logout()" class="navButton btn noSelect">LOGOUT</button>
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
  padding-top: 0px;
  padding-bottom: 0px;
  font-family: Copperplate, 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 30pt;
}
.homeLink:hover {
  color: var(--yellow-300);
  background-color: var(--purple-500);
}
.homeLink:active {
  color: var(--yellow-500);
  background-color: var(--purple-500);
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rightItem {
  margin-right: 10px;
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
