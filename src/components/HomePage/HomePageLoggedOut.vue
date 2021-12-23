<template>
  <div class="mediumPageWidth centered">
    <h1 class="logo">VENNT</h1>
    <router-link to="/login" class="btn roundedButton">LOGIN</router-link>
    <router-link to="/signup" class="btn roundedButton">SIGNUP</router-link>
    <div>
      The wiki can be found
      <a
        href="https://vennt.fandom.com/wiki/Vennt_Wiki"
        target="_blank"
        class="link"
      >
        here!
      </a>
    </div>
  </div>
</template>

<style scoped>
.centered {
  text-align: center;
}
.logo {
  font-size: 100pt;
  font-weight: 300;
  color: var(--yellow-500);
}

.btn {
  margin-bottom: 8px;
}

@media screen and (max-width: 500px) {
  /* Make logo scale with page width if the page gets too small */
  .logo {
    font-size: 25vw;
  }
}
</style>
