// Importa funções necessárias do SDK
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBzo5bWS6QcF_00gC-376UblaRn03jJRJ4",
  authDomain: "login-logout-296cc.firebaseapp.com",
  projectId: "login-logout-296cc",
  storageBucket: "login-logout-296cc.appspot.com", // CORRIGIDO aqui também
  messagingSenderId: "59164390692",
  appId: "1:59164390692:web:53f41a6d8400d00f3fafb1"
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)

// Inicializa os serviços que você quer usar
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)

// Exporta para uso nos componentes
export { auth, storage, db }
