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
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

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
  --purple-800: #2b2a3a;
  --purple-900: #201f2b;

  --red-300: #f49c9a;
  --red-500: #ef6f6c;
  --red-600: #ec5855;
  --red-700: #ea423e;

  --yellow-300: #eec972;
  --yellow-500: #e6af2e;
  --yellow-600: #e0a51b;

  --gray-900: #303030;
  --gray-800: #2a2a2a;
  --gray-700: #4d4e50;
  --gray-600: #818181;
  --gray-500: #afafb0;
  --gray-400: #d1d1d1;
  --gray-300: #efefef;
  --gray-200: #f7f7f7;
  --gray-100: #fbfbfb;

  /* Background Styles*/
  min-height: calc(100vh - 42px); /* 42px comes from nav */
  background-color: var(--gray-200);
}

h1 {
  font-size: 40pt;
  font-weight: 400;
}

.link {
  color: black;
}
.link:hover {
  color: var(--red-500);
}
.link:active {
  color: var(--red-700);
}

.page {
  margin-top: 42px; /* 42px to account for the nav */
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

/* General Styles */

.btn {
  border-style: hidden;
  font-family: 'Raleway', sans-serif;
  display: flex;
  cursor: pointer;
  text-decoration: none;
  font-size: inherit;
  padding: 0px;
  box-sizing: inherit;
}
.btn:disabled {
  cursor: default;
}

.roundedButton {
  background-color: var(--red-500);
  border-radius: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 500;
  font-size: 18pt;
  color: white;
  justify-content: center;
}
.roundedButton:disabled {
  background-color: var(--red-300);
}
.roundedButton:hover:not(:disabled) {
  background-color: var(--red-600);
}
.roundedButton:active:not(:disabled) {
  background-color: var(--red-700);
}

.input {
  resize: vertical;
  font-family: 'Raleway', sans-serif;
  font-size: 15px;
  line-height: 16px;
  height: 40px;
  width: 100%;
  border-radius: 5px;
  color: var(--color-ink);
  padding: 12px 10px;
  background-color: white;
  border: 1px solid var(--gray-400);
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.input:hover {
  border: solid 1px var(--gray-500);
}
.input:focus {
  border: solid 1px var(--yellow-600);
}

.card {
  display: flex;
  background-color: white;
  border: 1px solid var(--gray-400);
  border-radius: 10px;
}

/* Nav Styles - useful for subnav styles */

.navButton {
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: var(--purple-500);
  color: white;
  font-weight: 500;
  font-size: 18pt;
}
.navButton:hover {
  background-color: var(--purple-600);
}
.navButton:active {
  background-color: var(--purple-700);
}

.subNav {
  position: fixed;
  top: 42px;
  left: 0;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--purple-700);
  font-size: 18pt;
}
.subNavButton {
  background-color: var(--purple-700);
  height: 32px;
}
.subNavButton:hover {
  background-color: var(--purple-800);
}
.subNavButton:active {
  background-color: var(--purple-900);
}

/* This isn't working - stuck with blue highlights for now I guess */
.noSelect:focus {
  outline:0;
}
</style>
