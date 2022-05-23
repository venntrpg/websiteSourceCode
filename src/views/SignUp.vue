<template>
  <div class="page">
    <form v-if="!isLoggedIn" class="smallPageWidth">
      <h1>SIGN UP</h1>
      <div class="usernameSection">
        <label for="signup-username">Enter a username:</label>
        <input
          type="text"
          name="username"
          id="signup-username"
          placeholder="Username"
          autocomplete="username"
          autocorrect="off"
          autocapitalize="none"
          v-model="fields.username"
          class="input mt-4 wide"
        />
      </div>
      <div class="password1Section mt-16">
        <label for="signup-password1">Enter a password:</label>
        <input
          type="password"
          name="password1"
          id="signup-password1"
          placeholder="Password"
          autocomplete="new-password"
          v-model="fields.password1"
          class="input mt-4 wide"
        />
      </div>
      <div class="password1Section mt-16">
        <label for="signup-password2">Verify your password:</label>
        <input
          type="password"
          name="password2"
          id="signup-password2"
          placeholder="Verify Password"
          autocomplete="new-password"
          v-model="fields.password2"
          class="input mt-4 wide"
        />
      </div>
      <button
        type="button"
        v-on:click="signupButton()"
        class="mt-16 btn roundedButton wide noSelect"
      >
        SIGN UP
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
  name: "SignUp",
  data() {
    return {
      fields: {
        username: "",
        password1: "",
        password2: "",
      },
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["signupErrorMsg", "isLoggedIn"]),
    getErrorMessage() {
      return this.errorMessage === "" ? this.signupErrorMsg : this.errorMessage;
    },
  },
  methods: {
    signupButton() {
      if (this.fields.username === "") {
        this.errorMessage = "You need to choose a user name :)";
      } else if (
        this.fields.password1 === "" ||
        this.fields.password1 !== this.fields.password2 ||
        this.fields.password1.length < 8
      ) {
        this.errorMessage =
          "Make sure your passwords match! They should be longer than 8 characters. Also, please use a unique password (no big security promises here)";
      } else {
        this.errorMessage = "";
        this.$store.dispatch("signup", {
          username: this.fields.username,
          password: this.fields.password1,
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
