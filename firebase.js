// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Credenciais do Console Firebase
const firebaseConfig = {
 apiKey: "SUA_API_KEY_REAL_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Função para salvar cliente no Firestore
export async function salvarCliente(cliente) {
  try {
    const docRef = await addDoc(collection(db, "clientes"), cliente);
    console.log("Cliente cadastrado no Firebase com sucesso! ID:", docRef.id);
    alert("Cliente cadastrado com sucesso!");
  } catch (erro) {
    console.error("Erro ao salvar cliente no Firebase: ", erro);
    alert("Erro ao salvar cliente. Verifique o console.");
  }
}

// Função para ouvir a lista de clientes em tempo real
export function ouvirClientes(callback) {
  return onSnapshot(collection(db, "clientes"), (snapshot) => {
    const lista = [];
    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    callback(lista);
  }, (erro) => {
    console.error("Erro ao ouvir atualizações dos clientes: ", erro);
  });
}
