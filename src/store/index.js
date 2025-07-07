import { createStore } from 'vuex'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'

export default createStore({
  state() {
    return { user: null }
  },

  mutations: {
    SET_USER(state, user)  { state.user = user },
    CLEAR_USER(state)      { state.user = null }
  },

  actions: {
    // LOGIN
    async login({ commit }, { email, password }) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        commit('SET_USER', user)
        return user
      } catch (err) {
        // Mapeia códigos comuns → mensagem amigável
        const map = {
          'auth/invalid-credential' : 'E‑mail ou senha inválidos',
          'auth/user-not-found'     : 'Usuário não encontrado',
          'auth/wrong-password'     : 'E‑mail ou senha inválidos',
          'auth/too-many-requests'  : 'Muitas tentativas – tente novamente em alguns minutos'
        }
        throw new Error(map[err.code] || 'Erro inesperado: ' + err.code)
      }
    },

    // REGISTRO
    async register({ commit }, { email, password }) {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      commit('SET_USER', user)
      return user
    },

    async logout({ commit }) {
      commit('CLEAR_USER')
    }
  },

  getters: {
    isLogged: state => !!state.user
  }
})
