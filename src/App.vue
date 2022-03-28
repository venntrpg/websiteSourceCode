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

/* ---------------------------------- STYLES  ----------------------------------*/

body {
  margin: 0 !important;

  --app-font: "Raleway", sans-serif;
  --logo-font: Copperplate, "Raleway", sans-serif;
  --number-font: "roboto", monospace;

  font-family: var(--app-font);
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
  --purple-925: #181820;
  --purple-950: #0f0f14;

  --red-300: #f49c9a;
  --red-400: #f18483;
  --red-500: #ef6f6c;
  --red-600: #ec5855;
  --red-700: #ea423e;

  --dark-red-600: #d66260;
  --dark-red-700: #b0514f;
  --dark-red-800: #703432;

  --yellow-300: #eec972;
  --yellow-500: #e6af2e;
  --yellow-600: #e0a51b;

  --gray-900: #303030;
  --gray-800: #2a2a2a;
  --gray-750: #3c3d3f;
  --gray-700: #4d4e50;
  --gray-650: #636466;
  --gray-600: #818181;
  --gray-550: #949191;
  --gray-500: #afafb0;
  --gray-400: #d1d1d1;
  --gray-300: #efefef;
  --gray-250: #f4f4f4;
  --gray-200: #f7f7f7;
  --gray-100: #fbfbfb;

  /* THEME SETTINGS */

  --background: var(--gray-250);
  --background-highlight: white;
  --background-high-contrast: var(--gray-900);

  --nav-background: var(--purple-500);
  --nav-button-hover: var(--purple-600);
  --nav-button-active: var(--purple-700);
  --sub-nav-background: var(--purple-700);
  --sub-nav-button-hover: var(--purple-800);
  --sub-nav-button-active: var(--purple-900);
  --home-button-hover: var(--yellow-300);
  --home-button-active: var(--yellow-500);

  --main-button: var(--red-500);
  --main-button-disabled: var(--red-300);
  --main-button-hover: var(--red-600);
  --main-button-active: var(--red-700);
  --secondary-button: var(--purple-400);
  --secondary-button-disabled: var(--purple-300);
  --secondary-button-hover: var(--purple-600);
  --secondary-button-active: var(--purple-700);
  --basic-button-disabled: var(--gray-500);
  --basic-button-hover: var(--gray-300);
  --basic-button-active: var(--gray-400);

  --text: black;
  --text-error: var(--red-600);
  --link-hover: var(--red-500);
  --link-active: var(--red-700);
  --text-muted: var(--gray-800);
  --text-contrast: white;
  --link-contrast-hover: var(--red-300);
  --link-contrast-active: var(--red-500);
  --logo-color: var(--yellow-500);

  --border: var(--gray-400);
  --border-hover: var(--gray-500);
  --border-focus: var(--yellow-600);
  --border-error: var(--red-300);
  --border-error-hover: var(--red-500);
  --border-error-focus: var(--red-700);
  --border-contrast: var(--gray-700);

  --table-contrast: var(--gray-200);

  /* HEIGHTS / WIDTHS */
  --nav-height: 42px;
  --sub-nav-height: 38px;
  --total-nav-height: calc(var(--nav-height) + var(--sub-nav-height));
  --page-height: calc(100vh - var(--nav-height));
  --sub-nav-page-height: calc(100vh - var(--total-nav-height));
  --sidebar-width: 400px;

  background-color: var(--background);
  color: var(--text);
}

@media (prefers-color-scheme: dark) {
  body {
    --background: var(--purple-950);
    --background-highlight: var(--purple-900);

    --nav-background: var(--purple-600);
    --nav-button-hover: var(--purple-700);
    --nav-button-active: var(--purple-800);
    --sub-nav-background: var(--purple-800);
    --sub-nav-button-hover: var(--purple-900);
    --sub-nav-button-active: var(--purple-925);

    --text: var(--gray-250);
    --text-muted: var(--gray-550);
    --logo-color: var(--yellow-600);

    --main-button: var(--dark-red-600);
    --main-button-hover: var(--dark-red-700);
    --main-button-active: var(--dark-red-800);
    --secondary-button: var(--purple-500);
    --secondary-button-disabled: var(--purple-400);
    --secondary-button-hover: var(--purple-600);
    --secondary-button-active: var(--purple-700);
    --basic-button-disabled: var(--gray-700);
    --basic-button-hover: var(--purple-800);
    --basic-button-active: var(--purple-700);

    --border: var(--gray-750); /* Could maybe be 700 for better visiblity */
    --border-hover: var(--gray-650);
    --border-error: var(--red-500);
    --border-error-hover: var(--red-600);
    --border-contrast: var(--gray-800);

    --table-contrast: var(--purple-925);
  }
}

#app {
  /* Background Styles */
  min-height: var(--page-height);
  background-color: var(--background);
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
  font-family: var(--number-font);
  font-weight: 400;
}

.link {
  color: var(--text);
}
.link:hover {
  color: var(--link-hover);
}
.link:active {
  color: var(--link-active);
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

.errorText {
  color: var(--text-error);
}

.labelText {
  font-size: 16pt;
}

/* Margin Utilities */

.mt-0 {
  margin-top: 0px;
}
.mt-2 {
  margin-top: 2px;
}
.mt-8 {
  margin-top: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.mb-16 {
  margin-bottom: 16px;
}

.wide {
  width: 100%;
}

/* Button Styles */

.btn {
  border-style: hidden;
  font-family: var(--app-font);
  color: var(--text);
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
  background-color: var(--main-button);
  border: solid 2px var(--main-button);
  border-radius: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 500;
  font-size: 18pt;
  color: var(--text-contrast);
  justify-content: center;
  height: 29px;
}
.roundedButton:disabled {
  background-color: var(--main-button-disabled);
  border: solid 2px var(--main-button-disabled);
}
.roundedButton:hover:not(:disabled) {
  background-color: var(--main-button-hover);
  border: solid 2px var(--main-button-hover);
}
.roundedButton:active:not(:disabled) {
  background-color: var(--main-button-active);
  border: solid 2px var(--main-button-active);
}
.roundedButton.clear {
  color: var(--main-button);
  background-color: transparent;
}
.roundedButton.clear:disabled {
  opacity: 0.65;
  color: var(--main-button-disabled);
  background-color: transparent;
}
.roundedButton.clear:hover:not(:disabled) {
  background-color: var(--main-button-hover);
  border: solid 2px var(--main-button-hover);
  color: var(--text-contrast);
}
.roundedButton.clear:active:not(:disabled) {
  background-color: var(--main-button-active);
  border: solid 2px var(--main-button-active);
  color: var(--text-contrast);
}
.roundedButton.purple {
  background-color: var(--secondary-button);
  border: solid 2px var(--secondary-button);
}
.roundedButton.purple:disabled {
  background-color: var(--secondary-button-disabled);
  border: solid 2px var(--secondary-button-disabled);
}
.roundedButton.purple:hover:not(:disabled) {
  background-color: var(--secondary-button-hover);
  border: solid 2px var(--secondary-button-hover);
}
.roundedButton.purple:active:not(:disabled) {
  background-color: var(--secondary-button-active);
  border: solid 2px var(--secondary-button-active);
}
.roundedButton.wide {
  width: calc(100% - 24px);
}

.basicBtn {
  background-color: transparent;
  border-radius: 10px;
  color: var(--text);
}
.basicBtn:disabled {
  color: var(--basic-button-disabled);
}
.basicBtn:hover:not(:disabled) {
  background-color: var(--basic-button-hover);
}
.basicBtn:active:not(:disabled) {
  background-color: var(--basic-button-active);
}
.basicBtn.link {
  color: var(--text);
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
  color: var(--main-button);
}
.basicBtn:disabled .material-icons.selected {
  color: var(--basic-button-disabled);
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
  font-family: var(--app-font);
  font-size: 15px;
  line-height: 16px;
  height: 40px;
  width: 100%;
  border-radius: 5px;
  color: var(--text);
  padding: 12px 10px;
  background-color: var(--background-highlight);
  border: 1px solid var(--border);
  outline: none;
  box-shadow: none;
  appearance: none;
  box-sizing: border-box;
}
.input:hover {
  border: solid 1px var(--border-hover);
}
.input:focus {
  border: solid 1px var(--border-focus);
}
.input.invalid {
  border: solid 1px var(--border-error);
}
.input.invalid:hover {
  border: solid 1px var(--border-error-hover);
}
.input.invalid:focus {
  border: solid 1px var(--border-error-focus);
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
  background-color: var(--background-highlight);
  border-radius: 5px;
}
.card.padded {
  padding: 16px;
}
.card.border {
  border: 1px solid var(--border);
}
.card.column {
  flex-direction: column;
}
.card.selectable {
  border: 1px solid var(--background-highlight);
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
  background-color: var(--border);
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
.alignRow.split {
  justify-content: space-between;
}
.alignRow.end {
  justify-content: end;
}

.tableItems {
  background-color: var(--background-highlight);
}
.tableItems:nth-child(even) {
  background-color: var(--table-contrast);
}

/* A little bit janky way to delay animation */
@keyframes appear {
  from {
    opacity: 0;
  }

  80% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Tool tip functionality */
.toolTip {
  display: none;
  position: absolute;
  margin-top: 40px;
  margin-left: -24px;
  max-width: 220px;
  background-color: var(--background-high-contrast);
  color: var(--text-contrast);
  font-size: 13pt;
  border-radius: 5px;
  padding: 8px;
  z-index: 5;
}

.toolTip.wide {
  max-width: 360px;
}

.toolTip:hover,
.toolTipTrigger:hover > .toolTip {
  display: block;
  opacity: 1;
  animation-duration: 2s;
  animation-name: appear;
}

.toolTip a {
  color: var(--text-contrast);
}
.toolTip a:hover {
  color: var(--link-contrast-hover);
}
.toolTip a:active {
  color: var(--link-contrast-active);
}

/* Nav Styles - useful for subnav styles */

.navButton {
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  background-color: var(--nav-background);
  color: var(--text-contrast);
  font-weight: 500;
  font-size: 18pt;
  line-height: normal;
}
.navButton:hover {
  background-color: var(--nav-button-hover);
}
.navButton:active {
  background-color: var(--nav-button-active);
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
  background-color: var(--sub-nav-background);
  font-size: 18pt;
  z-index: 5;
}
.subNavButton {
  background-color: var(--sub-nav-background);
  height: 32px;
}
.subNavButton:hover {
  background-color: var(--sub-nav-button-hover);
}
.subNavButton:active {
  background-color: var(--sub-nav-button-active);
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
