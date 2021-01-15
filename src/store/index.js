import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'

Vue.use(Vuex)

const state = {
  username: '',
  signupResult: {},
  loginResult: {},
  logoutResult: ''
}

const getters = {
  signupSuccess: state => {
    return state.signupResult && state.signupResult.success && state.signupResult.success === 1
  },
  signupErrorMessage: state => {
    return state.signupResult && state.signupResult.info
  },
  loginSuccess: state => {
    return state.loginResult && state.loginResult.success && state.loginResult.success === 1
  },
  loginErrorMessage: state => {
    return state.loginResult && state.loginResult.info
  },
  logoutResult: state => {
    return state.logoutResult && state.logoutResult.success && state.logoutResult.success === 1
  }
}

const mutations = {
  username (state, username) {
    state.username = username
  },
  signupResult (state, signupResult) {
    state.signupResult = signupResult
  },
  loginResult (state, loginResult) {
    state.loginResult = loginResult
  },
  logoutResult (state, logoutResult) {
    state.logoutResult = logoutResult
  }
}

const actions = {
  // ACCOUNT RELATED API CALLS
  signup: ({ commit }, { username, password }) => {
    return api.signup(username, password).then(response => {
      if (response) {
        if (response.success && response.success === 1 && response.auth_token) {
          commit('username', username)
          localStorage.setItem('auth', response.auth_token)
        }
        commit('signupResult', response)
      }
    })
  },
  login: ({ commit }, { username, password }) => {
    return api.login(username, password).then(response => {
      if (response) {
        if (response.success && response.success === 1 && response.auth_token) {
          commit('username', username)
          localStorage.setItem('auth', response.auth_token)
        }
        commit('loginResult', response)
      }
    })
  },
  logout: ({ commit }) => {
    if (!localStorage.getItem('auth')) {
      return
    }
    return api.logout(localStorage.getItem('auth')).then(response => {
      if (response) {
        commit('logoutResult', response)
        if (response.success && response.success === 1) {
          // Clear local storage - future api calls will fail
          // It may be a better idea to move this above the api call, so we can't make api calls immediately
          localStorage.removeItem('auth')
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
