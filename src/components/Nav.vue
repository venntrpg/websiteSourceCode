<template>
  <div class="nav">
    <div class="left">
      <router-link to="/" class="homeLink">VENNT</router-link>
    </div>
    <div v-if="isLoggedIn" class="right">
      <router-link to="/login" class="login linkButton rightItem">LOGIN</router-link>
      <router-link to="/signup" class="signup linkButton rightItem">SIGNUP</router-link>
    </div>
    <div v-else class="right">
      <div class="logout rightItem">
        LOGOUT
      </div>
    </div>
  </div>
</template>

<script>

// do router links like
// <router-link to="/">Home</router-link>

// TODO: Replace text with links
// TODO: Make logout button call logout api & redirect to home page

export default {
  name: 'Nav',
  computed: {
    isLoggedIn: function () {
      return localStorage.getItem('auth') !== undefined
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  background-color: #4B4A67;
  font-size: 18pt;
}

.homeLink {
  padding-left: 15px;
  padding-right: 15px;
  background-color: #4B4A67;
  text-decoration: none;
  color: white;
  font-family: Copperplate, 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 30pt;
}
.homeLink:hover {
  color: #fce994;
}
.homeLink:active {
  color: #fadf63;
}

.right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rightItem {
  margin-right: 10px;
}

.linkButton {
  border-radius: 20px;
  text-decoration: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: #ef6f6c;
  color: white;
  font-weight: 500;
}
.linkButton:hover {
  background-color: #ec5855;
}
.linkButton:active {
  background-color: #ea423e;
}
</style>
