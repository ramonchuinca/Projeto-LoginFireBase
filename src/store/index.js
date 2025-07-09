// store/index.js
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged           // <— NOVO
} from 'firebase/auth'
import { auth } from '@/firebase'

const store = createStore({
  state() {
    return {
      user: null
    }
  },

  mutations: {
    SET_USER (state, user) { state.user = user },
    CLEAR_USER (state)     { state.user = null }
  },

  actions: {
    // ---------- LOGIN ----------
    async login ({ commit }, { email, password }) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        commit('SET_USER', user)
        return user
      } catch (err) {
        const map = {
          'auth/invalid-credential' : 'E‑mail ou senha inválidos',
          'auth/user-not-found'     : 'Usuário não encontrado',
          'auth/wrong-password'     : 'E‑mail ou senha inválidos',
          'auth/too-many-requests'  : 'Muitas tentativas – tente novamente em alguns minutos'
        }
        throw new Error(map[err.code] || 'Erro inesperado: ' + err.code)
      }
    },

    // ---------- REGISTRO ----------
    async register ({ commit }, { email, password }) {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      commit('SET_USER', user)
      return user
    },

    // ---------- LOGOUT ----------
    async logout ({ commit }) {
      await signOut(auth)          // encerra sessão no Firebase
      commit('CLEAR_USER')
    }
  },

  getters: {
    isLogged: state => !!state.user
  },

  // ---------- PERSISTÊNCIA ----------
  plugins: [createPersistedState({
    paths: ['user']               // só grava 'user'
  })]
})

/**
 * Sincroniza Vuex ↔ Firebase a cada refresh
 * (caso o Firebase já tenha a sessão salva em cookie / indexedDB)
 */
onAuthStateChanged(auth, currentUser => {
  if (currentUser) {
    store.commit('SET_USER', currentUser)
  } else {
    store.commit('CLEAR_USER')
  }
})

export default store
