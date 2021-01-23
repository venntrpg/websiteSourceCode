import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'
import router from '@/router/index'

Vue.use(Vuex)

const state = {
  isLoggedIn: false,
  username: '',
  signupErrorMsg: '',
  loginErrorMsg: ''
}

const getters = {
// TODO make some getters when you have something worthwhile to get
// Maybe put function here to get isLoggedIn, by checking for auth token
}

const mutations = {
  setIsLoggedIn (state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn
  },
  setUsername (state, username) {
    state.username = username
  },
  setSignupErrorMsg (state, signupErrorMsg) {
    state.signupErrorMsg = signupErrorMsg
  },
  setLoginErrorMsg (state, loginErrorMsg) {
    state.loginErrorMsg = loginErrorMsg
  }
}

const actions = {
  // ACCOUNT RELATED API CALLS
  signup: ({ commit }, { username, password }) => {
    console.log('singing up!')
    if (username === undefined || password === undefined) {
      console.log('Login: username or password were undefined. Username: ' + username + ', Password: ' + password)
      return
    }
    return api.signup(username, password).then(response => {
      if (response && response.success !== undefined) {
        if (response.success === false && response.info) {
          commit('setSignupErrorMsg', response.info)
        } else if (response.success === true && response.auth_token) {
          commit('setIsLoggedIn', true)
          // commit('setUsername', username) // Maybe want to keep this in localstroage along with auth if we actually want to use this anywhere
          localStorage.setItem('auth', response.auth_token)
          router.push({ name: 'Home' })
        }
      }
    })
  },
  login: ({ commit }, { username, password }) => {
    console.log('logging in!')
    if (username === undefined || password === undefined) {
      console.log('Login: username or password were undefined. Username: ' + username + ', Password: ' + password)
      return
    }
    return api.login(username, password).then(response => {
      if (response && response.success !== undefined) {
        if (response.success === false && response.info) {
          commit('setLoginErrorMsg', response.info)
        } else if (response.success === true && response.auth_token) {
          commit('setIsLoggedIn', true)
          // commit('setUsername', username)
          localStorage.setItem('auth', response.auth_token)
          router.push({ name: 'Home' })
        }
      }
    })
  },
  logout: ({ commit }) => {
    console.log('logging out!')
    const auth = localStorage.getItem('auth')
    if (auth === null) {
      return
    }
    // could clear auth here before doing api call
    return api.logout(auth).then(response => {
      if (response && response.success !== undefined) {
        if (response.success === true) {
          // Clear local storage - future api calls will fail
          // It may be a better idea to move this above the api call, so we can't make api calls immediately after logging out
          commit('setIsLoggedIn', false)
          localStorage.removeItem('auth')
          router.push({ name: 'Home' })
        }
      }
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
