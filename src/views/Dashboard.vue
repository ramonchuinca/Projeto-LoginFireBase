<template>
  <div class="dashboard-container">
    <h1>Bem-vindo ao Dashboard!</h1>
    <p>Você está logado.</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const logout = async () => {
  await store.dispatch('logout')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  font-family: "Segoe UI", sans-serif;
}

button {
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0056b3;
}
</style>
