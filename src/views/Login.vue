<template>
  <div class="page">
    <form v-if="!isLoggedIn" class="smallPageWidth">
      <h1>LOG IN</h1>
      <div class="usernameSection">
        <label for="login-username">Enter your username:</label>
        <input
          type="text"
          name="username"
          id="login-username"
          placeholder="Username"
          autocomplete="username"
          v-model="fields.username"
          class="input mt-4 wide"
        />
      </div>
      <div class="passwordSection mt-16">
        <label for="login-password">Enter your password:</label>
        <input
          type="password"
          name="password"
          id="login-password"
          placeholder="Password"
          autocomplete="current-password"
          v-model="fields.password"
          v-on:keyup.enter="loginButton()"
          class="input mt-4 wide"
        />
      </div>
      <button
        type="button"
        v-on:click="loginButton()"
        class="btn roundedButton wide noSelect mt-16"
      >
        LOG IN
      </button>
      <div class="mt-16">
        <div class="errorText">{{ getErrorMessage }}</div>
      </div>
    </form>
    <div v-else class="smallPageWidth">You are already signed in. Log out?</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      fields: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["loginErrorMsg", "isLoggedIn"]),
    getErrorMessage() {
      return this.errorMessage === "" ? this.loginErrorMsg : this.errorMessage;
    },
  },
  methods: {
    loginButton() {
      if (this.fields.username === "") {
        this.errorMessage = "Please enter a user name :)";
      } else if (this.fields.password === "") {
        this.errorMessage = "Please enter your password :)";
      } else {
        this.errorMessage = "";
        this.$store.dispatch("login", {
          username: this.fields.username,
          password: this.fields.password,
        });
      }
    },
  },
};
</script>

<style scoped>
.errorText {
  font-size: 10pt;
}
</style>
