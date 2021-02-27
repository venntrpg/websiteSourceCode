<template>
  <div class="page">
    <div v-if="!isLoggedIn" class="smallPageWidth">
      <h1>SIGN UP</h1>
      <div class="usernameSection">
        <div>
          Enter a username:
        </div>
        <input type="text" name="username" placeholder="Username" class="input smallTopMargin wide" v-model="fields.username">
      </div>
      <div class="password1Section topMargin">
        <div>
          Enter a password:
        </div>
        <input type="password" name="password1" placeholder="Password" class="input smallTopMargin wide" v-model="fields.password1">
      </div>
      <div class="password1Section topMargin">
        <div>
          Re-enter your password:
        </div>
        <input type="password" name="password2" placeholder="Verify Password" class="input smallTopMargin wide" v-model="fields.password2">
      </div>
      <button v-on:click="signupButton()" class="topMargin btn roundedButton wide noSelect">SIGN UP</button>
      <div class="topMargin">
        <div v-text="getErrorMessage" class="errorMessage"></div>
      </div>
    </div>
    <div v-else class="smallPageWidth">
      You are already signed in. Log out?
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      fields: {
        username: '',
        password1: '',
        password2: ''
      },
      errorMessage: ''
    }
  },
  computed: {
    ...mapState(['signupErrorMsg', 'isLoggedIn']),
    getErrorMessage () {
      return this.errorMessage === '' ? this.signupErrorMsg : this.errorMessage
    }
  },
  methods: {
    signupButton () {
      if (this.fields.username === '') {
        this.errorMessage = 'You need to choose a user name :)'
      } else if (this.fields.password1 === '' || this.fields.password1 !== this.fields.password2 || this.fields.password1.length < 8) {
        this.errorMessage = 'Make sure your passwords match! They should be longer than 8 characters. Also, please use a unique password (no big security promises here)'
      } else {
        this.errorMessage = ''
        this.$store.dispatch('signup', { username: this.fields.username, password: this.fields.password1 })
      }
    }
  }
}
</script>

<style scoped>
.topMargin {
  margin-top: 15px;
}
.smallTopMargin {
  margin-top: 2px;
}

.wide {
  width: 100%;
}

.errorMessage {
  font-size: 10pt;
  color: var(--red-700);
}
</style>
