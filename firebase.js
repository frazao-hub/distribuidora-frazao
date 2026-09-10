// Importações das bibliotecas do Firebase SDK v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Substitua pelas credenciais do seu Console Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialização
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Salva o cliente na nuvem
export async function salvarCliente(cliente) {
  try {
    await addDoc(collection(db, "clientes"), cliente);
    console.log("Cliente cadastrado no Firebase com sucesso!");
    alert("Cliente cadastrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao salvar cliente no Firebase: ", erro);
    alert("Erro ao salvar cliente. Verifique o console.");
  }
}

// Ouve e atualiza os clientes no PC e Celular em tempo real
export function ouvirClientes(callback) {
  onSnapshot(collection(db, "clientes"), (snapshot) => {
    const lista = [];
    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    callback(lista);
  });
}
