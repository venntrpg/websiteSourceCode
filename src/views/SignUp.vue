<template>
  <div class="signUp page">
    <div v-if="isLoggedIn">
      <h1>SIGN UP</h1>
      <div class="usernameSection">
        <body>
          Enter a username:
        </body>
        <input type="text" name="username" class="smallTopMargin wide" v-model="username">
      </div>
      <div class="password1Section topMargin">
        <body>
          Enter a password:
        </body>
        <input type="password" name="password1" class="smallTopMargin wide" v-model="password1">
      </div>
      <div class="password1Section topMargin">
        <body>
          Re-enter your password:
        </body>
        <input type="password" name="password2" class="smallTopMargin wide" v-model="password2">
      </div>
      <button class="topMargin roundedButton wide">
        SIGN UP
      </button>
    </div>
    <div v-else>
      You are already signed in. Log out?
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      username: '',
      password1: '',
      password2: ''
    }
  },
  computed: {
    ...mapState(['signupSuccess', 'signupErrorMessage']),
    isLoggedIn: function () {
      return localStorage.getItem('auth') !== undefined
    }
  },
  methods: {
    ...mapActions(['signup'])
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
</style>
