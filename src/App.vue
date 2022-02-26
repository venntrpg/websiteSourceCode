<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from "./components/Nav.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    Nav,
  },
  // This sets the isLoggedIn parameter if we have already logged in but the page was refreshed
  beforeMount() {
    if (localStorage.getItem("auth") !== null) {
      this.setIsLoggedIn(true);
    }
    const username = localStorage.getItem("username");
    if (username !== null) {
      this.setUsername(username);
    }
  },
  methods: {
    ...mapMutations(["setIsLoggedIn", "setUsername"]),
  },
};
</script>

<style>
/* Global styles live here! */

/* FONTS */

/* 300 is light, 400 is standard, 700 is bold */
/* Might want to pull in `family=Red+Rose:wght@500` as backup for Copperplate */
/* Roboto Mono is for dice etc */
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Roboto:wght@300;400;500&display=swap");

/* STYLES */

body {
  margin: 0 !important;

  font-family: "Raleway", sans-serif;
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
  --gray-250: #f4f4f4;
  --gray-200: #f7f7f7;
  --gray-100: #fbfbfb;

  /* HEIGHTS / WIDTHS */
  --nav-height: 42px;
  --sub-nav-height: 38px;
  --total-nav-height: calc(var(--nav-height) + var(--sub-nav-height));
  --page-height: calc(100vh - var(--nav-height));
  --sub-nav-page-height: calc(100vh - var(--total-nav-height));
  --sidebar-width: 400px;

  background-color: var(--gray-250);
}

#app {
  /* Background Styles */
  min-height: var(--page-height);
  background-color: var(--gray-250);
}

/* Page Descriptors */

.page {
  margin-top: var(--nav-height);
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

/* Typography */

h1 {
  font-size: 40pt;
  font-weight: 400;
  line-height: 1;
}

.centeredText {
  text-align: center;
}

.number {
  font-family: "roboto", monospace;
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
.link.stealth {
  text-decoration: none;
}
.link.stealth:hover {
  text-decoration: underline;
}

p,
i,
b,
a,
label,
li {
  line-height: 1.35;
}

ul {
  list-style-type: circle;
}

.nowrap {
  white-space: nowrap;
}

.textBlock {
  max-width: 75ch; /* 75 character limit for legibility */
}

.pt-12 {
  font-size: 12pt;
}

/* Button Styles */

.btn {
  border-style: hidden;
  font-family: "Raleway", sans-serif;
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
.btn.wide {
  width: 100%;
}

.roundedButton {
  background-color: var(--red-500);
  border: solid 2px var(--red-500);
  border-radius: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 500;
  font-size: 18pt;
  color: white;
  justify-content: center;
  height: 29px;
}
.roundedButton:disabled {
  background-color: var(--red-300);
  border: solid 2px var(--red-300);
}
.roundedButton:hover:not(:disabled) {
  background-color: var(--red-600);
  border: solid 2px var(--red-600);
}
.roundedButton:active:not(:disabled) {
  background-color: var(--red-700);
  border: solid 2px var(--red-700);
}
.roundedButton.clear {
  color: var(--red-500);
  background-color: transparent;
}
.roundedButton.clear.disabled {
  opacity: 0.65;
  background-color: transparent;
}
.roundedButton.clear:hover:not(:disabled) {
  background-color: var(--red-500);
  border: solid 2px var(--red-500);
  color: white;
}
.roundedButton.clear:active:not(:disabled) {
  background-color: var(--red-700);
  border: solid 2px var(--red-700);
  color: white;
}
.roundedButton.wide {
  width: calc(100% - 24px);
}

.basicBtn {
  background-color: transparent;
  border-radius: 10px;
  fill: black;
  color: black;
}
.basicBtn:disabled {
  fill: var(--gray-500);
  color: var(--gray-500);
}
.basicBtn:hover:not(:disabled) {
  background-color: var(--gray-300);
}
.basicBtn:active:not(:disabled) {
  background-color: var(--gray-400);
}
.basicBtn.link {
  color: black;
}
.basicBtnContents {
  display: flex;
  align-items: center;
  margin: 8px;
  font-size: 14pt;
  text-align: left;
}
.basicBtnContents.skinny {
  margin: 4px;
}

/* Override material icons size definition as button icon */
.material-icons {
  font-size: 30px;
}
.basicBtn .material-icons.selected {
  color: var(--red-500);
}
.basicBtn:disabled .material-icons.selected {
  color: var(--gray-500);
}
.material-icons.space {
  margin-right: 8px;
}

/*
.noSelect:focus {
  outline: 0;
}
*/

/* Input Styles */

.input {
  resize: vertical;
  font-family: "Raleway", sans-serif;
  font-size: 15px;
  line-height: 16px;
  height: 40px;
  width: 100%;
  border-radius: 5px;
  color: black;
  padding: 12px 10px;
  background-color: white;
  border: 1px solid var(--gray-400);
  outline: none;
  box-shadow: none;
  appearance: none;
  box-sizing: border-box;
}
.input:hover {
  border: solid 1px var(--gray-500);
}
.input:focus {
  border: solid 1px var(--yellow-600);
}
.input.invalid {
  border: solid 1px var(--red-300);
}
.input.invalid:hover {
  border: solid 1px var(--red-500);
}
.input.invalid:focus {
  border: solid 1px var(--red-700);
}
.input.wide {
  width: 100%;
}
.input.shortenned {
  max-width: 400px;
}
.input.tiny {
  max-width: 80px;
}
.input.textInput {
  height: 88px;
  line-height: 24px;
}

/* Component Styles */

.card {
  display: flex;
  background-color: white;
  border-radius: 5px;
}
.card.padded {
  padding: 16px;
}
.card.border {
  border: 1px solid var(--gray-400);
}
.card.column {
  flex-direction: column;
}
.card.selectable {
  border: 1px solid white;
}
.card.selectable:hover {
  border: 1px solid var(--yellow-300);
}
.card.selectable.selected {
  border: 1px solid var(--red-600);
}

.seperator {
  height: 2px;
  width: 100%;
  background-color: var(--gray-400);
}
.seperator.thin {
  height: 1px;
}

.tall {
  height: 64px;
}

.alignRow {
  display: flex;
  align-items: center;
}
.alignRow.gap {
  gap: 8px;
}

.tableItems {
  background-color: white;
}
.tableItems:nth-child(even) {
  background-color: var(--gray-200);
}

/* Nav Styles - useful for subnav styles */

.navButton {
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  background-color: var(--purple-500);
  color: white;
  font-weight: 500;
  font-size: 18pt;
  line-height: normal;
}
.navButton:hover {
  background-color: var(--purple-600);
}
.navButton:active {
  background-color: var(--purple-700);
}

.subNav {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  width: 100%;
  height: var(--sub-nav-height);
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

/* Left Sidebar Styles */

.sideBar {
  position: fixed;
  z-index: 2;
  top: var(--nav-height);
  left: 0;
  overflow-x: hidden;
  width: var(--sidebar-width);
  height: var(--page-height);
  overflow-y: auto;
  -webkit-box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
}
.sideBar.right {
  left: auto;
  right: 0;
  z-index: 1;
}
.sideBar.hidden,
.sideBar.right:not(.rightVisible) {
  display: none;
}

.sideBarPage {
  margin-left: var(--sidebar-width);
}
.sideBarPage.rightVisible {
  margin-right: var(--sidebar-width);
}
.sideBarPage.hidden {
  margin-left: 0px;
}

.subNavPage .sideBar {
  top: var(--total-nav-height);
  height: var(--sub-nav-page-height);
}
.subNavPage .page {
  margin-top: var(--total-nav-height);
}
</style>
