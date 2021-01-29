<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    Nav
  },
  // This sets the isLoggedIn parameter if we have already logged in but the page was refreshed
  beforeMount () {
    if (localStorage.getItem('auth') !== null) {
      this.setIsLoggedIn(true)
    }
  },
  methods: {
    ...mapMutations(['setIsLoggedIn'])
  }
}
</script>

<style>
/* Global styles live here! */

/* FONTS */

/* 300 is light, 400 is standard, 700 is bold */
/* Might want to pull in `family=Red+Rose:wght@500` as backup for Copperplate */
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap');

/* STYLES */

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* COLORS */
  /* Originally came from https://coolors.co/7e8987-4b4a67-fadf63-e6af2e-ef6f6c */
  --purple-300: #615f85;
  --purple-400: #565576;
  --purple-500: #4b4a67;
  --purple-600: #403f58;
  --purple-700: #353549;

  --red-500: #ef6f6c;
  --red-600: #ec5855;
  --red-700: #ea423e;

  --yellow-400: #fce994;
  --yellow-500: #fadf63;

  --yellow-rod-400: #E6AF2E;

  height: 100vh;
  background: var(--purple-300);
}

h1 {
  font-family: Copperplate;
  font-size: 40pt;
}

.page {
  display: flex;
  justify-content: center;
}
.smallPageWidth {
  width: 100%;
  max-width: 300px;
  margin-left: 20px;
  margin-right: 20px;
}
.largePageWidth {
  width: 100%;
  max-width: 1050px;
  margin-left: 20px;
  margin-right: 20px;
}

.roundedButton {
  background-color: var(--red-500);
  border-radius: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
}
.roundedButton:hover {
  background-color: var(--red-600);
}
.roundedButton:active {
  background-color: var(--red-700);
}

.btn {
  font-weight: 500;
  border-style: hidden;
  font-family: 'Raleway', sans-serif;
  display: flex;
  cursor: pointer;
  font-size: 18pt;
}

/* This isn't working - stuck with blue highlights for now I guess */
.noSelect {
  -webkit-tap-highlight-color: transparent;
}
</style>
