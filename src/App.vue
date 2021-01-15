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

/* 300 is light, 400 is standard, 700 is bold */
/* Might want to pull in `family=Red+Rose:wght@500` */
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap');

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-family: Copperplate;
  font-size: 40pt;
}

.page {
  display: flex;
  justify-content: center;
}

.roundedButton {
  background-color: #ef6f6c;
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
</style>
