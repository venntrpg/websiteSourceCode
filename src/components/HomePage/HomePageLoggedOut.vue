<template>
  <div class="mediumPageWidth centeredText">
    <h1 class="logo">VENNT</h1>
    <router-link to="/login" class="btn roundedButton mb-8">LOGIN</router-link>
    <router-link to="/signup" class="btn roundedButton clear mb-8">
      SIGNUP
    </router-link>
    <p>
      The wiki can be found
      <a
        href="https://vennt.fandom.com/wiki/Vennt_Wiki"
        target="_blank"
        class="link"
      >
        here!
      </a>
    </p>
    <p><router-link to="/credits" class="link">Credits</router-link></p>
  </div>
</template>

<style scoped>
.logo {
  font-size: 100pt;
  font-weight: 300;
  color: var(--logo-color);
}

@media screen and (max-width: 500px) {
  /* Make logo scale with page width if the page gets too small */
  .logo {
    font-size: 25vw;
  }
}
</style>
