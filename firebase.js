// Importações das bibliotecas do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Substitua pelas credenciais copiadas do seu Console Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialização
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Função para salvar cliente na nuvem
export async function salvarCliente(cliente) {
  try {
    await addDoc(collection(db, "clientes"), cliente);
    console.log("Cliente salvo no Firebase!");
  } catch (erro) {
    console.error("Erro ao salvar cliente: ", erro);
  }
}

// Função para escutar mudanças no banco e atualizar em tempo real
export function ouvirClientes(callback) {
  onSnapshot(collection(db, "clientes"), (snapshot) => {
    const lista = [];
    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    callback(lista);
  });
}
