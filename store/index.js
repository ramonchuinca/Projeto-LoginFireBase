// src/store/index.js
import { createStore } from 'vuex'

export default createStore({
  // estado reativo compartilhado
  state: {
    user:null,
  },

  // mutações síncronas
  mutations: {

    SET_USER(state, user) {

      state.use = user
    },
     CLEAR_USER (state) {
      state.user = null
     }

  },

  // ações assíncronas
  actions: {
  
  },

  // getters (computed)
  getters: {
    double (state) {
      return state.count * 2
    }
  }
})

