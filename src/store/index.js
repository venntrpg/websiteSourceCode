import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'
import router from '@/router/index'

Vue.use(Vuex)

// TDOD add helper function for logging out the user if they've timed out.

const state = {
  isLoggedIn: false, // This variable is set in App.vue on loading the website
  username: '',
  signupErrorMsg: '',
  loginErrorMsg: '',
  characters: {},
  randomNames: []
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
  },
  clearCharactersList (state) {
    state.characters.clear()
  },
  addToCharactersList (state, character) {
    state.characters.set(character.id, character)
  },
  appendRandomNames (state, randomNames) {
    state.randomNames = state.randomNames.concat(randomNames)
  },
  shiftRandomNames (state) {
    state.randomNames.shift()
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
  },

  // CHARACTER RELATED API CALLS
  createCharacter: ({ commit }, { character }) => {
    const auth = localStorage.getItem('auth')
    if (auth === null) {
      return
    }
    return api.login(auth, character).then(response => {
      if (response && response.success && response.success === true) {
        console.log(response)
        // add the new id to our current character data, and append it to the character list.
        character.set('id', response.id)
        commit('addToCharactersList', character)
      }
    })
  },

  listCharacters: ({ commit }) => {
    const auth = localStorage.getItem('auth')
    if (auth === null) {
      return
    }
    return api.listCharacters(auth).then(response => {
      if (response && response.success && response.success === true) {
        console.log(response)
        // It would be pretty neat if we called getCharacter automatically for every id we get here automatically. idk
        // Maybe we just need a new api that doesn't require that we ask for this info twice
      }
    })
  },

  // RANDOM OTHER API CALLS

  getRandomNames: ({ commit }) => {
    return api.getRandomNames().then(response => {
      if (response.length && response.length > 0) {
        commit('appendRandomNames', response)
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
