<template>
  <nav class="nav">
    <div class="left">
      <router-link to="/" class="navButton homeLink">VENNT</router-link>
    </div>
    <div v-if="!isLoggedIn" class="right">
      <router-link to="/login" class="login navButton rightItem notMobile">
        LOGIN
      </router-link>
      <router-link to="/signup" class="signup navButton rightItem notMobile">
        SIGNUP
      </router-link>
      <!-- TODO: Update this link to be a dropdown with more items (instead of just linking to the login page) -->
      <router-link to="/login" class="login navButton rightItem mobileOnly">
        <span class="material-icons dropDownLink">menu</span>
      </router-link>
    </div>
    <div v-else class="right">
      <div class="logout rightItem">
        <button v-on:click="logout()" class="navButton btn noSelect">
          LOGOUT
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Nav",
  computed: {
    ...mapState(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  display: flex;
  justify-content: space-between;
  background-color: var(--nav-background);
  font-size: 18pt;
  z-index: 6;
}

.homeLink {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 0px;
  padding-bottom: 0px;
  font-family: var(--logo-font);
  font-weight: 500;
  font-size: 30pt;
}
.homeLink:hover {
  color: var(--home-button-hover);
  background-color: var(--nav-background);
}
.homeLink:active {
  color: var(--home-button-active);
  background-color: var(--nav-background);
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
  font-size: 36px;
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
