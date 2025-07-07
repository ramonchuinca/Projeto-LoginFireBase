<template>
  <div class="container">
    <div class="text-side">
      <h1>Cadastre-se</h1>
      <p>Já tem uma conta? <router-link to="/login">Faça login</router-link>.</p>
      <p class="register-prompt">Preencha o formulário para criar sua conta</p>
    </div>

    <div class="form-side">
      <input
        v-model.trim="form.email"
        type="email"
        placeholder="Email"
        autocomplete="email"
      />
      <input
        v-model.trim="form.password"
        type="password"
        placeholder="Senha"
        autocomplete="new-password"
      />
      <input
        v-model.trim="form.confirmPassword"
        type="password"
        placeholder="Confirme a senha"
        autocomplete="new-password"
      />
      <button @click="register" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Registrar' }}
      </button>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMsg = ref('')
const loading = ref(false)

const register = async () => {
  errorMsg.value = ''

  if (!form.value.email) {
    errorMsg.value = 'Por favor, insira seu e-mail.'
    return
  }
  if (!form.value.password) {
    errorMsg.value = 'Por favor, insira sua senha.'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = 'As senhas não conferem.'
    return
  }

  loading.value = true

  try {
    await store.dispatch('register', {
      email: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message || 'Erro inesperado ao tentar registrar.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 10rem;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
}

.text-side {
  flex: 1;
  min-width: 500px;
}

.text-side h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #222;
}

.text-side a,
.text-side router-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.register-prompt {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #333;
}

.form-side {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-side input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.form-side button {
  padding: 0.9rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.form-side button:disabled {
  background-color: #7baaf7;
  cursor: not-allowed;
}

.form-side button:hover:not(:disabled) {
  background-color: #0056b3;
}

.error-msg {
  color: red;
  font-weight: 600;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 2rem;
  }

  .text-side {
    min-width: auto;
    text-align: center;
  }
}
</style>
