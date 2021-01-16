<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  components: {
    Nav
  }
}
</script>

<style>
/* Global styles live here! */

/* FONTS */

/* 300 is light, 400 is standard, 700 is bold */
/* Might want to pull in `family=Red+Rose:wght@500` */
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap');

/* STYLES */

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* COLORS */
  --purple-500: #4b4a67;
  --purple-600: #403f58;
  --purple-700: #353549;

  --red-500: #ef6f6c;
  --red-600: #ec5855;
  --red-700: #ea423e;

  --yellow-400: #fce994;
  --yellow-500: #fadf63;
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
  max-width: 300px;
}

.roundedButton {
  background-color: var(--red-500);
  border-radius: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 18pt;
  font-weight: 500;
  color: white;
  cursor: pointer;
  border-style: none;
}
.roundedButton:hover {
  background-color: var(--red-600);
}
.roundedButton:active {
  background-color: var(--red-700);
}

.noSelect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
