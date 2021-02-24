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

  --yellow-300: #eec972;
  --yellow-500: #e6af2e;
  --yellow-600: #e0a51b;

  --bg-color: #f7f7f7;

  /* Background Styles*/
  height: 100vh;
  background-color: var(--bg-color);
}

h1 {
  font-size: 40pt;
  font-weight: 400;
}

.link {
  color: var(--yellow-500);
}
.link:hover {
  color: var(--yellow-600);
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
.mediumPageWidth {
  width: 100%;
  max-width: 500px;
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
  justify-content: center;
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
  text-decoration: none;
}

/* This isn't working - stuck with blue highlights for now I guess */
.noSelect {
  -webkit-tap-highlight-color: transparent;
}
</style>
