<template>
  <div class="container">
    <!-- LADO ESQUERDO — texto / call‑to‑action -->
    <section class="text-side">
      <h1>Junte‑se a outros <strong>100mil programadores</strong>.</h1>
      <p>Não possui uma conta? <a href="#">Clique aqui</a>.</p>
      <p class="login-prompt">Faça seu login</p>
    </section>

    <!-- LADO DIREITO — painel de formulário -->
    <form class="form-side">
      <label for="email">E‑mail</label>
      <input id="email" type="email" placeholder="Seu e‑mail" />

      <label for="password">Senha</label>
      <input id="password" type="password" placeholder="Sua senha" />

      <button type="submit">Entrar</button>

      <div class="links">
        <a href="#">Cadastre‑se gratuitamente</a>
        <a href="#">Esqueceu a senha?</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* CONTÊINER GERAL — coloca os dois blocos lado a lado */
.container {
  display: flex;               /* põe lado a lado */
  gap: 10rem;                   /* distância entre texto e formulário */
  justify-content: center;     /* centraliza no viewport */
  align-items: center;
  padding: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
 
  
}

/* BLOCO DE TEXTO */
.text-side {
  flex: 1;                     /* ocupa metade do espaço */
  min-width: 500px;

}

.text-side h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #222;
}

.text-side a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.login-prompt {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #333;
}

/* BLOCO DO FORMULÁRIO */
.form-side {
  flex: 1;                     /* ocupa a outra metade */
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-side label {
  font-weight: 600;
  font-size: 0.95rem;
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

.form-side button:hover {
  background-color: #0056b3;
}

.links {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.links a {
  color: #007bff;
  text-decoration: none;
}

/* RESPONSIVO — empilha quando a tela for estreita */
@media (max-width: 768px) {
  .container {
    flex-direction: column;    /* vira coluna */
    gap: 2rem;
  }
}
</style>
