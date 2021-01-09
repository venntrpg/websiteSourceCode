import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todoTitle: ''
  },
  mutations: {
    todoTitle (state, todoTitle) {
      state.todoTitle = todoTitle
    }
  },
  actions: {
    getTodoTitle: ({ commit }, count) => {
      return api.getTodoTitle(count).then(response => {
        if ('title' in response) {
          commit('todoTitle', response.title)
        }
      })
    }
  },
  modules: {
  }
})
