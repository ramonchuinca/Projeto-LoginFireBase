<template>
  <div class="main-login">
    <!-- LADO ESQUERDO (TEXTO / IMAGEM / SLIDESHOW) -->
    <div class="left-login">
      <div class="logo">
        <img src="https://res.cloudinary.com/dpcloudinary/image/upload/v1506186248/logo.png" alt="Logo" />
      </div>
      <h1>Faça login e <br />Entre para nosso time</h1>
      <img
        class="img"
        src="https://content.gnoss.ws/imagenes/Usuarios/ImagenesCKEditor/989fc5b2-d0cc-419e-befa-c575b97b9160/c6699bd3-3658-4705-b70a-75bbd88a9f7f.png"
        alt="banner"
      />

      <!-- SLIDESHOW -->
      <transition-group name="slide" tag="div" class="slides">
        <div
          v-for="(s, i) in slides"
          :key="i"
          v-show="currentSlide === i"
          class="slide"
        >
          <h2><span>{{ s.title }}</span></h2>
          <p>{{ s.text }}</p>
        </div>
      </transition-group>

      <p class="register-link">
        Não possui uma conta?
        <router-link to="/register">Cadastre‑se</router-link>.
      </p>
      <button class="link-as-button" @click="showTerms = true">Termos de Serviço</button>
    </div>

    <!-- LADO DIREITO (FORMULÁRIOS) -->
    <div class="rigth-login">
      <div class="card-login">
        <h1 class="title">{{ tab === 'login' ? 'Login' : 'Criar conta' }}</h1>
        <div class="tabs">
          <button :class="{ active: tab === 'login' }" @click="tab = 'login'">Login</button>
          <button :class="{ active: tab === 'signup' }" @click="tab = 'signup'">Sign&nbsp;Up</button>
        </div>

        <!-- LOGIN FORM -->
        <form v-if="tab === 'login'" @submit.prevent="login" class="login-form">
          <input
            v-model.trim="form.email"
            type="email"
            placeholder="Email"
            autocomplete="username"
            class="input"
          />
          <input
            v-model.trim="form.password"
            type="password"
            placeholder="Senha"
            autocomplete="current-password"
            class="input"
          />
          <label class="remember"><input type="checkbox" v-model="remember" /> Lembrar‑me</label>
          <button class="button" :disabled="loading">
            {{ loading ? 'Entrando…' : 'Entrar' }}
          </button>
          <p class="help">
            <a href="#" @click.prevent="showRecovery = true">Esqueceu a senha?</a>
          </p>
          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        </form>

        <!-- SIGN‑UP FORM -->
        <form v-else @submit.prevent="register" class="signup-form">
          <input v-model.trim="signup.email" type="email" placeholder="Email" class="input" />
          <input v-model.trim="signup.password" type="password" placeholder="Senha" class="input" />
          <input v-model.trim="signup.password_confirmation" type="password" placeholder="Confirmar senha" class="input" />
          <button class="button" :disabled="loadingSignup">
            {{ loadingSignup ? 'Criando…' : 'Criar conta' }}
          </button>
          <p class="tos-text small">
            Ao cadastrar‑se você concorda com nossos
            <a href="#" @click.prevent="showTerms = true">Termos de Serviço</a>.
          </p>
          <p v-if="signupMsg" class="success-msg">{{ signupMsg }}</p>
        </form>
      </div>
    </div>

    <!-- MODAL: TERMOS DE SERVIÇO -->
    <dialog v-if="showTerms" class="modal terms">
      <button class="close" @click="showTerms = false">×</button>
      <h2>dp Terms of Service</h2>
      <p class="small">Last modified: September 23, 2017</p>
      <h3>Welcome to dp</h3>
      <p>By using our Services, you are agreeing to these terms. Please read them carefully.</p>
      <p class="small mt">Conteúdo completo disponível em nosso site.</p>
    </dialog>

    <!-- MODAL: RECUPERAÇÃO DE SENHA -->
    <dialog v-if="showRecovery" class="modal recovery">
      <button class="close" @click="showRecovery = false">×</button>
      <h2>Recuperar senha</h2>
      <p>Informe email ou usuário e clique em <strong>Enviar</strong></p>
      <form @submit.prevent="sendRecovery" class="recovery-form">
        <input v-model.trim="recovery" type="text" class="input" placeholder="Email ou usuário" />
        <button class="button" :disabled="loadingRecovery">
          {{ loadingRecovery ? 'Enviando…' : 'Enviar' }}
        </button>
      </form>
      <p v-if="recoveryMsg" class="info-msg">{{ recoveryMsg }}</p>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// === Controle de abas e modais ===
const tab = ref('login')
const showTerms = ref(false)
const showRecovery = ref(false)
const remember = ref(true)

// === Estados de formulários ===
const form = reactive({ email: '', password: '' })
const signup = reactive({ email: '', username: '', password: '' })
const recovery = ref('')

// === Estados de carregamento e mensagens ===
const loading = ref(false)
const loadingSignup = ref(false)
const loadingRecovery = ref(false)
const errorMsg = ref('')
const signupMsg = ref('')
const recoveryMsg = ref('')

// === Slides do lado esquerdo ===
const slides = [
  { title: 'EVENTOS', text: 'Participe de centenas de eventos em todo o país.' },
  { title: 'APRENDIZADO', text: 'Milhares de aulas e tutoriais on‑line.' },
  { title: 'GRUPOS', text: 'Crie grupos e conecte‑se com pessoas que compartilham interesses.' },
  { title: 'COMPARTILHAMENTO', text: 'Compartilhe seus trabalhos e conhecimentos com a comunidade.' }
]
const currentSlide = ref(0)

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 4000)
})

// === Função de login ===
const login = async () => {
  errorMsg.value = ''

  if (!form.email) {
    errorMsg.value = 'Por favor, insira seu e‑mail.'
    return
  }
  if (!form.password) {
    errorMsg.value = 'Por favor, insira sua senha.'
    return
  }

  console.log('Tentando login com:', { ...form })

  loading.value = true
  try {
    await store.dispatch('login', { email: form.email, password: form.password, remember: remember.value })
    await router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Erro inesperado ao tentar logar.'
  } finally {
    loading.value = false
  }
}

// === Função de cadastro ===
const register = () => {
  signupMsg.value = ''

  if (!signup.email || !signup.username || !signup.password) {
    signupMsg.value = 'Preencha todos os campos.'
    return
  }

  loadingSignup.value = true
  setTimeout(() => {
    loadingSignup.value = false
    signupMsg.value = 'Conta criada! Faça login.'
    tab.value = 'login'
  }, 1500)
}

// === Função de recuperação de senha ===
const sendRecovery = () => {
  recoveryMsg.value = ''

  if (!recovery.value) {
    recoveryMsg.value = 'Informe email ou usuário.'
    return
  }

  loadingRecovery.value = true
  setTimeout(() => {
    loadingRecovery.value = false
    recoveryMsg.value = 'Enviamos instruções para o seu email.'
  }, 1000)
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap");
html,body{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
  overflow-x:hidden;
  background:#201b2c; /* fallback caso main-login não cubra */
}

:root {
  --bg-1: #201b2c;
  --bg-2: #2f2841;
  --accent: #00ff88;
  --accent-soft: #00ff8052;
  --input-bg: #3d3455;
  --input-border: #514869;
  --text-light: #f0ffffde;
  --text-placeholder: #f0ffff94;
  --radius: 12px;
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  --transition: 0.25s ease;
}
*{
  margin:0;
  padding:0;
  box-sizing:border-box; /* restaurado para evitar soma de padding na largura */
  font-family:"Poppins",sans-serif;
}

/********  LAYOUT PRINCIPAL  ********/ 
.main-login {
  width: 100vw;            /* garante cobertura completa da viewport */
  max-width: 100%;         /* nunca ultrapassa a viewport */
  min-height: 100vh;       /* altura total da viewport */
  background: var(--bg-1);
  display: flex;           /* colunas lado a lado */
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center; /* centraliza as colunas sem empurrar laterais */
  align-items: center;    /* estica verticalmente */
  overflow-x: hidden;      /* previne rolagem horizontal */
  gap: 0;                  /* sem espaço que possa ultrapassar largura */
  padding: 0 2rem;         /* margem interna opcional */
  position: relative;
  left: -30vh;
}
.left-login,
.rigth-login {
  flex: 1 1 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.left-login h1 {
  color: var(--accent);
  font-size: clamp(1.5rem, 3vw, 3rem);
  text-align: center;
  margin-bottom: 1.5rem;
}
.img {
  width: clamp(250px, 38vw, 500px);
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6));
}

/********  CARD DE LOGIN  ********/ 
.card-login {
  width: min(90%, 420px);
  background: var(--bg-2);
  padding: 3rem 2.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
}
.card-login h1.title {
  color: var(--accent);
  font-size: 1.75rem;
  text-align: center;
}

/********  TABS  ********/ 
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.tabs button {
  border: none;
  background: transparent;
  color: var(--text-light);
  padding-bottom: 4px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  transition: var(--transition);
}
.tabs button.active {
  color: var(--accent);
}
.tabs button.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: var(--accent);
}

/********  INPUTS  ********/ 
.input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid transparent;
  border-radius: var(--radius);
  background: var(--input-bg);
  color: var(--text-light);
  font-size: 0.95rem;
  transition: var(--transition);
  margin-bottom: 1.25rem;   /* espaçamento maior entre inputs */
}
.input::placeholder {
  color: var(--text-placeholder);
}
.input:focus {
  outline: none;
  border-color: var(--accent);
  background: #443b5d;
  box-shadow: 0 0 0 2px var(--accent-soft);
}

/********  CHECKBOX + LABEL  ********/ 
.remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
  user-select: none;
}
.remember input[type="checkbox"] {
  accent-color: var(--accent);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/********  BOTÕES  ********/ 
.button,
.link-as-button,
.btn-login {
  display: inline-block;
  width: 100%;
  padding: 0.9rem 1rem;
  border: none;
  border-radius: var(--radius);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--accent);
  color: #2b134b;
  cursor: pointer;
  box-shadow: 0 6px 20px -6px var(--accent-soft);
  transition: var(--transition);
}
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -8px var(--accent-soft);
}
.link-as-button {
  width: auto;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 2px solid var(--accent);
  color: var(--accent);
  box-shadow: none;
}
.link-as-button:hover {
  background: var(--accent);
  color: #2b134b;
}

/********  MENSAGENS  ********/ 
.error-msg {
  background: #ff4d4f;
  padding: 0.6rem 1rem;
  border-radius: var(--radius);
  color: #fff;
  font-size: 0.85rem;
  text-align: center;
  animation: shake 0.3s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.success-msg {
  background: #28a745;
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  text-align: center;
}

/********  RESPONSIVO  ********/ 
@media (max-width: 900px) {
  .main-login { flex-direction: column; }
  .left-login, .rigth-login { width: 100%; height: auto; }
  .left-login h1 { font-size: 1.8rem; margin-top: 1.5rem; }
  .img { width: 60vw; }
  .card-login { width: 90%; margin-bottom: 2rem; }
}
</style>

