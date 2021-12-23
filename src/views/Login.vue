<template>
  <div class="page">
    <div v-if="!isLoggedIn" class="smallPageWidth">
      <h1>LOG IN</h1>
      <div class="usernameSection">
        <div>Enter your username:</div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          class="input smallTopMargin wide"
          v-model="fields.username"
        />
      </div>
      <div class="passwordSection topMargin">
        <div>Enter your password:</div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          class="input smallTopMargin wide"
          v-model="fields.password"
        />
      </div>
      <button
        v-on:click="loginButton()"
        class="topMargin btn roundedButton wide noSelect"
      >
        LOG IN
      </button>
      <div class="topMargin">
        <div v-text="getErrorMessage" class="errorMessage"></div>
      </div>
    </div>
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
.topMargin {
  margin-top: 15px;
}
.smallTopMargin {
  margin-top: 2px;
}

.errorMessage {
  font-size: 10pt;
  color: var(--red-700);
}
</style>
