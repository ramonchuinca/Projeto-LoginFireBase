<template>
  <div class="page-wrapper">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="brand" @click="goHome">
        <img src="@/assets/logo.svg" alt="Logo" />
        <span>MeuApp</span>
      </div>

      <div class="actions">
        <template v-if="user">
          <!-- Avatar botão (troca/remover) -->
          <label class="avatar-wrapper" title="Trocar avatar">
            <img :src="user.photoURL || defaultAvatar" alt="Avatar usuário" class="avatar" />
            <input type="file" accept="image/*" @change="onFileSelect" hidden />
            <button
              v-if="user.photoURL"
              class="remove-avatar"
              @click.prevent="removeAvatar"
              title="Remover avatar"
            >×</button>
          </label>
          <button @click="logout">Sair</button>
        </template>
        <router-link v-else to="/login" class="login-link">Entrar</router-link>
      </div>
    </nav>

    <!-- BANNER / HERO -->
    <section class="banner">
      <h2>Coloque aqui o seu banner ✨</h2>
    </section>

    <!-- DASHBOARD -->
    <main class="dashboard-container">
      <h1>Bem‑vindo ao Dashboard!</h1>
      <p>Você está logado.</p>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getAuth, updateProfile } from 'firebase/auth'
import defaultAvatar from '@/assets/demon-slayer teste.jpg'

// ================= CLOUDINARY CONFIG =====================
// Defina em .env.local (Vite):
// VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload
// VITE_CLOUDINARY_UPLOAD_PRESET=<UPLOAD_PRESET>
// =========================================================

const store  = useStore()
const router = useRouter()
const auth   = getAuth()

const user      = computed(() => store.state.user)
const uploading = ref(false)

const logout = async () => {
  await store.dispatch('logout')
  router.push('/login')
}

const goHome = () => router.push('/')

/**
 * Faz upload de um arquivo para Cloudinary e devolve a URL segura.
 */
const uploadToCloudinary = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: 'POST',
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Falha no upload')
  return data.secure_url
}

// Upload / troca de avatar via Cloudinary
const onFileSelect = async (e) => {
  const file = e.target.files[0]
  if (!file || !auth.currentUser) return
  try {
    uploading.value = true
    const url = await uploadToCloudinary(file)

    await updateProfile(auth.currentUser, { photoURL: url })
    await auth.currentUser.reload()

    store.commit('SET_USER', {
      ...store.state.user,
      photoURL: auth.currentUser.photoURL,
    })
  } catch (err) {
    console.error('Erro ao trocar avatar:', err)
    alert('Não foi possível enviar a imagem.')
  } finally {
    uploading.value = false
  }
}

// Remover avatar (define foto default)
const removeAvatar = async () => {
  if (!auth.currentUser) return
  try {
    await updateProfile(auth.currentUser, { photoURL: '' })
    await auth.currentUser.reload()

    store.commit('SET_USER', { ...store.state.user, photoURL: '' })
  } catch (err) {
    console.error('Erro ao remover avatar:', err)
  }
}
</script>

<style scoped>
/**************************** RESET *****************************/
*,
*::before,
*::after { box-sizing: border-box; margin: 0; padding: 0; }

/*********************** PAGE WRAPPER ***************************/
.page-wrapper { width: 100vw; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-1, #f8f9fb); overflow-x: hidden; }

/************************* NAVBAR *******************************/
.navbar { width: 100%; min-height: 64px; display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 2rem; background: linear-gradient(90deg,#00ff8052 0%, #00ff88 100%); color: #fff; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 6px rgba(0,0,0,.12); }
.brand { display: flex; align-items: center; gap: .75rem; cursor: pointer; user-select: none; }
.brand img { width: 42px; height: 42px; }
.brand span { font-family: 'Segoe UI',sans-serif; font-size: 1.45rem; font-weight: 600; }

.actions { display: flex; align-items: center; gap: 1rem; }
.avatar-wrapper { position: relative; display: inline-block; cursor: pointer; }
.avatar { width: 48px; height: 48px; aspect-ratio: 1; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff80; transition: outline .2s; }
.avatar-wrapper:hover .avatar { outline: 2px solid #fff; }
.remove-avatar { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border: none; border-radius: 50%; background: #ff5252; color: #fff; font-size: 14px; line-height: 20px; text-align: center; cursor: pointer; }
.remove-avatar:hover { background: #ff0000; }

button,
.login-link { padding: .55rem 1.2rem; background: orange; color: #fff; border: 1px solid #ffffff60; border-radius: 6px; font-size: .95rem; cursor: pointer; text-decoration: none; transition: background .2s; }
button:hover,
.login-link:hover { background: #ffb84d; }

/************************* BANNER ******************************/
.banner { width: 100vw; height: 340px; display: flex; align-items: center; justify-content: center; position: relative; }
.banner::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,.35); }
.banner h2 { position: relative; color: #fff; font-family: 'Segoe UI',sans-serif; font-size: clamp(1.5rem,4vw,2.5rem); font-weight: 500; text-shadow: 0 2px 4px rgba(0,0,0,.4); z-index: 1; }

/*********************** DASHBOARD CARD *************************/
.dashboard-container { width: min(92%,960px); margin: 3rem auto; padding: 2.5rem 2rem; text-align: center; font-family: 'Segoe UI',sans-serif; background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,.08); }
.dashboard-container h1 { font-size: clamp(1.8rem,4vw,2.8rem); color: #333; margin-bottom: .75rem; }
.dashboard-container p { font-size: 1.1rem; color: #555; }

@media (max-width: 640px) {
  .navbar { flex-wrap: wrap; padding: .75rem 1rem; }
  .actions { margin-top: .5rem; gap: .5rem; }
  .banner { height: 220px; }
}
</style>

<style>
html,body,#app{width:100vw!important;max-width:none!important;height:100%;margin:0;padding:0;overflow-x:hidden}.container,.wrapper,.content{max-width:none!important;width:100%!important}
</style>